CREATE DATABASE `opm` /*!40100 DEFAULT CHARACTER SET utf8 */;

CREATE TABLE `department` (
  `departmentid` int(11) NOT NULL AUTO_INCREMENT,
  `departmentName` varchar(100) NOT NULL,
  `departmentHead` varchar(100) NOT NULL,
  `creator` int(11) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`departmentid`),
  UNIQUE KEY `department_unique` (`departmentName`,`departmentHead`)
) ENGINE=InnoDB AUTO_INCREMENT=238 DEFAULT CHARSET=utf8;

CREATE TABLE `role` (
  `roleid` int(11) NOT NULL AUTO_INCREMENT,
  `rolename` varchar(45) NOT NULL,
  PRIMARY KEY (`roleid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

CREATE TABLE `settings` (
  `settingsid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `value` text NOT NULL,
  `category` varchar(45) NOT NULL,
  PRIMARY KEY (`settingsid`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

CREATE TABLE `status` (
  `statusid` int(11) NOT NULL AUTO_INCREMENT,
  `statustext` text,
  `taskid` int(11) DEFAULT NULL,
  `type` varchar(45) NOT NULL,
  `creator` int(11) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `periodnumber` int(2) NOT NULL,
  PRIMARY KEY (`statusid`),
  KEY `task_id_fkey_idx` (`taskid`),
  KEY `statusIndex` (`taskid`,`type`,`periodnumber`),
  CONSTRAINT `task_id_fkey` FOREIGN KEY (`taskid`) REFERENCES `task` (`taskid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8;

CREATE TABLE `task` (
  `taskid` int(11) NOT NULL AUTO_INCREMENT,
  `details` text,
  `taskname` varchar(45) NOT NULL,
  `departmentid` int(11) DEFAULT NULL,
  `assignedto` int(10) NOT NULL,
  `startdate` date NOT NULL,
  `duedate` date NOT NULL,
  `creator` varchar(20) DEFAULT NULL,
  `progress` decimal(10,1) DEFAULT '0.0',
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `datecompleted` datetime DEFAULT NULL,
  PRIMARY KEY (`taskid`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8;

CREATE TABLE `task_department` (
  `task_departmentid` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`task_departmentid`),
  KEY `task_department_task_id_idx` (`task_id`),
  KEY `task_department_dept_id_idx` (`department_id`),
  CONSTRAINT `task_department_dept_id` FOREIGN KEY (`department_id`) REFERENCES `department` (`departmentid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `task_department_task_id` FOREIGN KEY (`task_id`) REFERENCES `task` (`taskid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `username` varchar(45) NOT NULL,
  `departmentid` int(11) DEFAULT NULL,
  `hashedPassword` varchar(45) NOT NULL,
  `roleid` int(11) DEFAULT NULL,
  PRIMARY KEY (`userid`,`email`,`username`),
  UNIQUE KEY `unique_username_index` (`username`),
  KEY `department_id_fkey_idx` (`departmentid`),
  KEY `role_id_fkey_idx` (`roleid`),
  CONSTRAINT `department_id_fkey` FOREIGN KEY (`departmentid`) REFERENCES `department` (`departmentid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `role_id_fkey` FOREIGN KEY (`roleid`) REFERENCES `role` (`roleid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=790 DEFAULT CHARSET=utf8;





