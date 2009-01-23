-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.0.67-0ubuntu6


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema scruwp
--

CREATE DATABASE IF NOT EXISTS scruwp;
USE scruwp;

DROP TABLE IF EXISTS `scruwp`.`histories`;
CREATE TABLE  `scruwp`.`histories` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `idSprint` int(10) unsigned NOT NULL,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  `text` text collate utf8_unicode_ci NOT NULL,
  `estimate` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `scruwp`.`sprints`;
CREATE TABLE  `scruwp`.`sprints` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `idTeam` int(10) unsigned NOT NULL,
  `status` tinyint(1) default '0',
  `beginDate` date default NULL,
  `endDate` date default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `scruwp`.`status`;
CREATE TABLE  `scruwp`.`status` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `scruwp`.`tasks`;
CREATE TABLE  `scruwp`.`tasks` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `idHistory` int(10) unsigned default NULL,
  `idStatus` int(10) unsigned default NULL,
  `idUser` int(10) unsigned default NULL,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  `text` text collate utf8_unicode_ci NOT NULL,
  `color` char(6) collate utf8_unicode_ci default 'FFFFFF',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `scruwp`.`tasks_log`;
CREATE TABLE  `scruwp`.`tasks_log` (
  `id` int(11) NOT NULL auto_increment,
  `idTask` int(11) NOT NULL,
  `oldStatus` int(11) NOT NULL,
  `newStatus` int(11) NOT NULL,
  `time` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `scruwp`.`teams`;
CREATE TABLE  `scruwp`.`teams` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `scruwp`.`users`;
CREATE TABLE  `scruwp`.`users` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `idUserType` int(10) unsigned NOT NULL,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  `login` varchar(255) collate utf8_unicode_ci NOT NULL,
  `pass` varchar(255) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `idUserType` (`idUserType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `scruwp`.`users_type`;
CREATE TABLE  `scruwp`.`users_type` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
