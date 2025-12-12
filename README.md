# ClaimAI - AI 손해사정 플랫폼

**사진·동영상·음성만 첨부하면 AI가 교통사고·산재·일상사고를 분석해 손해사정 전문가 수준의 조언을 제공하는 플랫폼**

## 🌟 프로젝트 개요

ClaimAI는 한국 거주 외국인 노동자를 포함한 모든 사용자가 사고 후 복잡한 손해사정 절차를 쉽게 이해하고 대응할 수 있도록 돕는 AI 기반 플랫폼입니다.

### 핵심 가치
- 🚀 **즉시 분석**: 사진/영상/음성만 업로드하면 30초 내 결과 제공
- 🌐 **7개 언어 지원**: 한국어, 영어, 중국어, 일본어, 베트남어, 몽골어, 러시아어
- 💰 **무료 서비스**: 기본 AI 분석은 완전 무료
- 👥 **외국인 노동자 특화**: 무료 법률 지원 및 다국어 인터페이스

## 🌐 공개 URL

- **개발 서버**: https://3000-i6tewzyfb4m2ew9soa9g2-5634da27.sandbox.novita.ai
- **Health Check**: https://3000-i6tewzyfb4m2ew9soa9g2-5634da27.sandbox.novita.ai/health
- **GitHub**: https://github.com/langsb16-collab/trouble

## ✨ 주요 기능

### 현재 완료된 기능
- ✅ 다국어 인터페이스 (7개 언어)
- ✅ 파일 업로드 시스템 (사진/영상/음성)
- ✅ 사고 유형 분류 (교통사고/산재/일상사고)
- ✅ AI 분석 API 엔드포인트
- ✅ 과실비율 자동 산정
- ✅ 보상금 예측 엔진
- ✅ 법적 근거 및 반박 포인트 제시
- ✅ 보험사 대응 전략 생성
- ✅ D1 데이터베이스 (사고 사례, 분석 결과 저장)
- ✅ 실시간 결과 표시 UI

### 진행 중 / 예정 기능
- ⏳ 실제 AI Vision/Audio 모델 통합 (현재 Mock 데이터)
- ⏳ PDF 보고서 자동 생성
- ⏳ 전문가 상담 연결 시스템
- ⏳ 블랙박스 영상 분석
- ⏳ 허위 신고 탐지 강화

## 🔧 기술 스택

- **Frontend**: HTML5, TailwindCSS, Vanilla JavaScript
- **Backend**: Hono (v4.10.8) - Edge-first web framework
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages/Workers
- **Runtime**: Cloudflare Workers Runtime
- **Language**: TypeScript
- **Process Manager**: PM2 (development)

## 📊 데이터 구조

### 데이터베이스 테이블
1. **accident_cases** - 사고 사례 정보
2. **uploaded_files** - 업로드된 파일 메타데이터
3. **ai_analysis** - AI 분석 결과
4. **reports** - 생성된 보고서
5. **fault_ratio_standards** - 과실비율 기준 데이터 (10개 시나리오)
6. **compensation_standards** - 보상금 계산 기준 (13개 상해 유형)
7. **users** - 사용자 정보 (향후 인증 기능용)

### API 엔드포인트

#### 사고 사례 관리
- `POST /api/cases` - 새 사고 사례 생성
- `GET /api/cases/:id` - 사고 사례 조회

#### AI 분석
- `POST /api/analyze` - AI 분석 실행 (Mock)

#### 기준 데이터
- `GET /api/standards/fault-ratio` - 과실비율 기준 조회
- `GET /api/standards/compensation` - 보상금 기준 조회

#### 시스템
- `GET /health` - 헬스 체크

## 🚀 로컬 개발 가이드

### 1. 의존성 설치
```bash
npm install
```

### 2. D1 데이터베이스 초기화
```bash
# 마이그레이션 적용
npm run db:migrate:local

# 시드 데이터 삽입
npm run db:seed
```

### 3. 빌드
```bash
npm run build
```

### 4. 개발 서버 시작 (PM2)
```bash
# 포트 정리
npm run clean-port

# PM2로 시작
pm2 start ecosystem.config.cjs

# 로그 확인
pm2 logs claimai --nostream

# 서비스 중지
pm2 delete claimai
```

### 5. 직접 개발 서버 (PM2 없이)
```bash
npm run dev:sandbox
```

### 6. 테스트
```bash
# Health check
curl http://localhost:3000/health

# 메인 페이지 접근
curl http://localhost:3000/

# API 테스트
curl http://localhost:3000/api/standards/fault-ratio
```

## 📦 Cloudflare Pages 배포

### 사전 준비
1. Cloudflare 계정 생성
2. D1 데이터베이스 생성
```bash
wrangler d1 create claimai-production
```

3. wrangler.jsonc 업데이트 (database_id 입력)

### 배포 절차
```bash
# 프로덕션 마이그레이션 적용
npm run db:migrate:prod

# 빌드 및 배포
npm run deploy:prod

# 환경 변수 설정 (필요시)
wrangler pages secret put API_KEY --project-name claimai
```

## 📱 사용자 가이드

### 1. 언어 선택
- 우측 상단에서 원하는 언어 선택 (한국어/영어/중국어/일본어/베트남어/몽골어/러시아어)

### 2. 사고 자료 업로드
- **사고 유형 선택**: 교통사고/산재/일상사고 중 선택
- **사진**: 사고 현장, 차량 파손, 상해 부위 등
- **영상**: 블랙박스, 사고 현장 영상 등
- **음성**: 음성으로 상황 설명 (선택사항)

### 3. AI 분석
- "🔍 AI 분석 시작" 버튼 클릭
- 30초 내 분석 결과 확인

### 4. 결과 확인
- **과실비율**: 귀하 vs 상대방 과실 비율
- **예상 보상금**: 치료비, 위자료 등 포함
- **법적 근거**: 관련 법률 및 판례
- **반박 포인트**: 보험사 주장에 대한 대응 방안
- **대응 전략**: 보험사 협상 전략

### 5. 보고서 생성 (예정)
- PDF 다운로드
- 보험사 제출용 서류 자동 생성

## 🌍 다국어 지원

### 지원 언어
- 🇰🇷 한국어 (Korean)
- 🇺🇸 영어 (English)
- 🇨🇳 중국어 (Chinese)
- 🇯🇵 일본어 (Japanese)
- 🇻🇳 베트남어 (Vietnamese)
- 🇲🇳 몽골어 (Mongolian)
- 🇷🇺 러시아어 (Russian)

### 언어 전환
URL 파라미터 사용: `/?lang=en` (영어로 전환)

## 🎯 프로젝트 목표

1. **접근성 향상**: 모든 사람이 쉽게 사용할 수 있는 손해사정 서비스
2. **비용 절감**: 무료 AI 분석으로 고비용 손해사정사 비용 절감
3. **신속성**: 즉시 분석 결과 제공 (기존 2-5일 → 30초)
4. **정확성**: 판례 및 법률 기반 정량적 분석
5. **사회 기여**: 외국인 노동자 무료 법률 지원

## 📈 향후 개발 계획

### Phase 1 - MVP (완료)
- ✅ 기본 UI/UX
- ✅ 다국어 지원
- ✅ Mock AI 분석
- ✅ D1 데이터베이스

### Phase 2 - AI 통합 (진행 예정)
- ⏳ 실제 Vision AI 통합 (이미지 분석)
- ⏳ 실제 Audio AI 통합 (음성 인식)
- ⏳ 블랙박스 영상 분석
- ⏳ PDF 보고서 자동 생성

### Phase 3 - 고도화
- ⏳ 전문가 매칭 시스템
- ⏳ 보험사 연동
- ⏳ 모바일 앱 개발
- ⏳ 실시간 채팅 상담

## 🤝 기여

이 프로젝트는 사회 공헌을 목표로 합니다. 기여를 환영합니다!

## 📄 라이선스

MIT License (예정)

## 📞 문의

- 프로젝트: ClaimAI
- 개발: AI 손해사정 플랫폼 개발팀
- 이메일: (추가 예정)

---

© 2025 ClaimAI - AI 손해사정 플랫폼. 외국인 노동자 무료 법률 지원 서비스.
