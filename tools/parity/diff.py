#!/usr/bin/env python3
import io, json, sys
a = json.load(io.open(sys.argv[1], encoding='utf-8'))
b = json.load(io.open(sys.argv[2], encoding='utf-8'))
IGNORE = {'width','height'}  # box 로 이미 검증
total = diffs = 0
report = []
for vp in a:
    A, B = a[vp], b.get(vp)
    if not B: report.append(f'  {vp}: 후 데이터 없음'); continue
    for sel in A:
        if sel == '__meta':
            for k in A[sel]:
                total += 1
                if A[sel][k] != B[sel].get(k):
                    diffs += 1; report.append(f'  {vp} __meta.{k}: {A[sel][k]} → {B[sel].get(k)}')
            continue
        if A[sel].get('count') != B.get(sel,{}).get('count'):
            diffs += 1; report.append(f'  {vp} {sel} 개수: {A[sel].get("count")} → {B.get(sel,{}).get("count")}')
        fa, fb = A[sel].get('first'), B.get(sel,{}).get('first')
        if not fa or not fb: continue
        for k in fa:
            if k in IGNORE: continue
            total += 1
            if fa[k] != fb.get(k):
                diffs += 1
                report.append(f'  {vp} {sel} · {k}: {fa[k]!r} → {fb.get(k)!r}')
print(f'비교 {total}개 값 · 차이 {diffs}건')
for r in report[:60]: print(r)
if len(report) > 60: print(f'  … 그 외 {len(report)-60}건')
