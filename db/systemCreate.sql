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

	PRIMARY KEY (userID)
);

/* Insert one admin to the system */
INSERT INTO USERS VALUES (DEFAULT, 'Ivan Soh', 'ivan.soh.beta', 'RMAGroup', 'ivan.soh@rma', 1);
INSERT INTO USERS VALUES (DEFAULT, 'Nong Hieu', 'hieu.nong.beta', 'RMAGroup', 'hieu.nong@rma', 1);

CREATE TABLE QUESTIONS (
	questionID INT(10) NOT NULL,
	questionGroup VARCHAR(30) NOT NULL,
	questionContent VARCHAR(1000) NOT NULL,
	duration INT(10) NOT NULL, /* Duration of question in minutes */
	forRole VARCHAR(20), /* Applied for technical questions */

	PRIMARY KEY (questionID, questionGroup)
)
