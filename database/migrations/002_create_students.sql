USE gurukul_db;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE,
  admission_no VARCHAR(40) UNIQUE,
  roll_no VARCHAR(20),
  class_id INT,
  guardian_name VARCHAR(120),
  guardian_phone VARCHAR(20),
  dob DATE,
  address VARCHAR(255),
  previous_school VARCHAR(200),
  documents JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS parents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE,
  student_id INT,
  relation VARCHAR(30),
  phone VARCHAR(20),
  occupation VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);