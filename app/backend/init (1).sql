-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dahondb
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `disease`
--

DROP TABLE IF EXISTS `disease`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disease` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(25) DEFAULT NULL,
  `cause` varchar(25) DEFAULT NULL,
  `severity` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disease`
--

LOCK TABLES `disease` WRITE;
/*!40000 ALTER TABLE `disease` DISABLE KEYS */;
/*!40000 ALTER TABLE `disease` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `growth_condition`
--

DROP TABLE IF EXISTS `growth_condition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `growth_condition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plantID` int DEFAULT NULL,
  `soil_type` varchar(75) DEFAULT NULL,
  `light` varchar(75) DEFAULT NULL,
  `water_needs` varchar(75) DEFAULT NULL,
  `temperature` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plantID` (`plantID`),
  CONSTRAINT `growth_condition_ibfk_1` FOREIGN KEY (`plantID`) REFERENCES `plant` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `growth_condition`
--

LOCK TABLES `growth_condition` WRITE;
/*!40000 ALTER TABLE `growth_condition` DISABLE KEYS */;
/*!40000 ALTER TABLE `growth_condition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plant`
--

DROP TABLE IF EXISTS `plant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `common_name` varchar(25) DEFAULT NULL,
  `scientific_name` varchar(45) DEFAULT NULL,
  `family` varchar(30) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plant`
--

LOCK TABLES `plant` WRITE;
/*!40000 ALTER TABLE `plant` DISABLE KEYS */;
/*!40000 ALTER TABLE `plant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prevention`
--

DROP TABLE IF EXISTS `prevention`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prevention` (
  `id` int NOT NULL AUTO_INCREMENT,
  `diseaseID` int DEFAULT NULL,
  `prevention` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `diseaseID` (`diseaseID`),
  CONSTRAINT `prevention_ibfk_1` FOREIGN KEY (`diseaseID`) REFERENCES `disease` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prevention`
--

LOCK TABLES `prevention` WRITE;
/*!40000 ALTER TABLE `prevention` DISABLE KEYS */;
/*!40000 ALTER TABLE `prevention` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scan`
--

DROP TABLE IF EXISTS `scan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userID` int DEFAULT NULL,
  `image` mediumblob,
  `datetime` datetime DEFAULT NULL,
  `probability` float DEFAULT NULL,
  `predicted_plant` int DEFAULT NULL,
  `predicted_disease` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userID` (`userID`),
  KEY `predicted_plant` (`predicted_plant`),
  KEY `predicted_disease` (`predicted_disease`),
  CONSTRAINT `scan_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`id`),
  CONSTRAINT `scan_ibfk_2` FOREIGN KEY (`predicted_plant`) REFERENCES `plant` (`id`),
  CONSTRAINT `scan_ibfk_3` FOREIGN KEY (`predicted_disease`) REFERENCES `disease` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scan`
--

LOCK TABLES `scan` WRITE;
/*!40000 ALTER TABLE `scan` DISABLE KEYS */;
/*!40000 ALTER TABLE `scan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `species_affected`
--

DROP TABLE IF EXISTS `species_affected`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `species_affected` (
  `id` int NOT NULL AUTO_INCREMENT,
  `diseaseID` int DEFAULT NULL,
  `species` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `diseaseID` (`diseaseID`),
  CONSTRAINT `species_affected_ibfk_1` FOREIGN KEY (`diseaseID`) REFERENCES `disease` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `species_affected`
--

LOCK TABLES `species_affected` WRITE;
/*!40000 ALTER TABLE `species_affected` DISABLE KEYS */;
/*!40000 ALTER TABLE `species_affected` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `symptom`
--

DROP TABLE IF EXISTS `symptom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `symptom` (
  `id` int NOT NULL AUTO_INCREMENT,
  `diseaseID` int DEFAULT NULL,
  `symptom` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `diseaseID` (`diseaseID`),
  CONSTRAINT `symptom_ibfk_1` FOREIGN KEY (`diseaseID`) REFERENCES `disease` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `symptom`
--

LOCK TABLES `symptom` WRITE;
/*!40000 ALTER TABLE `symptom` DISABLE KEYS */;
/*!40000 ALTER TABLE `symptom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment`
--

DROP TABLE IF EXISTS `treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `diseaseID` int DEFAULT NULL,
  `treatment` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `diseaseID` (`diseaseID`),
  CONSTRAINT `treatment_ibfk_1` FOREIGN KEY (`diseaseID`) REFERENCES `disease` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
/*!40000 ALTER TABLE `treatment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-13 19:22:29
