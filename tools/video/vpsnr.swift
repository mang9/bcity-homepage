import AVFoundation
import CoreImage
import Foundation

/* vpsnr <원본> <후보…>
   화면에 **실제로 보이는 영역만** 비교한다.
   .dz-right 는 데스크톱 1440 에서 720x900(세로 0.8)이고 object-fit:cover 라
   21:9 소스는 가운데 34.3% 폭만 노출된다 — 전체 프레임 PSNR 은 안 보이는 곳까지
   평균에 넣어 판단을 흐린다(§11.7 의 '구간별로 봐야 한다'와 같은 이유). */
let BOX_AR: CGFloat = 720.0 / 900.0          // 슬롯 비율
let OUT_W = 1440, OUT_H = 1800               // DPR2 실제 픽셀

func visibleFrames(_ path: String, _ times: [Double]) -> [CIImage] {
  let a = AVURLAsset(url: URL(fileURLWithPath: path))
  let g = AVAssetImageGenerator(asset: a)
  g.appliesPreferredTrackTransform = true
  g.requestedTimeToleranceBefore = .zero; g.requestedTimeToleranceAfter = .zero
  var out: [CIImage] = []
  for t in times {
    let ct = CMTime(seconds: t, preferredTimescale: 600)
    guard let cg = try? g.copyCGImage(at: ct, actualTime: nil) else { continue }
    var img = CIImage(cgImage: cg)
    // cover: 세로를 채우고 가운데를 자른다
    let e = img.extent
    let cw = e.height * BOX_AR
    img = img.cropped(to: CGRect(x: e.midX - cw / 2, y: e.minY, width: cw, height: e.height))
      .transformed(by: CGAffineTransform(translationX: -(e.midX - cw / 2), y: -e.minY))
    img = img.transformed(by: CGAffineTransform(scaleX: CGFloat(OUT_W) / cw,
                                                y: CGFloat(OUT_H) / e.height))
    out.append(img.cropped(to: CGRect(x: 0, y: 0, width: CGFloat(OUT_W), height: CGFloat(OUT_H))))
  }
  return out
}

func bytes(_ img: CIImage, _ ci: CIContext) -> [UInt8] {
  var buf = [UInt8](repeating: 0, count: OUT_W * OUT_H * 4)
  buf.withUnsafeMutableBytes { p in
    ci.render(img, toBitmap: p.baseAddress!, rowBytes: OUT_W * 4,
              bounds: CGRect(x: 0, y: 0, width: OUT_W, height: OUT_H),
              format: .RGBA8, colorSpace: CGColorSpaceCreateDeviceRGB())
  }
  return buf
}

let ci = CIContext()
let times = stride(from: 0.3, through: 7.8, by: 0.5).map { $0 }
let ref = visibleFrames(CommandLine.arguments[1], times).map { bytes($0, ci) }

for cand in CommandLine.arguments.dropFirst(2) {
  let cf = visibleFrames(cand, times).map { bytes($0, ci) }
  var per: [(Double, Double)] = []
  for (i, c) in cf.enumerated() where i < ref.count {
    var se = 0.0; var n = 0
    for j in stride(from: 0, to: c.count, by: 4) {
      for k in 0..<3 { let d = Double(Int(c[j+k]) - Int(ref[i][j+k])); se += d*d; n += 1 }
    }
    let mse = se / Double(n)
    per.append((times[i], mse > 0 ? 10 * log10(255*255/mse) : 99))
  }
  let avg = per.map { $0.1 }.reduce(0,+) / Double(per.count)
  let worst = per.min { $0.1 < $1.1 }!
  let name = (cand as NSString).lastPathComponent
  print(name.padding(toLength: 14, withPad: " ", startingAt: 0)
    + String(format: "  평균 %.2f dB   최악 %.2f dB (t=%.1fs)", avg, worst.1, worst.0))
}
