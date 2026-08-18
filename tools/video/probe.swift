import AVFoundation
import Foundation

for path in CommandLine.arguments.dropFirst() {
  let a = AVURLAsset(url: URL(fileURLWithPath: path))
  let dur = CMTimeGetSeconds(a.duration)
  guard let t = a.tracks(withMediaType: .video).first else { print("\(path)\tNO VIDEO"); continue }
  let sz = t.naturalSize.applying(t.preferredTransform)
  let w = abs(sz.width), h = abs(sz.height)
  var codec = "?"
  if let d = t.formatDescriptions.first {
    let f = d as! CMFormatDescription
    let c = CMFormatDescriptionGetMediaSubType(f)
    codec = String(bytes: [UInt8(c >> 24 & 255), UInt8(c >> 16 & 255),
                           UInt8(c >> 8 & 255), UInt8(c & 255)], encoding: .ascii) ?? "?"
  }
  let audio = a.tracks(withMediaType: .audio).count
  let bytes = (try? FileManager.default.attributesOfItem(atPath: path)[.size] as? Int) ?? 0
  let mb = Double(bytes ?? 0) / 1048576.0
  let kbps = dur > 0 ? Double(t.estimatedDataRate) / 1000.0 : 0
  print(String(format: "%@\t%.0fx%.0f\t%.2fs\t%.1ffps\t%.0fkbps\t%.2fMB\t%@\taudio:%d",
    (path as NSString).lastPathComponent, w, h, dur, t.nominalFrameRate, kbps, mb, codec, audio))
}
