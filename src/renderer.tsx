import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ClaimAI - AI 손해사정 플랫폼</title>
        <meta name="description" content="사진·동영상·음성만 첨부하면 AI가 전문가 수준의 손해사정 조언을 제공합니다. 외국인 노동자 무료 법률 지원." />
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        <script src="/static/app.js"></script>
      </body>
    </html>
  )
})
