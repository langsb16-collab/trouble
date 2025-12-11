-- Insert sample fault ratio standards (Korean traffic accident scenarios)
INSERT OR IGNORE INTO fault_ratio_standards (accident_scenario, scenario_description, user_fault_min, user_fault_max, opponent_fault_min, opponent_fault_max, legal_basis) VALUES
('직진차량_vs_좌회전차량', '직진 차량과 좌회전 차량 충돌', 0, 10, 90, 100, '도로교통법 제25조'),
('교차로_신호위반', '신호위반 차량과 정상주행 차량 충돌', 90, 100, 0, 10, '도로교통법 제5조'),
('중앙선침범', '중앙선 침범 차량 사고', 80, 100, 0, 20, '도로교통법 제13조'),
('추돌사고_후방', '후방 추돌 사고', 0, 10, 90, 100, '도로교통법 제19조'),
('차선변경_사고', '차선 변경 중 충돌', 60, 80, 20, 40, '도로교통법 제19조'),
('주차장_충돌', '주차장 내 충돌', 40, 60, 40, 60, '민법 제750조'),
('보행자_횡단보도', '횡단보도 보행자 사고', 80, 100, 0, 20, '도로교통법 제27조'),
('역주행', '역주행 차량 사고', 90, 100, 0, 10, '도로교통법 제13조'),
('과속_충돌', '과속 차량 충돌', 70, 90, 10, 30, '도로교통법 제17조'),
('안전거리미확보', '안전거리 미확보 추돌', 70, 90, 10, 30, '도로교통법 제19조');

-- Insert compensation standards (Korean insurance standards)
INSERT OR IGNORE INTO compensation_standards (injury_type, severity_level, base_amount, treatment_cost_per_day, pain_suffering_amount, disability_grade, disability_multiplier) VALUES
-- Minor injuries
('타박상', 'minor', 500000, 50000, 1000000, NULL, NULL),
('염좌', 'minor', 800000, 70000, 1500000, NULL, NULL),
('찰과상', 'minor', 300000, 30000, 500000, NULL, NULL),

-- Moderate injuries
('골절_단순', 'moderate', 3000000, 150000, 5000000, NULL, NULL),
('인대파열', 'moderate', 4000000, 180000, 6000000, NULL, NULL),
('추간판탈출증', 'moderate', 5000000, 200000, 8000000, 14, 1.5),

-- Severe injuries
('골절_복합', 'severe', 8000000, 300000, 15000000, 10, 3.0),
('뇌진탕', 'severe', 10000000, 400000, 20000000, 9, 4.0),
('내장손상', 'severe', 12000000, 500000, 25000000, 8, 5.0),

-- Critical injuries
('척수손상', 'critical', 50000000, 1000000, 100000000, 3, 15.0),
('사지마비', 'critical', 100000000, 2000000, 200000000, 1, 30.0),
('뇌손상_중증', 'critical', 80000000, 1500000, 150000000, 2, 25.0);

-- Insert sample test case
INSERT OR IGNORE INTO accident_cases (case_number, accident_type, accident_date, location, description, language, status) VALUES
('CASE-2025-001', 'traffic', '2025-12-10 14:30:00', '서울시 강남구 테헤란로', '교차로에서 좌회전 중 직진 차량과 충돌. 상대방 신호 위반 주장.', 'ko', 'pending');
