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
insert into ADMINLOGIN (PASSWORD,SALT,USERNAME)
values ('3c3b237b526da4d5295059ee6549e4760bbe2cf4c8870b812a33f03b8c5dac10acc38237169771040d3be4435d3466b7a6c9815d304ce91ee4638d648b53858b','3268c18f44269202589137af9a7f2f95','eamonnalphin@gmail.com')
;
*/

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