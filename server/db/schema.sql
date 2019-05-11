drop database if exists trivializer_db;

create database trivializer_db;

use trivializer_db;

create table owners
(
  ownerId integer auto_increment,
  ownerName varchar (100),
  primary key (ownerId)
);

create table games
(
  gameId integer auto_increment,
  ownerId_fk integer,
  questions varchar (3000),
  primary key (gameId)
);

create table gameresponses
(
  gameResponseId integer auto_increment,
  ownerId_fk integer,
  questionNumber_fk integer,
  teamName varchar (100),
  answerGiven varchar (50),
  responseOrder integer,
  points integer,
  primary key (gameResponseId)
);