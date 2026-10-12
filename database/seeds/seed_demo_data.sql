USE gurukul_db;

-- ============================================================
-- Classes
-- ============================================================
INSERT INTO classes (name, section) VALUES
('Class 8',  'A'),
('Class 9',  'B'),
('Class 10', 'A')
ON DUPLICATE KEY UPDATE name = name;

-- ============================================================
-- Subjects
-- ============================================================
INSERT INTO subjects (name, code, class_id)
SELECT 'Mathematics', 'MATH', id FROM classes WHERE name='Class 10' AND section='A' LIMIT 1;
INSERT INTO subjects (name, code, class_id)
SELECT 'Science', 'SCI', id FROM classes WHERE name='Class 10' AND section='A' LIMIT 1;
INSERT INTO subjects (name, code, class_id)
SELECT 'English', 'ENG', id FROM classes WHERE name='Class 10' AND section='A' LIMIT 1;

-- ============================================================
-- Fee structure
-- ============================================================
INSERT INTO fee_structure (class_id, title, amount, due_date)
SELECT id, 'Tuition Fee - Q1', 15000, '2026-04-30' FROM classes WHERE name='Class 10' AND section='A' LIMIT 1;
INSERT INTO fee_structure (class_id, title, amount, due_date)
SELECT id, 'Tuition Fee - Q2', 15000, '2026-07-31' FROM classes WHERE name='Class 10' AND section='A' LIMIT 1;

-- ============================================================
-- Sample fee invoice for the demo student
-- ============================================================
INSERT INTO fees (student_id, title, amount, paid_amount, status, due_date)
SELECT id, 'Tuition Fee - Q1', 15000, 0, 'Pending', '2026-04-30'
FROM students WHERE admission_no='ADM-2026-001' LIMIT 1;

-- ============================================================
-- Buses
-- ============================================================
INSERT INTO buses (bus_no, driver_name, driver_phone, route, capacity) VALUES
('GKL-01', 'Ramesh Yadav', '+91-9000001001', 'Sector 12 → School', 40),
('GKL-02', 'Suresh Nair',  '+91-9000001002', 'Sector 8  → School', 40);

-- ============================================================
-- Books
-- ============================================================
INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES
('NCERT Mathematics X', 'NCERT', '978-81-7450-634-5', 'Textbook', 20, 20),
('Concepts of Physics', 'H.C. Verma', '978-81-7709-187-8', 'Reference', 10, 10),
('Wings of Fire', 'A.P.J. Abdul Kalam', '978-81-7371-146-6', 'Biography', 5, 5);

-- ============================================================
-- Notices
-- ============================================================
INSERT INTO notices (title, body, audience, created_by)
SELECT 'Welcome to Gurukul', 'The new academic year begins on Monday. All students must report by 8:00 AM.', 'all', id
FROM users WHERE email='admin@gurukul.edu' LIMIT 1;

INSERT INTO notices (title, body, audience, created_by)
SELECT 'Parent–Teacher Meeting', 'PTM scheduled for Saturday, 10:00 AM.', 'parents', id
FROM users WHERE email='admin@gurukul.edu' LIMIT 1;

INSERT INTO notices (title, body, audience, created_by)
SELECT 'Fee Reminder', 'Q1 tuition fee is due on 30th April.', 'students', id
FROM users WHERE email='admin@gurukul.edu' LIMIT 1;