# 니가교수 AI 백업 프록시

클로드 API 장애 시 클라이언트가 폴백하는 Cloudflare Worker. 키는 이 서버에만 보관(클라이언트·repo 노출 0).
폴백 순서: **Gemini → OpenAI(GPT)**.

## 최초 배포 (한 번만)
```bash
npm i -g wrangler          # 설치 (이미 있으면 생략)
cd proxy
wrangler login             # 브라우저로 Cloudflare 로그인
wrangler secret put GEMINI_KEY   # AIza... 키 붙여넣기 (새로 발급한 것)
wrangler secret put OPENAI_KEY   # sk-... 키 붙여넣기 (새로 발급한 것)
wrangler deploy
```
배포가 끝나면 출력에 URL이 뜬다: `https://yp-ai-proxy.<계정>.workers.dev`
→ 이 URL을 `index.html`의 `PROXY_URL` 에 넣고 commit+push.

## 테스트
```bash
curl -X POST https://yp-ai-proxy.<계정>.workers.dev \
  -H "content-type: application/json" \
  -d '{"system":"너는 도우미야","messages":[{"role":"user","content":"1+1은?"}],"tier":"fast"}'
# => {"text":"2","provider":"gemini"}
```

## 키 교체
```bash
wrangler secret put GEMINI_KEY   # 다시 넣으면 덮어씀
```

## 설정값 (wrangler.toml)
- `ALLOWED_ORIGIN` : CORS 허용 오리진(콤마 구분). 라이브 도메인 바뀌면 여기 수정 후 재배포.
- `OPENAI_MODEL_SMART` / `OPENAI_MODEL_FAST` : GPT 폴백 모델.

## 보안
- 키는 `wrangler secret`으로만. `wrangler.toml`·코드·repo에 절대 평문 금지.
- OpenAI 대시보드에서 사용량 상한(budget) 설정 권장.
