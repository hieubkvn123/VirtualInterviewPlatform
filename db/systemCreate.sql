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
	forRol VARCHAR(20), /* Applied for technical questions */

	PRIMARY KEY (questionID, questionGroup)
);

INSERT INTO QUESTIONS VALUES(1, 'General', 'Tell me something about yourself', 3, NULL);
INSERT INTO QUESTIONS VALUES(2, 'General', 'Why did you choose to apply to this position',3, NULL);
INSERT INTO QUESTIONS VALUES(3, 'General', 'What are your strengths and weaknesses', 3, NULL);
INSERT INTO QUESTIONS VALUES(4, 'General', 'What would your previous supervisor say about you', 3, NULL);
INSERT INTO QUESTIONS VALUES(5, 'General', 'Why should we hire you', 4, NULL);
INSERT INTO QUESTIONS VALUES(6, 'General', 'How do you evaluate your team working skills',3, NULL);

INSERT INTO QUESTIONS VALUES(1, 'Situational', 'What would you do if there is somebody in your team who disapprove with the idea that you worked so hard on', 3, NULL);
INSERT INTO QUESTIONS VALUES(2, 'Situational', 'If your boss rages at you for no reason at all, how would you address his attitude', 3, NULL);
INSERT INTO QUESTIONS VALUES(3, 'Situational', 'If one day you encounter a client with unreasonable requests but very few budget invest, how would you reason with the client', 3, NULL);
INSERT INTO QUESTIONS VALUES(4, 'Situational', 'How would you address the conflict if there are two completely contrasting viewpoints in your team', 4, NULL);
