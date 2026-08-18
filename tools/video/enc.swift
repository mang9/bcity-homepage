import AVFoundation
import CoreImage
import CoreVideo
import Foundation

// enc <in> <out> <width> <height> <kbps>   — 스케일 + H.264 재인코딩, 오디오 제거
let args = CommandLine.arguments
let inURL = URL(fileURLWithPath: args[1]), outURL = URL(fileURLWithPath: args[2])
let W = Int(args[3])!, H = Int(args[4])!, kbps = Int(args[5])!
// 7번째 인수(선택): "hevc" 를 주면 HEVC 로 굽는다(§4.2 듀얼 코덱)
let useHEVC = args.count > 7 && args[7] == "hevc"
// 6번째 인수(선택): 가운데를 이 가로세로비로 먼저 잘라낸다.
// 슬롯이 세로인데 소스가 21:9 라 어차피 안 보이는 폭을 인코딩에서 빼기 위한 것이다.
let cropAR: CGFloat? = args.count > 6 ? CGFloat(Double(args[6])!) : nil
try? FileManager.default.removeItem(at: outURL)

let asset = AVURLAsset(url: inURL)
guard let track = asset.tracks(withMediaType: .video).first else { fatalError("영상 트랙 없음") }

let reader = try! AVAssetReader(asset: asset)
let rOut = AVAssetReaderTrackOutput(track: track, outputSettings: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
rOut.alwaysCopiesSampleData = false
reader.add(rOut)

let writer = try! AVAssetWriter(outputURL: outURL, fileType: .mp4)
let wIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: useHEVC ? AVVideoCodecType.hevc : AVVideoCodecType.h264,
  AVVideoWidthKey: W, AVVideoHeightKey: H,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: kbps * 1000,
    AVVideoMaxKeyFrameIntervalKey: 48,     // 24fps → 2초마다 키프레임(루프·시킹 대비)
  ]])
wIn.expectsMediaDataInRealTime = false
/* ⚠ **반드시 켤 것.** 끄면 moov 아톰이 파일 **끝**에 놓여, 브라우저가 파일을 통째로
     내려받기 전에는 첫 프레임도 못 띄운다(4.8MB 클립이면 전부 받아야 시작).
     2026-08-18 에 실제로 이걸 빠뜨려 구역 영상 8개가 faststart 를 잃었다 —
     교체 전 영상은 ftyp·moov·mdat 였는데 새로 구운 것은 ftyp·mdat·moov 였다.
   검증: 최상위 아톰 순서에서 moov 가 mdat **앞**에 있어야 한다. */
writer.shouldOptimizeForNetworkUse = true
writer.add(wIn)

// ⚠ adaptor.pixelBufferPool 은 startWriting 전에는 nil 이다. 풀을 직접 만든다.
var pool: CVPixelBufferPool?
CVPixelBufferPoolCreate(nil, nil, [
  kCVPixelBufferPixelFormatTypeKey: kCVPixelFormatType_32BGRA,
  kCVPixelBufferWidthKey: W, kCVPixelBufferHeightKey: H,
  kCVPixelBufferIOSurfacePropertiesKey: [:] as CFDictionary,
] as CFDictionary, &pool)
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: wIn, sourcePixelBufferAttributes: nil)

let ci = CIContext()
guard writer.startWriting() else { fatalError("startWriting 실패: \(writer.error!)") }
writer.startSession(atSourceTime: .zero)
guard reader.startReading() else { fatalError("startReading 실패: \(reader.error!)") }

var n = 0
while true {
  if !wIn.isReadyForMoreMediaData { usleep(2000); continue }
  guard let sb = rOut.copyNextSampleBuffer() else { break }
  guard let px = CMSampleBufferGetImageBuffer(sb) else { continue }
  let t = CMSampleBufferGetPresentationTimeStamp(sb)
  var img = CIImage(cvPixelBuffer: px)
  if let ar = cropAR {
    let e = img.extent
    let cw = min(e.width, e.height * ar), ch = min(e.height, e.width / ar)
    img = img.cropped(to: CGRect(x: e.midX - cw/2, y: e.midY - ch/2, width: cw, height: ch))
      .transformed(by: CGAffineTransform(translationX: -(e.midX - cw/2), y: -(e.midY - ch/2)))
  }
  img = img.transformed(by: CGAffineTransform(scaleX: CGFloat(W) / img.extent.width,
                                              y: CGFloat(H) / img.extent.height))
  // 다운스케일 뒤 미세 선명화 — §4.3 upscale.swift 와 같은 관용구
  img = img.applyingFilter("CIUnsharpMask",
                           parameters: [kCIInputRadiusKey: 1.1, kCIInputIntensityKey: 0.32])
  var out: CVPixelBuffer?
  CVPixelBufferPoolCreatePixelBuffer(nil, pool!, &out)
  ci.render(img, to: out!)
  if !adaptor.append(out!, withPresentationTime: t) { fatalError("append 실패: \(writer.error!)") }
  n += 1
}
wIn.markAsFinished()
let sem = DispatchSemaphore(value: 0)
writer.finishWriting { sem.signal() }
sem.wait()
if writer.status != .completed { fatalError("finish 실패: \(writer.error!)") }
let sz = try! FileManager.default.attributesOfItem(atPath: outURL.path)[.size] as! Int
print(String(format: "%@  %dx%d  %d프레임  %.2fMB", outURL.lastPathComponent, W, H, n, Double(sz) / 1048576))
