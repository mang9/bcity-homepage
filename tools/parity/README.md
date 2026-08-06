# 레이아웃 파리티 하네스

리팩터가 화면을 바꾸지 않았음을 **계산된 스타일·기하로** 증명한다.
스크린샷 비교와 달리 헤드리스의 트랜지션·rAF 제약에 영향받지 않는다(CLAUDE.md §10).

## 쓰는 법

```bash
# 개발 서버가 8893 에서 떠 있어야 한다 (없으면 띄운다)
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8893/

python3 tools/parity/probe.py before.json     # 변경 전
#   …작업…
rsync -a --delete --exclude capture.html --exclude '_*.html' --exclude .claude \
  --exclude node_modules --exclude .git \
  "$HOME/Desktop/디자인/바이오테크이노밸리/PFV/bcity-homepage/" "$HOME/bcity-homepage/"
python3 tools/parity/probe.py after.json      # 변경 후
python3 tools/parity/diff.py before.json after.json
```

## 판정 기준

셀렉터 64개 × 4해상도(1920/1440/768/390) × 계산속성 30종 = 약 5,900개 값.

- **스타일·기하 차이는 0 이어야 한다.**
- `__meta.nodes` / `__meta.sheets` / `__meta.cssRules` 차이는 구조 변경에 따른
  **예상된 값**이다. 변경 내용과 일치하는지 확인하고 넘어간다.

## 셀렉터를 빼지 말 것

`.lm-bg` · `.lm-fg` · `.lm-svg` · `#partnerTrack img` · `.pt-item img` · `#zonesBg` ·
`.az-map-plate` · `.az-map-base` 는 2026-08-05 회귀를 **놓쳐서** 추가한 것이다.
그때 프로브에 없어서 파트너 로고 크기 깨짐과 입지 지도 문제를 초기에 잡지 못했다.

`baseline.json` 은 그 시점 `main`(6011389) 의 스냅샷이다.
