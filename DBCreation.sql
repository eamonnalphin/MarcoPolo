drop table EVENTDAYENTRY;
drop table eventday;
drop table event;


CREATE TABLE ADMINLOGIN(
    ID int not null AUTO_INCREMENT,
    USERNAME varchar(255) not null,
    PASSWORD varchar(255) not null,
    SALT varchar(255) not null,
    PRIMARY KEY (ID)
);


/*
Contains the data for a specific event, like Burning Man
*/
CREATE TABLE EVENT (
  ID int PRIMARY KEY AUTO_INCREMENT,
  NAME varchar(255),
  DESCRIPTION varchar(255),
  ADMINID int,
  FOREIGN KEY (ADMINID) REFERENCES ADMINLOGIN(ID) ON DELETE CASCADE
);

/*
Contains data for a day of the event, like Day 1 of burning man
*/
CREATE TABLE EVENTDAY (
  ID int PRIMARY KEY AUTO_INCREMENT,
  EVENTID int,
  ATTENDEES int,
  TIMESTART datetime,
  TIMEEND datetime,
  NOTE VARCHAR(255),
  FOREIGN KEY (EVENTID) REFERENCES EVENT(ID) ON DELETE CASCADE
);

/*
Contains entries for a day of an event, like 01:10:20:30:30
*/
CREATE TABLE EVENTDAYENTRY (
  ID int PRIMARY KEY AUTO_INCREMENT,
  TIMESTAMP datetime,
  MAC varchar(17),
  WIFI varchar(255),
  EVENTDAYID int,
  FOREIGN KEY (EVENTDAYID) REFERENCES EVENTDAY(ID) ON DELETE CASCADE
);