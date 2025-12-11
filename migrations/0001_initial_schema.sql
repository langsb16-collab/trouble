-- Users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  name TEXT,
  phone TEXT,
  preferred_language TEXT DEFAULT 'ko',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Accident cases table
CREATE TABLE IF NOT EXISTS accident_cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_number TEXT UNIQUE NOT NULL,
  user_id INTEGER,
  accident_type TEXT NOT NULL, -- 'traffic', 'industrial', 'daily'
  accident_date DATETIME,
  location TEXT,
  description TEXT,
  language TEXT DEFAULT 'ko',
  status TEXT DEFAULT 'pending', -- 'pending', 'analyzing', 'completed', 'archived'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Uploaded files table (images, videos, audio)
CREATE TABLE IF NOT EXISTS uploaded_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id INTEGER NOT NULL,
  file_type TEXT NOT NULL, -- 'image', 'video', 'audio'
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_url TEXT NOT NULL,
  mime_type TEXT,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES accident_cases(id) ON DELETE CASCADE
);

-- AI Analysis results table
CREATE TABLE IF NOT EXISTS ai_analysis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id INTEGER NOT NULL,
  analysis_type TEXT NOT NULL, -- 'vision', 'audio', 'comprehensive'
  raw_data TEXT, -- JSON format
  fault_ratio_user INTEGER, -- 0-100
  fault_ratio_opponent INTEGER, -- 0-100
  estimated_compensation REAL,
  injury_severity TEXT,
  treatment_duration_days INTEGER,
  legal_points TEXT, -- JSON array
  rebuttal_points TEXT, -- JSON array
  insurance_strategy TEXT,
  fraud_probability REAL, -- 0-1
  analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES accident_cases(id) ON DELETE CASCADE
);

-- Generated reports table
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id INTEGER NOT NULL,
  analysis_id INTEGER NOT NULL,
  report_type TEXT DEFAULT 'standard', -- 'standard', 'premium'
  pdf_url TEXT,
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  downloaded_at DATETIME,
  FOREIGN KEY (case_id) REFERENCES accident_cases(id) ON DELETE CASCADE,
  FOREIGN KEY (analysis_id) REFERENCES ai_analysis(id) ON DELETE CASCADE
);

-- Fault ratio reference data (Korean standards)
CREATE TABLE IF NOT EXISTS fault_ratio_standards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  accident_scenario TEXT NOT NULL,
  scenario_description TEXT,
  user_fault_min INTEGER,
  user_fault_max INTEGER,
  opponent_fault_min INTEGER,
  opponent_fault_max INTEGER,
  legal_basis TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Compensation calculation reference
CREATE TABLE IF NOT EXISTS compensation_standards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  injury_type TEXT NOT NULL,
  severity_level TEXT, -- 'minor', 'moderate', 'severe', 'critical'
  base_amount REAL,
  treatment_cost_per_day REAL,
  pain_suffering_amount REAL,
  disability_grade INTEGER, -- 1-14
  disability_multiplier REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON accident_cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_case_number ON accident_cases(case_number);
CREATE INDEX IF NOT EXISTS idx_cases_status ON accident_cases(status);
CREATE INDEX IF NOT EXISTS idx_files_case_id ON uploaded_files(case_id);
CREATE INDEX IF NOT EXISTS idx_analysis_case_id ON ai_analysis(case_id);
CREATE INDEX IF NOT EXISTS idx_reports_case_id ON reports(case_id);
