-- Role reference table (optional — roles are stored as ENUM in users)
USE gurukul_db;

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(40) NOT NULL UNIQUE,
  description VARCHAR(200)
);

INSERT IGNORE INTO roles (name, description) VALUES
('Admin', 'Full system access'),
('Teacher', 'Manage classes, attendance, homework, exams'),
('Student', 'View attendance, homework, exams, fees'),
('Parent', 'View child details, fees, results'),
('Accountant', 'Manage fees, invoices, payments, reports');