import AVFoundation
import AppKit
import Foundation

/* vsheet <출력png> <t초> <파일…> — 각 영상에서 같은 시점의 **보이는 영역**(세로 0.8 크롭)을
   720x900 으로 뽑아 가로로 나란히 붙인다. 화면에서 보게 될 것과 같은 화각·같은 배율이다. */
let out = CommandLine.arguments[1]
let t = Double(CommandLine.arguments[2])!
let files = Array(CommandLine.arguments.dropFirst(3))
let BOX_AR: CGFloat = 0.8, TW: CGFloat = 720, TH: CGFloat = 900

var tiles: [(String, NSImage)] = []
for p in files {
  let a = AVURLAsset(url: URL(fileURLWithPath: p))
  let g = AVAssetImageGenerator(asset: a)
  g.appliesPreferredTrackTransform = true
  g.requestedTimeToleranceBefore = .zero; g.requestedTimeToleranceAfter = .zero
  guard let cg = try? g.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 600), actualTime: nil)
  else { continue }
  let w = CGFloat(cg.width), h = CGFloat(cg.height)
  let cw = min(w, h * BOX_AR), ch = min(h, w / BOX_AR)
  let crop = cg.cropping(to: CGRect(x: (w - cw)/2, y: (h - ch)/2, width: cw, height: ch))!
  let im = NSImage(size: NSSize(width: TW, height: TH))
  im.lockFocus()
  NSImage(cgImage: crop, size: NSSize(width: crop.width, height: crop.height))
    .draw(in: NSRect(x: 0, y: 0, width: TW, height: TH))
  im.unlockFocus()
  tiles.append(((p as NSString).lastPathComponent, im))
}
let pad: CGFloat = 6, lab: CGFloat = 24
let W = (TW + pad) * CGFloat(tiles.count) + pad, H = TH + lab + pad * 2
let img = NSImage(size: NSSize(width: W, height: H))
img.lockFocus()
NSColor.black.setFill(); NSRect(x: 0, y: 0, width: W, height: H).fill()
for (i, tl) in tiles.enumerated() {
  let x = pad + (TW + pad) * CGFloat(i)
  tl.1.draw(in: NSRect(x: x, y: pad, width: TW, height: TH))
  NSString(string: tl.0).draw(at: NSPoint(x: x, y: pad + TH + 4),
    withAttributes: [.foregroundColor: NSColor.white, .font: NSFont.boldSystemFont(ofSize: 16)])
}
img.unlockFocus()
let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: out))
print("→ \(out) \(Int(W))x\(Int(H))")
