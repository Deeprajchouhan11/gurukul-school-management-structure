USE gurukul_db;

CREATE TABLE IF NOT EXISTS notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  body TEXT,
  audience ENUM('all','students','teachers','parents','accountants') DEFAULT 'all',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);