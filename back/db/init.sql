CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  level VARCHAR(50)
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  level VARCHAR(50),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id),
  title VARCHAR(255),
  position INTEGER
);

CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER REFERENCES chapters(id),
  title VARCHAR(255),
  content_markdown TEXT,
  position INTEGER
);

CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) NULL,
  chapter_id INTEGER REFERENCES chapters(id) NULL,
  title VARCHAR(255),
  questions_json JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_courses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  course_id INTEGER REFERENCES courses(id),
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50)
);

CREATE TABLE user_course_quizz (
  id SERIAL PRIMARY KEY,
  user_course_id INTEGER REFERENCES user_courses(id),
  quiz_id INTEGER REFERENCES quizzes(id),
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  passed BOOLEAN DEFAULT FALSE
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE course_tags (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id),
  tag_id INTEGER REFERENCES tags(id)
);

CREATE TABLE scheduled_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  course_id INTEGER REFERENCES courses(id),
  days VARCHAR(100)[],
  hours_per_session INTEGER,
  duration_weeks INTEGER,
  start_date DATE,
  status VARCHAR(50)
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  message VARCHAR(255),
  type VARCHAR(50),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE user_skill_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  tag_id INTEGER REFERENCES tags(id),
  progress_percent INTEGER,
  courses_completed INTEGER
);
