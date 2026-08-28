#!/bin/bash
# 컨펌용 사이트 갱신 — https://mang9.github.io/bcity-homepage-review/
#
# 이 사이트는 **손으로 뜨는 스냅숏**이라 그냥 두면 낡는다(실제로 하루 만에
# 반나절치 작업이 빠져 있었다). 운영본을 고친 뒤 이 스크립트 한 번이면 맞는다.
#
#   ./tools/review-sync.sh
#
# 운영 사이트(main)와 무엇이 다른가
#   · 홍보센터 샘플 게시물이 보인다(목록 + 상세)
#   · 관리자 화면 20종이 들어 있다
#   · 검색 색인을 막는다(robots.txt + 모든 페이지 noindex)
#   · 소스 · 빌드도구는 넣지 않는다 — 화면만 본다
#
# ⚠ GitHub Pages 는 main 만 빌드한다. 이 저장소는 별개라 운영 사이트에 영향이 없다.
# ⚠ 컨펌이 끝나면 저장소째 지운다:  gh repo delete mang9/bcity-homepage-review --yes
set -e

SRC="$HOME/bcity-homepage"
STAGE=/tmp/bcity-review
REPO=mang9/bcity-homepage-review

cd "$SRC"
test -f index.html || { echo "✗ 프로젝트 경로가 아니다: $SRC"; exit 1; }

echo "── 샘플 포함 빌드"
SHOW_SAMPLES=1 npm run build:pages >/dev/null
npm run build:admin >/dev/null

echo "── 스테이지 구성"
rm -rf "$STAGE"; mkdir -p "$STAGE"
# ⚠ 원본을 **절대경로**로 준다(§7.-1 의 2.9GB 사고 방지). `./` 형태를 쓰지 말 것.
rsync -a \
  --exclude '.git' --exclude 'node_modules' --exclude '.claude' --exclude '.impeccable' \
  --exclude 'src' --exclude 'tools' --exclude '_*.html' --exclude 'capture.html' \
  --exclude 'package*.json' --exclude '*.command' \
  "$SRC/" "$STAGE/"

echo "── 검색 색인 차단"
cat > "$STAGE/robots.txt" <<'EOF'
# 컨펌용 임시 사이트입니다. 검색 색인을 원하지 않습니다.
# 운영 사이트는 https://mang9.github.io/bcity-homepage/ 입니다.
User-agent: *
Disallow: /
EOF
python3 - "$STAGE" <<'PY'
import pathlib, sys
tag = ('  <!-- 컨펌용 임시 사이트 — 검색 색인 차단. 운영본에는 이 태그가 없다. -->\n'
       '  <meta name="robots" content="noindex, nofollow" />\n')
n = 0
for p in sorted(pathlib.Path(sys.argv[1]).rglob('*.html')):
    t = p.read_text(encoding='utf-8')
    if 'name="robots"' in t:            # admin 은 빌더가 이미 넣는다
        continue
    i = t.find('</head>')
    if i < 0:
        print('  ? head 없음:', p.name); continue
    p.write_text(t[:i] + tag + t[i:], encoding='utf-8'); n += 1
print(f'  noindex 삽입 {n}개')
PY
# 이 스크립트로 만든 사본임을 남긴다
cat > "$STAGE/README.md" <<EOF
# B-CITY 홈페이지 — 컨펌용 임시 사이트

**이 저장소는 검토용입니다. 운영 사이트가 아닙니다.**

| | |
|---|---|
| 운영 사이트 | https://mang9.github.io/bcity-homepage/ |
| 운영 저장소 | https://github.com/mang9/bcity-homepage |
| 이 사이트 | 컨펌용 — **홍보센터 게시물은 전부 샘플(가짜)** 입니다 |
| 갱신 시각 | $(date '+%Y-%m-%d %H:%M') · 운영본 $(git -C "$SRC" rev-parse --short HEAD) 기준 |

## 무엇을 보시면 되나

- **홍보센터 5종** — 목록과 상세가 채워져 있습니다. 내용은 **화면 확인용 샘플**입니다.
- **관리자 화면 20종** — \`/admin/login.html\` 부터. **기능 없는 정적 시안**이라
  로그인 · 저장 · 업로드는 동작하지 않습니다.
- 그 밖의 페이지는 운영 사이트와 같습니다.

## 주의

- 검색 색인은 막아 두었습니다(\`robots.txt\` + 모든 페이지 \`noindex\`).
- **컨펌이 끝나면 이 저장소를 삭제하세요.** 관리자 로그인 화면이 공개 주소에
  남아 있을 이유가 없습니다.
- 소스는 없습니다. 코드는 운영 저장소를 보세요.
- 갱신은 운영 저장소의 \`tools/review-sync.sh\` 로 합니다.
EOF

echo "── 푸시"
cd "$STAGE"
git init -q
# ⚠ 운영 저장소의 .gitignore 가 함께 복사된다. 그 안의 `/admin/` 규칙 때문에
#   관리자 화면 20개가 통째로 빠진 적이 있다(2026-08-28). 여기서는 규칙을 걷는다.
[ -f .gitignore ] && sed -i '' '/^\/admin\/$/d' .gitignore
git add -A
git -c user.email=byg0988@synapsemkt.co.kr -c user.name=mang9 \
    commit -q -m "컨펌용 스냅숏 — 운영본 $(git -C "$SRC" rev-parse --short HEAD) 기준"
git branch -M main
git remote add origin "https://github.com/$REPO.git"
git push -q --force origin main

echo "── 검증"
for f in admin/login.html notice.html robots.txt; do
  test -f "$STAGE/$f" || { echo "  ✗ 빠짐: $f"; exit 1; }
done
printf '  상세 %s쪽 · 관리자 %s개 · noindex %s개\n' \
  "$(ls "$STAGE"/notice-*.html "$STAGE"/press-*.html 2>/dev/null | wc -l | tr -d ' ')" \
  "$(ls "$STAGE"/admin/*.html | wc -l | tr -d ' ')" \
  "$(grep -rl 'name="robots"' "$STAGE" --include='*.html' 2>/dev/null | wc -l | tr -d ' ')"

# ⚠ 저장소를 샘플 상태로 두면 다음 커밋에 섞인다. 배포본으로 되돌린다.
cd "$SRC" && npm run build:pages >/dev/null
echo "✓ 갱신 완료 — https://mang9.github.io/bcity-homepage-review/ (반영까지 1분쯤)"
