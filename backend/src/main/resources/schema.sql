CREATE DATABASE mestrongdb;
USE mestrongdb;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    goal VARCHAR(50) NOT NULL,
    training_days INT NOT NULL,
    creation DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE training_plans(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    goal VARCHAR(50) NOT NULL,
    days INT NOT NULL,
    split VARCHAR(50) NOT NULL,
    creation DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE plan_days(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plan_id BIGINT NOT NULL,
    day_name VARCHAR(100) NOT NULL,
    focus VARCHAR(100), -- nicht wichtig, deswegen kein NOT NULL
    day_order INT NOT NULL,
    FOREIGN KEY (plan_id) REFERENCES training_plans(id) ON DELETE CASCADE
);

CREATE TABLE plan_exercises(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    day_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    sets INT NOT NULL,
    reps INT NOT NULL,
    exercises_type VARCHAR(50),
    FOREIGN KEY (day_id) REFERENCES plan_days(id) ON DELETE CASCADE
);

CREATE TABLE training_sessions(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_day_id BIGINT, -- kein NOT NULL da falls es tag durch trainingplanlöschung nicht mehr giebt, es das Training als geloggtes Training noch gibt. (2. FOREIGN KEY)
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_day_id) REFERENCES plan_days(id) ON DELETE SET NULL -- falls Tag nicht mehr existent, wird Tag einfach null gesetzt
);

CREATE TABLE exercises(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    exercise VARCHAR(100) NOT NULL,
    set_number INT NOT NULL,
    weight DECIMAL(6,2) NOT NULL,
    reps INT NOT NULL,
    creation DATETIME DEFAULT NOW(),
    FOREIGN KEY (session_id) REFERENCES training_sessions(id) ON DELETE CASCADE
);

CREATE TABLE orm(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    exercise VARCHAR(100) NOT NULL,
    calculated_orm DECIMAL(6,2) NOT NULL,
    creation DATETIME DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);