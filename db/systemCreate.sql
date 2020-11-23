CREATE DATABASE IF NOT EXISTS VIP;
DROP TABLE IF EXISTS USERS;
USE VIP;

CREATE TABLE USERS (
	userID INT (10) NOT NULL AUTO_INCREMENT,
	userName VARCHAR(100) NOT NULL,
	userMail VARCHAR(100) NOT NULL,
	organization VARCHAR(100) NOT NULL,
	password VARCHAR(100) NOT NULL, /* A hashed string */

	PRIMARY KEY (userID)
);

CREATE TABLE QUESTIONS (
	questionID INT(10) NOT NULL,
	questionGroup VARCHAR(10) NOT NULL,
	questionContent VARCHAR(1000) NOT NULL,
	duration INT(10) NOT NULL, /* Duration of question in minutes */

	PRIMARY KEY (questionID, questionGroup)
);

