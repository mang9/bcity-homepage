# 영상 도구 (ffmpeg 없이 · AVFoundation + CoreImage)

이 환경에는 ffmpeg·brew 가 없다(CLAUDE.md §4.3). Swift 로 직접 처리한다.
**호출이 잦으므로 반드시 먼저 컴파일한다** — `swift` 인터프리터는 호출마다 재컴파일한다.

```bash
cd tools/video && for t in probe enc poster vpsnr vsheet; do swiftc -O $t.swift -o $t; done
```

| 도구 | 하는 일 |
|---|---|
| `probe`  | `<파일…>` — 해상도 · 길이 · fps · 비트레이트 · 코덱 · 오디오 트랙 수 |
| `enc`    | `<in> <out> <W> <H> <kbps> [크롭AR] [hevc]` — 스케일 + H.264 재인코딩, **오디오 제거**. 크롭AR 을 주면 가운데를 그 비율로 먼저 잘라낸다 |
| `poster` | `<in> <out.jpg> <W> <H> <품질>` — 첫 프레임을 포스터로. 빈 이미지 방어(유효픽셀 %)를 함께 찍는다 |
| `vpsnr`  | `<원본> <후보…>` — **화면에 실제로 보이는 영역만** 잘라 PSNR. 전체 프레임 평균은 안 보이는 곳까지 넣어 판단을 흐린다 |
| `seam`   | `<파일…>` — 마지막 프레임 ↔ 첫 프레임 차이. 루프가 튀는지 본다 |
| `detail` | `<out.png> <t초> <cx> <cy> <크롭폭> <파일…>` — 보이는 영역의 한 지점을 **1:1(2배)** 로 잘라 비교. 표시 크기 비교는 뭉갬을 가린다 |
| `vsheet` | `<out.png> <t초> <파일…>` — 같은 시점의 보이는 영역을 나란히 붙인 비교 시트(눈으로 볼 때) |

## 함정

- **`writer.shouldOptimizeForNetworkUse = true` 를 반드시 켤 것.** 끄면 `moov` 아톰이 파일
  **끝**에 놓인다. 그러면 `<video preload="metadata">` 가 메타데이터를 읽으려고 **파일 전체**를
  내려받는다 — 2026-08-18 실측으로 4.8MB 클립에서 **4,901KB** 를 받았다(켠 뒤에는 **3KB**).
  검증: 최상위 아톰이 `ftyp·moov·mdat` 여야 한다. `ftyp·mdat·moov` 면 틀렸다.

- **`NSImage.lockFocus()` 를 쓰지 말 것.** Retina 에서 백킹 스케일 2배로 렌더되어
  `tiffRepresentation` 이 지정 크기의 **4배 픽셀**을 담는다. 로그에는 인자를 그대로 찍으니
  크기가 맞아 보이고 **용량만 이상하게 커진다**(800x1000 요청 → 실제 1600x2000 · 659KB).
  `NSBitmapImageRep` + `NSGraphicsContext` 로 바꾸면 이번엔 **새까맣게** 나온다.
  → **`CIContext` 로 렌더한다**(`enc` 와 같은 경로라 검증돼 있다).
- `AVAssetWriterInputPixelBufferAdaptor.pixelBufferPool` 은 `startWriting()` **전에는 nil** 이다.
  풀을 `CVPixelBufferPoolCreate` 로 직접 만든다.
- 비트레이트를 다른 영상에서 그대로 복사하지 말 것 — 클립마다 최악 구간을 따로 본다(§11.7).
