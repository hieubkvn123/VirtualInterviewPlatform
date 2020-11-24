DROP DATABASE IF EXISTS VIP;
CREATE DATABASE IF NOT EXISTS VIP;

USE VIP;
DROP TABLE IF EXISTS USERS;
DROP TABLE IF EXISTS QUESTIONS;

CREATE TABLE USERS (
	userID INT (10) NOT NULL AUTO_INCREMENT,
	userName VARCHAR(100) NOT NULL,
	userMail VARCHAR(100) NOT NULL,
	organization VARCHAR(100) NOT NULL,
	password VARCHAR(100) NOT NULL, /* A hashed string */
	isAdmin BOOLEAN NOT NULL,

	PRIMARY KEY (userID),
	CONSTRAINT userMailConstraint UNIQUE(userMail)
);

CREATE TABLE ROLES (
	roleId INT(10) NOT NULL,
	roleName VARCHAR(100) NOT NULL,

	PRIMARY KEY (roleId)
);

CREATE TABLE QUESTIONS (
	questionID INT(10) NOT NULL,
	questionGroup VARCHAR(30) NOT NULL,
	questionContent VARCHAR(1000) NOT NULL,
	duration INT(10) NOT NULL, /* Duration of question in minutes */
	forRole INT(10), /* Applied for technical questions */

	PRIMARY KEY (questionID, questionGroup),
	FOREIGN KEY (forRole) REFERENCES ROLES (roleId)
);

CREATE TABLE INTERVIEW (
	userMail VARCHAR(100) NOT NULL,
	userRole VARCHAR(100) NOT NULL,
	questionID INT(10) NOT NULL,
	questionGroup VARCHAR(30) NOT NULL,
	recordingPath VARCHAR(100) NOT NULL,

	FOREIGN KEY (questionID, questionGroup) REFERENCES QUESTIONS(questionID, questionGroup)
);