import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'
import { translations, getTranslation, type Language } from './i18n/translations'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Main renderer
app.use(renderer)

// Main page
app.get('/', (c) => {
  const lang = (c.req.query('lang') || 'ko') as Language
  const t = (key: keyof typeof translations.ko) => getTranslation(lang, key)
  
  return c.render(
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header class="bg-white shadow-sm">
        <div class="container mx-auto px-4 py-4">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">{t('appTitle')}</h1>
              <p class="text-sm text-gray-600 mt-1">{t('appSubtitle')}</p>
            </div>
            <div class="flex gap-2">
              <select id="language-selector" class="px-3 py-2 border rounded-lg">
                <option value="ko">🇰🇷 한국어</option>
                <option value="en">🇺🇸 English</option>
                <option value="zh">🇨🇳 中文</option>
                <option value="ja">🇯🇵 日本語</option>
                <option value="vi">🇻🇳 Tiếng Việt</option>
                <option value="mn">🇲🇳 Монгол</option>
                <option value="ru">🇷🇺 Русский</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Free support banner */}
      <div class="bg-green-500 text-white py-3">
        <div class="container mx-auto px-4 text-center">
          <p class="font-semibold">{t('freeLegalSupport')}</p>
          <p class="text-sm mt-1">{t('freeSupportDesc')}</p>
        </div>
      </div>

      {/* Main content */}
      <main class="container mx-auto px-4 py-8">
        {/* Upload section */}
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">{t('uploadTitle')}</h2>
          
          {/* Accident type selection */}
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">사고 유형 선택</label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button class="accident-type-btn p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                🚗 {t('accidentTypeTraffic')}
              </button>
              <button class="accident-type-btn p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                🏭 {t('accidentTypeIndustrial')}
              </button>
              <button class="accident-type-btn p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                🏠 {t('accidentTypeDaily')}
              </button>
            </div>
          </div>

          {/* File upload section */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
              <input type="file" id="image-upload" accept="image/*" multiple class="hidden" />
              <label for="image-upload" class="cursor-pointer">
                <div class="text-4xl mb-2">📷</div>
                <p class="font-semibold text-gray-700">{t('uploadImageBtn')}</p>
                <p class="text-xs text-gray-500 mt-1">JPG, PNG, HEIC</p>
              </label>
            </div>

            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
              <input type="file" id="video-upload" accept="video/*" class="hidden" />
              <label for="video-upload" class="cursor-pointer">
                <div class="text-4xl mb-2">🎥</div>
                <p class="font-semibold text-gray-700">{t('uploadVideoBtn')}</p>
                <p class="text-xs text-gray-500 mt-1">MP4, MOV, AVI</p>
              </label>
            </div>

            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
              <button id="audio-record-btn" class="w-full">
                <div class="text-4xl mb-2">🎤</div>
                <p class="font-semibold text-gray-700">{t('uploadAudioBtn')}</p>
                <p class="text-xs text-gray-500 mt-1">음성으로 상황 설명</p>
              </button>
            </div>
          </div>

          {/* Uploaded files preview */}
          <div id="files-preview" class="mb-6 hidden">
            <h3 class="font-semibold text-gray-700 mb-2">업로드된 파일</h3>
            <div id="files-list" class="space-y-2"></div>
          </div>

          {/* Description textarea */}
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">상황 설명 (선택사항)</label>
            <textarea 
              id="description" 
              rows="4" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="사고 상황을 자세히 설명해주세요. 예: 시간, 장소, 상대방 행동 등"
            ></textarea>
          </div>

          {/* Analyze button */}
          <button 
            id="analyze-btn" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {t('analyzeBtn')}
          </button>
        </div>

        {/* Analysis results section (hidden by default) */}
        <div id="results-section" class="hidden">
          <div class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">{t('analysisTitle')}</h2>
            
            {/* Results will be dynamically inserted here */}
            <div id="results-content"></div>

            {/* Action buttons */}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition">
                {t('generateReport')}
              </button>
              <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition">
                {t('downloadPDF')}
              </button>
              <button class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition">
                {t('consultExpert')}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer class="bg-gray-800 text-white py-8 mt-16">
        <div class="container mx-auto px-4 text-center">
          <p class="mb-2">© 2025 ClaimAI - AI 손해사정 플랫폼</p>
          <p class="text-sm text-gray-400">무료 외국인 노동자 법률 지원 서비스</p>
        </div>
      </footer>
    </div>
  )
})

// API: Create new case
app.post('/api/cases', async (c) => {
  const { DB } = c.env
  const body = await c.req.json()
  
  const caseNumber = `CASE-${Date.now()}`
  const { accident_type, accident_date, location, description, language } = body
  
  const result = await DB.prepare(
    `INSERT INTO accident_cases (case_number, accident_type, accident_date, location, description, language, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(caseNumber, accident_type, accident_date, location, description, language || 'ko', 'pending').run()
  
  return c.json({ case_id: result.meta.last_row_id, case_number: caseNumber })
})

// API: Get case details
app.get('/api/cases/:id', async (c) => {
  const { DB } = c.env
  const caseId = c.req.param('id')
  
  const caseData = await DB.prepare(
    'SELECT * FROM accident_cases WHERE id = ?'
  ).bind(caseId).first()
  
  if (!caseData) {
    return c.json({ error: 'Case not found' }, 404)
  }
  
  return c.json(caseData)
})

// API: AI Analysis (Mock for now - will integrate real AI later)
app.post('/api/analyze', async (c) => {
  const { DB } = c.env
  const { case_id, files } = await c.req.json()
  
  // Simulate AI analysis delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Mock AI analysis result
  const analysis = {
    case_id,
    fault_ratio_user: 20,
    fault_ratio_opponent: 80,
    estimated_compensation: 8500000,
    injury_severity: '중등도',
    treatment_duration_days: 45,
    legal_points: ['도로교통법 제25조 위반', '상대방 신호위반 명백', '블랙박스 증거 확보'],
    rebuttal_points: ['상대방 과속 주장 가능', '교차로 진입 시점 확인 필요', '목격자 진술 확보 권장'],
    insurance_strategy: '보험사는 40-50% 과실을 주장할 가능성이 높습니다. 블랙박스 영상과 신호 위반 증거를 강조하세요.',
    fraud_probability: 0.05
  }
  
  // Save analysis to database
  const result = await DB.prepare(
    `INSERT INTO ai_analysis (case_id, analysis_type, raw_data, fault_ratio_user, fault_ratio_opponent, 
     estimated_compensation, injury_severity, treatment_duration_days, legal_points, rebuttal_points, insurance_strategy, fraud_probability)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    case_id,
    'comprehensive',
    JSON.stringify(analysis),
    analysis.fault_ratio_user,
    analysis.fault_ratio_opponent,
    analysis.estimated_compensation,
    analysis.injury_severity,
    analysis.treatment_duration_days,
    JSON.stringify(analysis.legal_points),
    JSON.stringify(analysis.rebuttal_points),
    analysis.insurance_strategy,
    analysis.fraud_probability
  ).run()
  
  return c.json({ analysis_id: result.meta.last_row_id, ...analysis })
})

// API: Get fault ratio standards
app.get('/api/standards/fault-ratio', async (c) => {
  const { DB } = c.env
  const standards = await DB.prepare(
    'SELECT * FROM fault_ratio_standards ORDER BY accident_scenario'
  ).all()
  
  return c.json(standards.results)
})

// API: Get compensation standards
app.get('/api/standards/compensation', async (c) => {
  const { DB } = c.env
  const standards = await DB.prepare(
    'SELECT * FROM compensation_standards ORDER BY injury_type, severity_level'
  ).all()
  
  return c.json(standards.results)
})

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
