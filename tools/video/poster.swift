import AVFoundation
import CoreImage
import Foundation

/* poster <in.mp4> <out.jpg> <width> <height> <quality>  — 첫 프레임을 포스터로

   ⚠ NSImage.lockFocus() 를 쓰지 말 것. Retina 에서 **백킹 스케일 2배**로 렌더되어
     tiffRepresentation 이 지정 크기의 4배 픽셀을 담는다(800x1000 을 줬는데 1600x2000).
     로그에는 인자를 그대로 찍으니 맞아 보이고 **용량만 이상하게 커진다.**
   ⚠ NSBitmapImageRep + NSGraphicsContext 로 바꿔 봤더니 이번엔 **새까맣게** 나왔다.
     CIContext 로 렌더한다 — enc.swift 와 같은 경로라 동작이 검증돼 있다. */
let a = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let g = AVAssetImageGenerator(asset: asset)
g.appliesPreferredTrackTransform = true
g.requestedTimeToleranceBefore = .zero; g.requestedTimeToleranceAfter = .zero
let cg = try! g.copyCGImage(at: .zero, actualTime: nil)
let W = Int(a[3])!, H = Int(a[4])!, q = Double(a[5])!

var img = CIImage(cgImage: cg)
img = img.transformed(by: CGAffineTransform(scaleX: CGFloat(W) / img.extent.width,
                                            y: CGFloat(H) / img.extent.height))
  .cropped(to: CGRect(x: 0, y: 0, width: CGFloat(W), height: CGFloat(H)))
let ci = CIContext()
let d = ci.jpegRepresentation(of: img, colorSpace: CGColorSpaceCreateDeviceRGB(),
                              options: [kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption: q])!
try! d.write(to: URL(fileURLWithPath: a[2]))

// 빈 이미지 방어 — 캔버스 픽셀을 세서 실제로 그려졌는지 확인한다(§11.5-5 와 같은 원칙)
var buf = [UInt8](repeating: 0, count: W * H * 4)
buf.withUnsafeMutableBytes { p in
  ci.render(img, toBitmap: p.baseAddress!, rowBytes: W * 4,
            bounds: img.extent, format: .RGBA8, colorSpace: CGColorSpaceCreateDeviceRGB())
}
var lit = 0
for i in stride(from: 0, to: buf.count, by: 4) where Int(buf[i]) + Int(buf[i+1]) + Int(buf[i+2]) > 24 { lit += 1 }
let pct = Double(lit) / Double(W * H) * 100
print(String(format: "%@  %dx%d  %.0fKB  유효픽셀 %.1f%%%@",
  (a[2] as NSString).lastPathComponent, W, H, Double(d.count)/1024, pct,
  pct < 5 ? "  ← ⚠ 거의 검다" : ""))
