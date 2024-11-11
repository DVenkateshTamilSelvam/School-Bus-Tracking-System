-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: bts
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (12,'a','c'),(1234,'tamil','abcd');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_register`
--

DROP TABLE IF EXISTS `attendance_register`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendance_register` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `is_present` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_register`
--

LOCK TABLES `attendance_register` WRITE;
/*!40000 ALTER TABLE `attendance_register` DISABLE KEYS */;
INSERT INTO `attendance_register` VALUES (1,201,'absent','2024-04-03 14:00:50'),(2,202,'present','2024-04-03 14:00:50'),(3,203,'absent','2024-04-03 14:00:50'),(4,204,'absent','2024-04-03 14:00:50'),(5,207,'present','2024-04-03 14:00:50'),(6,201,'present','2024-04-15 18:15:04'),(7,202,'present','2024-04-15 18:15:04'),(8,207,'absent','2024-04-15 18:15:04');
/*!40000 ALTER TABLE `attendance_register` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attenders`
--

DROP TABLE IF EXISTS `attenders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attenders` (
  `attender_id` int(11) NOT NULL,
  `attender_name` varchar(255) NOT NULL,
  `attender_contact` varchar(20) DEFAULT NULL,
  `age` int(2) DEFAULT NULL,
  `address` varchar(55) DEFAULT NULL,
  `password` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`attender_id`),
  UNIQUE KEY `attender_name` (`attender_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attenders`
--

LOCK TABLES `attenders` WRITE;
/*!40000 ALTER TABLE `attenders` DISABLE KEYS */;
INSERT INTO `attenders` VALUES (101,'tom','9876543221',30,'North Street','login'),(102,'john','9763689651',32,'South Street','signup'),(456,'Xx','6790032169',35,'Xx',',x'),(123456,'Ss','Asdf',0,'Abc','3456');
/*!40000 ALTER TABLE `attenders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buses`
--

DROP TABLE IF EXISTS `buses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buses` (
  `bus_id` int(11) NOT NULL,
  `bus_number` varchar(20) NOT NULL,
  `route_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`bus_id`),
  UNIQUE KEY `bus_number` (`bus_number`),
  KEY `route_id` (`route_id`),
  CONSTRAINT `buses_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buses`
--

LOCK TABLES `buses` WRITE;
/*!40000 ALTER TABLE `buses` DISABLE KEYS */;
INSERT INTO `buses` VALUES (401,'B401',301);
/*!40000 ALTER TABLE `buses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gps_data`
--

DROP TABLE IF EXISTS `gps_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gps_data` (
  `gps_id` int(11) NOT NULL AUTO_INCREMENT,
  `attender_id` int(11) DEFAULT NULL,
  `latitude` decimal(10,6) DEFAULT NULL,
  `longitude` decimal(10,6) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`gps_id`),
  KEY `attender_id` (`attender_id`),
  CONSTRAINT `gps_data_ibfk_1` FOREIGN KEY (`attender_id`) REFERENCES `attenders` (`attender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gps_data`
--

LOCK TABLES `gps_data` WRITE;
/*!40000 ALTER TABLE `gps_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `gps_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `live_location`
--

DROP TABLE IF EXISTS `live_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `live_location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `attender_id` int(11) NOT NULL,
  `latitude` decimal(10,6) NOT NULL,
  `longitude` decimal(10,6) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `live_location`
--

LOCK TABLES `live_location` WRITE;
/*!40000 ALTER TABLE `live_location` DISABLE KEYS */;
INSERT INTO `live_location` VALUES (1,101,8.687728,77.737392,'2024-04-15 10:05:26');
/*!40000 ALTER TABLE `live_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `routes` (
  `route_id` int(11) NOT NULL,
  `stop_name` varchar(255) NOT NULL,
  PRIMARY KEY (`route_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` VALUES (301,'Tenkasi');
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `student_contact` varchar(20) DEFAULT NULL,
  `attender_id` int(11) DEFAULT NULL,
  `bus_id` int(11) DEFAULT NULL,
  `class` varchar(5) DEFAULT NULL,
  `parent_name` varchar(55) DEFAULT NULL,
  `email` varchar(90) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `route_id` int(15) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  KEY `attender_id` (`attender_id`),
  KEY `bus_id` (`bus_id`),
  KEY `FK_students` (`route_id`),
  CONSTRAINT `FK_students` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`attender_id`) REFERENCES `attenders` (`attender_id`),
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`bus_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (201,'Gayu','8765439812',101,401,'6','Selvi','abc@gmail.com','010121',301),(202,'Ram','6374810025',101,401,'3','Kannan','raamks7531@gmail.com','Abc123',301),(207,'Tamil','8220775298',101,401,'10','Durai','tamilofficial2@gmail.com','12345678',301);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-26 11:31:10
