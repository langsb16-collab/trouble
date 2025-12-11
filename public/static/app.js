// ClaimAI Frontend JavaScript

let currentLanguage = 'ko';
let uploadedFiles = [];
let currentCaseId = null;

// Language switcher
document.addEventListener('DOMContentLoaded', () => {
  const langSelector = document.getElementById('language-selector');
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang') || 'ko';
  
  langSelector.value = urlLang;
  currentLanguage = urlLang;
  
  langSelector.addEventListener('change', (e) => {
    const newLang = e.target.value;
    window.location.href = `/?lang=${newLang}`;
  });
  
  initializeEventListeners();
});

function initializeEventListeners() {
  // Image upload
  const imageUpload = document.getElementById('image-upload');
  if (imageUpload) {
    imageUpload.addEventListener('change', handleFileUpload);
  }
  
  // Video upload
  const videoUpload = document.getElementById('video-upload');
  if (videoUpload) {
    videoUpload.addEventListener('change', handleFileUpload);
  }
  
  // Audio recording
  const audioBtn = document.getElementById('audio-record-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', handleAudioRecording);
  }
  
  // Analyze button
  const analyzeBtn = document.getElementById('analyze-btn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', handleAnalysis);
  }
  
  // Accident type buttons
  const accidentTypeBtns = document.querySelectorAll('.accident-type-btn');
  accidentTypeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      accidentTypeBtns.forEach(b => b.classList.remove('border-blue-500', 'bg-blue-50'));
      e.target.closest('button').classList.add('border-blue-500', 'bg-blue-50');
    });
  });
}

function handleFileUpload(event) {
  const files = Array.from(event.target.files);
  
  files.forEach(file => {
    uploadedFiles.push({
      file: file,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file)
    });
  });
  
  updateFilesPreview();
  enableAnalyzeButton();
}

function updateFilesPreview() {
  const preview = document.getElementById('files-preview');
  const filesList = document.getElementById('files-list');
  
  if (uploadedFiles.length === 0) {
    preview.classList.add('hidden');
    return;
  }
  
  preview.classList.remove('hidden');
  filesList.innerHTML = '';
  
  uploadedFiles.forEach((item, index) => {
    const fileItem = document.createElement('div');
    fileItem.className = 'flex items-center justify-between bg-gray-50 p-3 rounded-lg';
    
    const icon = item.type === 'image' ? '📷' : item.type === 'video' ? '🎥' : '🎤';
    const sizeKB = (item.size / 1024).toFixed(2);
    
    fileItem.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-2xl">${icon}</span>
        <div>
          <p class="font-medium text-gray-700">${item.name}</p>
          <p class="text-xs text-gray-500">${sizeKB} KB</p>
        </div>
      </div>
      <button onclick="removeFile(${index})" class="text-red-500 hover:text-red-700">
        ❌
      </button>
    `;
    
    filesList.appendChild(fileItem);
  });
}

function removeFile(index) {
  uploadedFiles.splice(index, 1);
  updateFilesPreview();
  
  if (uploadedFiles.length === 0) {
    disableAnalyzeButton();
  }
}

function enableAnalyzeButton() {
  const analyzeBtn = document.getElementById('analyze-btn');
  analyzeBtn.disabled = false;
}

function disableAnalyzeButton() {
  const analyzeBtn = document.getElementById('analyze-btn');
  analyzeBtn.disabled = true;
}

async function handleAudioRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];
    
    const recordBtn = document.getElementById('audio-record-btn');
    recordBtn.innerHTML = `
      <div class="text-4xl mb-2 animate-pulse">🔴</div>
      <p class="font-semibold text-red-700">녹음 중...</p>
      <p class="text-xs text-gray-500 mt-1">다시 클릭하여 중지</p>
    `;
    
    mediaRecorder.addEventListener('dataavailable', event => {
      audioChunks.push(event.data);
    });
    
    mediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioFile = new File([audioBlob], `recording_${Date.now()}.wav`, { type: 'audio/wav' });
      
      uploadedFiles.push({
        file: audioFile,
        type: 'audio',
        name: audioFile.name,
        size: audioFile.size
      });
      
      updateFilesPreview();
      enableAnalyzeButton();
      
      recordBtn.innerHTML = `
        <div class="text-4xl mb-2">🎤</div>
        <p class="font-semibold text-gray-700">음성 녹음</p>
        <p class="text-xs text-gray-500 mt-1">음성으로 상황 설명</p>
      `;
      
      stream.getTracks().forEach(track => track.stop());
    });
    
    // Stop recording when clicked again
    recordBtn.onclick = () => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        recordBtn.onclick = handleAudioRecording;
      }
    };
    
    mediaRecorder.start();
  } catch (error) {
    console.error('Audio recording error:', error);
    alert('마이크 접근 권한이 필요합니다.');
  }
}

async function handleAnalysis() {
  if (uploadedFiles.length === 0) {
    alert('최소 1개 이상의 파일을 업로드해주세요.');
    return;
  }
  
  const analyzeBtn = document.getElementById('analyze-btn');
  const originalText = analyzeBtn.textContent;
  analyzeBtn.textContent = '🔄 분석 중...';
  analyzeBtn.disabled = true;
  
  try {
    // Step 1: Create case
    const accidentTypeBtns = document.querySelectorAll('.accident-type-btn');
    let accidentType = 'traffic';
    accidentTypeBtns.forEach((btn, idx) => {
      if (btn.classList.contains('border-blue-500')) {
        accidentType = ['traffic', 'industrial', 'daily'][idx];
      }
    });
    
    const description = document.getElementById('description').value;
    
    const caseResponse = await fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accident_type: accidentType,
        accident_date: new Date().toISOString(),
        location: '',
        description: description,
        language: currentLanguage
      })
    });
    
    const caseData = await caseResponse.json();
    currentCaseId = caseData.case_id;
    
    // Step 2: Upload files (simulated - in production, use R2 or external storage)
    // For MVP, we'll skip actual file upload and proceed with analysis
    
    // Step 3: Perform AI analysis
    const analysisResponse = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        case_id: currentCaseId,
        files: uploadedFiles.map(f => ({ name: f.name, type: f.type }))
      })
    });
    
    const analysisData = await analysisResponse.json();
    
    // Display results
    displayAnalysisResults(analysisData);
    
  } catch (error) {
    console.error('Analysis error:', error);
    alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
  } finally {
    analyzeBtn.textContent = originalText;
    analyzeBtn.disabled = false;
  }
}

function displayAnalysisResults(data) {
  const resultsSection = document.getElementById('results-section');
  const resultsContent = document.getElementById('results-content');
  
  const legalPointsHTML = JSON.parse(data.legal_points || '[]').map(point => 
    `<li class="flex items-start gap-2"><span class="text-green-500">✓</span><span>${point}</span></li>`
  ).join('');
  
  const rebuttalPointsHTML = JSON.parse(data.rebuttal_points || '[]').map(point => 
    `<li class="flex items-start gap-2"><span class="text-blue-500">→</span><span>${point}</span></li>`
  ).join('');
  
  resultsContent.innerHTML = `
    <div class="space-y-6">
      <!-- Fault Ratio -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">⚖️ 과실비율 분석</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white rounded-lg p-4 text-center">
            <p class="text-sm text-gray-600 mb-2">귀하 과실</p>
            <p class="text-3xl font-bold text-blue-600">${data.fault_ratio_user}%</p>
          </div>
          <div class="bg-white rounded-lg p-4 text-center">
            <p class="text-sm text-gray-600 mb-2">상대방 과실</p>
            <p class="text-3xl font-bold text-red-600">${data.fault_ratio_opponent}%</p>
          </div>
        </div>
        <div class="mt-4 bg-gray-200 rounded-full h-4 overflow-hidden">
          <div class="bg-blue-600 h-full" style="width: ${data.fault_ratio_user}%"></div>
        </div>
      </div>
      
      <!-- Compensation -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">💰 예상 보상금</h3>
        <p class="text-4xl font-bold text-green-600">${data.estimated_compensation.toLocaleString('ko-KR')}원</p>
        <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-600">상해 정도</p>
            <p class="font-semibold">${data.injury_severity}</p>
          </div>
          <div>
            <p class="text-gray-600">예상 치료 기간</p>
            <p class="font-semibold">${data.treatment_duration_days}일</p>
          </div>
        </div>
      </div>
      
      <!-- Legal Points -->
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">📋 법적 근거</h3>
        <ul class="space-y-2 text-gray-700">
          ${legalPointsHTML}
        </ul>
      </div>
      
      <!-- Rebuttal Points -->
      <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">💡 반박 포인트</h3>
        <ul class="space-y-2 text-gray-700">
          ${rebuttalPointsHTML}
        </ul>
      </div>
      
      <!-- Insurance Strategy -->
      <div class="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">🎯 보험사 대응 전략</h3>
        <p class="text-gray-700 leading-relaxed">${data.insurance_strategy}</p>
      </div>
      
      <!-- Fraud Detection -->
      ${data.fraud_probability > 0.3 ? `
      <div class="bg-red-50 border-l-4 border-red-500 p-4">
        <p class="text-red-700">
          <strong>⚠️ 주의:</strong> 허위 주장 가능성이 감지되었습니다. 정확한 정보를 제공해주세요.
        </p>
      </div>
      ` : ''}
    </div>
  `;
  
  // Scroll to results
  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
