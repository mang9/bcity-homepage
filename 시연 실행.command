#!/bin/bash
# B-CITY 홈페이지 오프라인 시연 실행기
# 더블클릭하면 로컬 서버를 띄우고 브라우저를 연다. 인터넷 연결이 필요 없다.
# 종료: 이 터미널 창에서 Control-C 또는 창 닫기

cd "$(dirname "$0")" || exit 1

PORT=8899
# 포트가 이미 쓰이면 비어 있는 포트를 찾는다
while lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

URL="http://localhost:$PORT/"

echo "──────────────────────────────────────────────"
echo " B-CITY 홈페이지 오프라인 시연"
echo "──────────────────────────────────────────────"
echo " 폴더 : $(pwd)"
echo " 주소 : $URL"
echo ""
echo " 브라우저가 자동으로 열립니다."
echo " 끝내려면 이 창에서 Control-C 를 누르거나 창을 닫으세요."
echo "──────────────────────────────────────────────"
echo ""

# 서버가 뜬 뒤에 브라우저를 연다
( sleep 1; open "$URL" ) &

exec python3 -m http.server "$PORT" --bind 127.0.0.1
