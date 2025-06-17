CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  level VARCHAR(50)
);

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  level VARCHAR(50),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id),
  title VARCHAR(255),
  position INTEGER
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID REFERENCES chapters(id),
  title VARCHAR(255),
  content_markdown TEXT,
  position INTEGER
);

CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) NULL,
  chapter_id UUID REFERENCES chapters(id) NULL,
  title VARCHAR(255),
  questions_json JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50)
);

CREATE TABLE user_course_quizz (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_course_id UUID REFERENCES user_courses(id),
  quiz_id UUID REFERENCES quizzes(id),
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  passed BOOLEAN DEFAULT FALSE
);

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100)
);

CREATE TABLE course_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id),
  tag_id UUID REFERENCES tags(id)
);

CREATE TABLE scheduled_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  days VARCHAR(100)[],
  hours_per_session INTEGER,
  duration_weeks INTEGER,
  start_date DATE,
  status VARCHAR(50)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  message VARCHAR(255),
  type VARCHAR(50),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE user_skill_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  tag_id UUID REFERENCES tags(id),
  progress_percent INTEGER,
  courses_completed INTEGER
);
