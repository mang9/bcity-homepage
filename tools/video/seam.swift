import AVFoundation
import CoreImage
import Foundation

// seam <파일…> — 마지막 프레임과 첫 프레임의 차이(루프가 튀는지)
let ci = CIContext()
func px(_ img: CIImage, _ w: Int, _ h: Int) -> [UInt8] {
  var b = [UInt8](repeating: 0, count: w*h*4)
  b.withUnsafeMutableBytes { p in
    ci.render(img.transformed(by: CGAffineTransform(scaleX: CGFloat(w)/img.extent.width,
                                                    y: CGFloat(h)/img.extent.height)),
              toBitmap: p.baseAddress!, rowBytes: w*4,
              bounds: CGRect(x: 0, y: 0, width: w, height: h),
              format: .RGBA8, colorSpace: CGColorSpaceCreateDeviceRGB())
  }
  return b
}
for p in CommandLine.arguments.dropFirst() {
  let a = AVURLAsset(url: URL(fileURLWithPath: p))
  let g = AVAssetImageGenerator(asset: a)
  g.appliesPreferredTrackTransform = true
  g.requestedTimeToleranceBefore = .zero; g.requestedTimeToleranceAfter = .zero
  let dur = CMTimeGetSeconds(a.duration)
  guard let f0 = try? g.copyCGImage(at: .zero, actualTime: nil),
        let fL = try? g.copyCGImage(at: CMTime(seconds: dur - 1.0/24, preferredTimescale: 600),
                                    actualTime: nil) else { continue }
  let W = 160, H = 200
  let A = px(CIImage(cgImage: f0), W, H), B = px(CIImage(cgImage: fL), W, H)
  var se = 0.0; var n = 0
  for i in stride(from: 0, to: A.count, by: 4) {
    for k in 0..<3 { let d = Double(Int(A[i+k]) - Int(B[i+k])); se += d*d; n += 1 }
  }
  let mse = se/Double(n)
  let psnr = mse > 0 ? 10*log10(255*255/mse) : 99
  print(String(format: "%@  끝↔처음 차이 %.1f dB  %@", (p as NSString).lastPathComponent, psnr,
    psnr > 30 ? "부드럽게 이어짐" : (psnr > 18 ? "약간 튄다" : "확 튄다(컷)")))
}
