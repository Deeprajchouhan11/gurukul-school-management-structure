USE gurukul_db;

-- ============================================================
-- IMPORTANT: Generate the bcrypt hash before running this file
--   node -e "console.log(require('bcryptjs').hashSync('admin123',10))"
-- Then paste it in place of the placeholder below.
-- ============================================================

SET @pwd = '$2a$10$REPLACE_WITH_YOUR_GENERATED_BCRYPT_HASH';

-- Create default users (one per role)
INSERT INTO users (name, email, password_hash, role) VALUES
('Gurukul Admin', 'admin@gurukul.edu',       @pwd, 'Admin'),
('Mrs. Sharma',   'teacher@gurukul.edu',     @pwd, 'Teacher'),
('Rahul Kumar',   'student@gurukul.edu',     @pwd, 'Student'),
('Mr. Kumar',     'parent@gurukul.edu',      @pwd, 'Parent'),
('Ms. Verma',     'accountant@gurukul.edu',  @pwd, 'Accountant')
ON DUPLICATE KEY UPDATE email = email;

-- Link teacher record
INSERT INTO teachers (user_id, employee_no, subject, qualification, joining_date)
SELECT id, 'T-1001', 'Mathematics', 'M.Sc., B.Ed.', '2020-06-01'
FROM users WHERE email = 'teacher@gurukul.edu'
ON DUPLICATE KEY UPDATE employee_no = employee_no;

-- Link student record
INSERT INTO students (user_id, admission_no, roll_no, class_id, guardian_name, guardian_phone)
SELECT u.id, 'ADM-2026-001', '10A-01', c.id, 'Mr. Kumar', '+91-9000000001'
FROM users u, classes c
WHERE u.email = 'student@gurukul.edu' AND c.name = 'Class 10' AND c.section = 'A'
LIMIT 1
ON DUPLICATE KEY UPDATE admission_no = admission_no;

-- Link parent to student
INSERT INTO parents (user_id, student_id, relation, phone)
SELECT p.id, s.id, 'Father', '+91-9000000001'
FROM users p, students s
WHERE p.email = 'parent@gurukul.edu'
  AND s.admission_no = 'ADM-2026-001'
LIMIT 1
ON DUPLICATE KEY UPDATE relation = relation;