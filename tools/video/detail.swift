import AVFoundation
import AppKit
import Foundation

/* detail <out.png> <t초> <cx> <cy> <크롭폭> <파일…>
   보이는 영역 안의 한 지점을 **1:1 픽셀로** 잘라 나란히 붙인다.
   표시 크기 비교는 차이를 가린다 — 뭉갬·블록노이즈는 등배로 봐야 보인다(§11.7). */
let out = CommandLine.arguments[1]
let t = Double(CommandLine.arguments[2])!
let cx = Double(CommandLine.arguments[3])!, cy = Double(CommandLine.arguments[4])!  // 0~1 상대좌표
let cw = CGFloat(Int(CommandLine.arguments[5])!)
let files = Array(CommandLine.arguments.dropFirst(6))
let BOX_AR: CGFloat = 0.8
let ZOOM: CGFloat = 2                                   // 등배가 작아서 2배로 띄운다

var tiles: [(String, NSImage)] = []
for p in files {
  let a = AVURLAsset(url: URL(fileURLWithPath: p))
  let g = AVAssetImageGenerator(asset: a)
  g.appliesPreferredTrackTransform = true
  g.requestedTimeToleranceBefore = .zero; g.requestedTimeToleranceAfter = .zero
  guard let cg = try? g.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 600), actualTime: nil)
  else { continue }
  // 먼저 '보이는 영역'으로 좁힌다(소스가 21:9 든 0.8 이든 같은 화각이 되도록)
  let w = CGFloat(cg.width), h = CGFloat(cg.height)
  let vw = min(w, h * BOX_AR), vh = min(h, w / BOX_AR)
  let vis = cg.cropping(to: CGRect(x: (w - vw)/2, y: (h - vh)/2, width: vw, height: vh))!
  // 해상도가 파일마다 다르므로 공통 기준(1440x1800)으로 맞춘 뒤 같은 지점을 자른다
  let base = NSImage(size: NSSize(width: 1440, height: 1800))
  base.lockFocus()
  NSImage(cgImage: vis, size: NSSize(width: vis.width, height: vis.height))
    .draw(in: NSRect(x: 0, y: 0, width: 1440, height: 1800))
  base.unlockFocus()
  let brep = NSBitmapImageRep(data: base.tiffRepresentation!)!
  let scale = CGFloat(brep.pixelsWide) / 1440       // Retina 백킹 보정
  let ch = cw * 1800 / 1440
  let cxf: CGFloat = CGFloat(cx)
  let cyf: CGFloat = CGFloat(cy)
  let rx: CGFloat = (cxf * 1440.0 - cw / 2.0) * scale
  let ry: CGFloat = ((1.0 - cyf) * 1800.0 - ch / 2.0) * scale
  let rw: CGFloat = cw * scale
  let rh: CGFloat = ch * scale
  let rect = CGRect(x: rx, y: ry, width: rw, height: rh)
  let piece = brep.cgImage!.cropping(to: rect)!
  let im = NSImage(size: NSSize(width: cw * ZOOM, height: ch * ZOOM))
  im.lockFocus()
  NSGraphicsContext.current?.imageInterpolation = .none
  NSImage(cgImage: piece, size: NSSize(width: piece.width, height: piece.height))
    .draw(in: NSRect(x: 0, y: 0, width: cw * ZOOM, height: ch * ZOOM))
  im.unlockFocus()
  tiles.append(((p as NSString).lastPathComponent, im))
}
let TW = cw * ZOOM, TH = cw * 1800 / 1440 * ZOOM
let pad: CGFloat = 6, lab: CGFloat = 22
let W = (TW + pad) * CGFloat(tiles.count) + pad, H = TH + lab + pad * 2
let img = NSImage(size: NSSize(width: W, height: H))
img.lockFocus()
NSColor.black.setFill(); NSRect(x: 0, y: 0, width: W, height: H).fill()
for (i, tl) in tiles.enumerated() {
  let x = pad + (TW + pad) * CGFloat(i)
  tl.1.draw(in: NSRect(x: x, y: pad, width: TW, height: TH))
  NSString(string: tl.0).draw(at: NSPoint(x: x, y: pad + TH + 3),
    withAttributes: [.foregroundColor: NSColor.white, .font: NSFont.boldSystemFont(ofSize: 15)])
}
img.unlockFocus()
let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: out))
print("→ \(out)")
