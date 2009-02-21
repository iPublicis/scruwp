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

--
-- Definition of table `scruwp`.`colors_set`
--

DROP TABLE IF EXISTS `scruwp`.`colors_set`;
CREATE TABLE  `scruwp`.`colors_set` (
  `id` tinyint(3) unsigned NOT NULL auto_increment,
  `name` varchar(255) NOT NULL,
  `background` char(6) NOT NULL default 'FFFFFF',
  `border` char(6) NOT NULL default '999999',
  `color` char(6) NOT NULL default '000000',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `scruwp`.`colors_set`
--
INSERT INTO `scruwp`.`colors_set` VALUES 
 (1,'aqua','00FFFF','00CFCF','000000'),
 (2,'gray','808080','505050','000000'),
 (3,'navy','000080','000050','000000'),
 (4,'silver','C0C0C0','909090','000000'),
 (5,'black','000000','FFFFFF','FFFFFF'),
 (6,'green','008000','005000','000000'),
 (7,'olive','808000','505000','000000'),
 (8,'teal','008080','005050','000000'),
 (9,'blue','0000FF','0000CF','000000'),
 (10,'lime','00FF00','00CF00','000000'),
 (11,'purple','800080','500050','000000'),
 (12,'white','FFFFFF','000000','000000'),
 (13,'fuchsia','FF00FF','CF00CF','000000'),
 (14,'maroon','800000','500000','000000'),
 (15,'red','FF0000','CF0000','000000'),
 (16,'yellow','FFFF00','CFCF00','000000');

--
-- Definition of table `scruwp`.`histories`
--

DROP TABLE IF EXISTS `scruwp`.`histories`;
CREATE TABLE  `scruwp`.`histories` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `idSprint` int(10) unsigned NOT NULL,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  `text` text collate utf8_unicode_ci NOT NULL,
  `estimate` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Definition of table `scruwp`.`sprints`
--

DROP TABLE IF EXISTS `scruwp`.`sprints`;
CREATE TABLE  `scruwp`.`sprints` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `idTeam` int(10) unsigned NOT NULL,
  `status` tinyint(1) default '0',
  `beginDate` date default NULL,
  `endDate` date default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Definition of table `scruwp`.`status`
--

DROP TABLE IF EXISTS `scruwp`.`status`;
CREATE TABLE  `scruwp`.`status` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Definition of table `scruwp`.`tasks`
--

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

--
-- Definition of table `scruwp`.`tasks_log`
--

DROP TABLE IF EXISTS `scruwp`.`tasks_log`;
CREATE TABLE  `scruwp`.`tasks_log` (
  `id` int(11) NOT NULL auto_increment,
  `idTask` int(11) NOT NULL,
  `oldStatus` int(11) NOT NULL,
  `newStatus` int(11) NOT NULL,
  `time` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Definition of table `scruwp`.`teams`
--

DROP TABLE IF EXISTS `scruwp`.`teams`;
CREATE TABLE  `scruwp`.`teams` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Definition of table `scruwp`.`users`
--

DROP TABLE IF EXISTS `scruwp`.`users`;
CREATE TABLE  `scruwp`.`users` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `idUserType` int(10) unsigned default NULL,
  `idColorSet` tinyint(3) unsigned NOT NULL,
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  `login` varchar(255) collate utf8_unicode_ci NOT NULL,
  `pass` varchar(255) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `idUserType` (`idUserType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Definition of table `scruwp`.`users_type`
--

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