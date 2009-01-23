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
CREATE TABLE  `scruwp`.`histories` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  `text` text collate utf8_unicode_ci NOT NULL,
  `estimate` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
INSERT INTO `scruwp`.`histories` VALUES  (1,'Teste','Essa Ã© apenas uma estÃ³ria de teste!',0),
 (2,'awdawd','awlyidbaowiyd',0),
 (3,'awdawd','awdawd',0),
 (4,'fghj356jetdkr67','34tdfgw45hw45jh',13);
CREATE TABLE  `scruwp`.`status` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
CREATE TABLE  `scruwp`.`tasks` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `idHistory` int(10) unsigned default NULL,
  `idStatus` int(10) unsigned default NULL,
  `idUser` int(10) unsigned default NULL,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  `text` text collate utf8_unicode_ci NOT NULL,
  `color` char(6) collate utf8_unicode_ci default 'FFFFFF',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
INSERT INTO `scruwp`.`tasks` VALUES  (1,1,1,NULL,'Task','DescriÃ§Ã£o da task!','FFFFFF'),
 (2,1,1,NULL,'sdiuasidgub','segadgargsar','0000FF'),
 (3,1,1,NULL,'sdiuasidgubwaef','segadgargsarawefa','00FFFF'),
 (4,2,3,NULL,'aergaerg','eargaerg','FF00FF'),
 (5,2,3,NULL,'awdawd','awdawd','FFFF00'),
 (6,2,1,NULL,'aergaerg','aergaergaerg','FF0000'),
 (7,2,1,NULL,'waegaweg','wegwaeg','FFFFFF'),
 (8,1,1,NULL,'awefawefawef','awefawefawefawef','FFFFFF'),
 (9,3,3,NULL,'awefawefawef','awefawefawe','FFFFFF'),
 (10,3,2,NULL,'awdawdawd','awdawdawdawdawd','FFFFFF'),
 (11,4,2,NULL,'Danilo','DescriÃ§Ã£o da primeira task colorida! \\o/','FFFF00'),
 (12,1,1,NULL,'xpto','renato','0000FF'),
 (13,1,1,NULL,'xpto','renato','0000FF'),
 (14,4,2,NULL,'aergaerg','aserfaserga','00FF00'),
 (15,1,1,NULL,'','',''),
 (16,1,1,NULL,'Daniel','teste','000000'),
 (17,2,2,NULL,'Servlets','API - PowerPoint ApresentaÃ§Ã£o','FF00FF');
CREATE TABLE  `scruwp`.`tasks_log` (
  `id` int(11) NOT NULL auto_increment,
  `idTask` int(11) NOT NULL,
  `oldStatus` int(11) NOT NULL,
  `newStatus` int(11) NOT NULL,
  `time` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
INSERT INTO `scruwp`.`tasks_log` VALUES  (1,1,1,2,'2009-01-07 22:26:44');
CREATE TABLE  `scruwp`.`userType` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
CREATE TABLE  `scruwp`.`users` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `idUserType` int(10) unsigned NOT NULL,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  `login` varchar(255) collate utf8_unicode_ci NOT NULL,
  `pass` varchar(255) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `idUserType` (`idUserType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
