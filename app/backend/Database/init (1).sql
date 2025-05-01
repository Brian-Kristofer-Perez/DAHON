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
  `name` varchar(75) DEFAULT NULL,
  `cause` varchar(300) DEFAULT NULL,
  `severity` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disease`
--

LOCK TABLES `disease` WRITE;
/*!40000 ALTER TABLE `disease` DISABLE KEYS */;
INSERT INTO `disease` VALUES (1,'tomato: early blight','Fungal (Alternaria solani)','Moderate to severe, especially in warm, wet climates'),(2,'tomato: septoria leaf spot','Fungal (Septoria lycopersici)','Moderate; can significantly reduce yield if untreated'),(3,'tomato: tomato yellow leaf curl virus','Virus (Tomato yellow leaf curl virus); transmitted by whiteflies','Severe – can result in complete crop loss if not managed.'),(4,'tomato: bacterial spot','Bacterial (Xanthomonas campestris)','Moderate to severe – high humidity can exacerbate disease spread quickly.'),(5,'tomato: target spot','Fungal (Alternaria alternata)','Moderate to severe – can cause significant defoliation and yield loss under favorable conditions.'),(6,'tomato: tomato mosaic virus','Viral (Tomato Mosaic Virus)','Moderate to high depending on infection timing and crop susceptibility'),(7,'tomato: leaf mold','Fungal (Passalora fulva)','Moderate to severe, especially under warm, humid conditions'),(8,'tomato: spider mites','Pest (Tetranychus urticae or two-spotted spider mite)','Moderate to high; populations can explode rapidly under hot, dry conditions'),(9,'grape: leaf blight','Fungal (Isariopsis clavispora)','Mild to moderate; can become severe under prolonged wet conditions'),(11,'grape: black rot','Fungal (Guignardia bidwellii)','High; can cause complete crop loss if left unmanaged'),(12,'grape: esca (black measles)','Fungal complex (Fomitiporia mediterranea, Phaeoacremonium spp., Phaeomoniella chlamydospora)','Severe; disease is chronic and can lead to long-term vine decline and death'),(13,'cherry (including sour): powdery mildew','Fungal (Podosphaera clandestina)','Moderate to severe, especially under warm, dry conditions with high humidity'),(14,'strawberry: leaf scorch','Fungal (Diplocarpon earliana)','Mild to moderate, but can reduce plant productivity significantly in wet seasons'),(15,'bell pepper: bacterial spot','Bacterial (Xanthomonas campestris)','High; can cause significant crop loss under favorable (warm, wet) conditions'),(16,'bell pepper: phytophthora blight','Soilborne oomycete pathogen Phytophthora capsici','High; can cause rapid plant death and significant yield loss, especially in poorly drained soils.'),(17,'orange: huanglongbing (citrus greening)','Bacterial infection by Candidatus Liberibacter species, transmitted by the Asian citrus psyllid (Diaphorina citri)','High; HLB is considered one of the most devastating citrus diseases worldwide. It leads to significant yield losses, tree decline, and eventual death. The disease has severely impacted citrus industries in affected regions, with no effective cure currently available.'),(18,'squash: powdery mildew','Fungal infection primarily by Podosphaera xanthii and Erysiphe cichoracearum.','Moderate to High; if left untreated, powdery mildew can significantly reduce photosynthesis, leading to decreased yields and plant death.'),(19,'potato: late blight','Late blight is caused by Phytophthora infestans, a pathogen that spreads rapidly through airborne spores and water splash. It can infect plants at any stage of growth and is notorious for causing the Irish Potato Famine in the 1840s.','High. Late blight can cause rapid and complete destruction of potato foliage and tubers, leading to significant yield losses. Under favorable conditions, entire fields can be devastated within days.'),(20,'potato: early blight','Early blight is caused by the fungus Alternaria solani, which survives in infected plant debris and soil. The pathogen spreads through wind, rain splash, and mechanical means, infecting plants through wounds or natural openings.','Moderate to High. Early blight can cause significant yield losses, especially under favorable environmental conditions. The disease leads to premature defoliation, reducing photosynthetic capacity and tuber quality. In severe cases, yield losses can reach up to 30%.'),(21,'corn (maize): northern corn leaf blight','NCLB is caused by the fungus Exserohilum turcicum, which overwinters on corn leaf debris. The pathogen produces spores that are dispersed by wind and rain, infecting new plants under favorable conditions.','High; NCLB can cause significant yield loss in susceptible corn hybrids. Severe outbreaks of the disease can cause up to 30–50% yield loss in dent corn if the disease is established before tassel.'),(22,'corn (maize): gray leaf spot','GLS is caused by the fungus Cercospora zeae-maydis, which overwinters on corn leaf debris. The pathogen produces spores that are dispersed by wind and rain, infecting new plants under favorable conditions.','High; GLS can cause significant yield loss in susceptible corn hybrids. Severe outbreaks of the disease can cause up to 30–50% yield loss in dent corn if the disease is established before tassel.'),(23,'peach: bacterial spot','The bacterium Xanthomonas arboricola pv. pruni survives in twig cankers and infected buds. It spreads via wind-driven rain, splashing water, and contaminated tools, especially during wet, warm weather.','High; bacterial spot can cause significant yield losses, especially in susceptible cultivars under favorable environmental conditions. Severe infections can lead to premature defoliation, fruit drop, and reduced tree vigor.'),(24,'tomato: late blight','Fungal (Phytophthora infestans)','Severe; can result in total crop loss within days if not controlled, especially during wet weather.'),(25,'corn (maize): common rust','Fungal (Puccinia sorghi)','Usually low to moderate; can become severe in susceptible hybrids under favorable conditions.'),(26,'apple: apple scab','Fungal (Venturia inaequalis)','Moderate to severe, depending on weather and cultivar'),(27,'apple: black rot','Fungal (Botryosphaeria obtusa)','Can be severe if unmanaged'),(28,'apple: cedar apple rust','Fungal (Gymnosporangium juniperi-virginianae)','Moderate; most damaging in humid climates'),(29,'healthy','None detected','None');
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
  `soil_type` varchar(200) DEFAULT NULL,
  `light` varchar(200) DEFAULT NULL,
  `water_needs` varchar(200) DEFAULT NULL,
  `temperature` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plantID` (`plantID`),
  CONSTRAINT `growth_condition_ibfk_1` FOREIGN KEY (`plantID`) REFERENCES `plant` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `growth_condition`
--

LOCK TABLES `growth_condition` WRITE;
/*!40000 ALTER TABLE `growth_condition` DISABLE KEYS */;
INSERT INTO `growth_condition` VALUES (1,2,'Well-drained, loamy soil; pH 6.0–6.8','Full sun (6–8+ hours/day)','Regular, deep watering (keep soil consistently moist but not soggy)','Warm-season; ideal temperature range: 70–85°F (21–29°C)'),(2,3,'Well-drained, sandy or loamy soils; pH 5.5–7.0','Full sun','Moderate; avoid overwatering','Temperate to warm climates; need hot, dry summers and mild winters'),(3,4,'Acidic, well-drained soil; pH 4.5–5.5','Full sun','Keep soil consistently moist','Temperate to cool climates; highbush types need winter chill'),(5,6,'Well-drained, sandy or loamy soil; pH 6.0–7.5','Full sun','Moderate; avoid waterlogging','Temperate climates with cold winters (for dormancy) and mild springs'),(6,7,'Well-drained, sandy loam; pH 5.5–6.8','Full sun','Regular moisture; do not let soil dry out completely','Cool to temperate; perform best with warm days and cool nights'),(7,8,'Fertile, well-drained soil; pH 6.0–6.8','Full sun','Consistent watering, especially during fruit development','Warm-season crop; grows best between 70–85°F (21–29°C)'),(8,11,'Well-drained, loamy soil; pH between 6.0–7.0','Full sun (minimum 6–8 hours of direct sunlight daily)','Regular, deep watering; keep soil consistently moist but not waterlogged. Allow the top inch of soil to dry between waterings.','Warm, subtropical to tropical climates; ideal temperature range: 68–85°F (20–29°C). Sensitive to frost; protection needed in cooler regions.'),(9,12,'Well-drained, fertile loamy soil; pH between 6.0–7.0','Full sun (minimum 6–8 hours of direct sunlight daily)','Consistent moisture is essential, especially during flowering and pod development. Avoid waterlogging.','Warm-season crop; optimal temperature range: 70–95°F (21–35°C). Sensitive to frost; best planted after the last frost date.'),(13,29,'Well-drained, fertile loamy soil; pH between 5.8–6.8','Full sun (minimum 6–8 hours of direct sunlight daily)','Regular, deep watering; keep soil consistently moist but not waterlogged. Avoid overhead watering to reduce disease risk.','Warm-season crop; optimal temperature range: 70–95°F (21–35°C). Sensitive to frost; plant after the last frost date.'),(14,30,'Well-drained, loose, and friable soils rich in organic matter. Sandy loam and loamy soils are ideal. pH 5.0 to 6.5','Full sun; requires at least 6–8 hours of direct sunlight daily for optimal growth','Requires consistent moisture, especially during tuber formation. Ensure the soil remains moist but not waterlogged.','Cool-season crop. Ideal growing temperatures range between 60–70°F (16–21°C). Sensitive to frost; plant after last frost when soil is at least 45°F (7°C).'),(15,31,'Well-drained, fertile loamy soils with pH between 5.8 and 7.0; heavy nitrogen feeder','Full sun, ideally receiving at least 6–8 hours of direct sunlight daily','Consistent moisture essential, particularly during silking and tasseling. Requires ~15 inches (38 cm) during the season.','Warm temperatures between 60°F and 95°F (16°C to 35°C); frost-free season of 90–120 days depending on variety.'),(16,32,'Well-drained, loamy or sandy soil with a pH between 6.0 and 7.0','Full sun (minimum 6–8 hours of direct sunlight daily)','Consistent moisture, especially during the first two years; avoid overwatering to prevent root rot','Temperate climates with cold winters; requires 600–900 chilling hours below 45°F (7°C) for optimal fruiting'),(17,33,'Well-drained, loamy soil with a slightly acidic to neutral pH (6.0–7.0). Avoid heavy clay soils.','Full sun (minimum 6–8 hours of direct sunlight daily). Ample sunlight needed for optimal fruit production.','Regular watering is essential, especially during dry periods. Deep watering once or twice a week.','Temperate climates with distinct seasons; requires chilling hours (below 45°F or 7°C) during winter for flowering and fruiting.');
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
  `scientific_name` varchar(75) DEFAULT NULL,
  `family` varchar(30) DEFAULT NULL,
  `type` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plant`
--

LOCK TABLES `plant` WRITE;
/*!40000 ALTER TABLE `plant` DISABLE KEYS */;
INSERT INTO `plant` VALUES (2,'Tomato','Solanum lycopersicum','Solanaceae','Fruit'),(3,'Grape','Vitis vinifera (European grape), Vitis labrusca (American grape), etc.','Vitaceae','Fruit'),(4,'Blueberry','Vaccinium corymbosum (Highbush), Vaccinium angustifolium (Lowbush)','Ericaceae','Fruit'),(6,'Cherry','Prunus avium (Sweet cherry), Prunus cerasus (Sour cherry)','Rosaceae','Fruit'),(7,'Strawberry','Fragaria × ananassa','Rosaceae','Fruit'),(8,'Pepper Bell','Capsicum annuum','Solanaceae','Fruit'),(11,'Orange','Citrus × sinensis','Rutaceae','Fruit'),(12,'Soybean','Glycine max','Fabaceae','Legume'),(29,'Squash','Cucurbita pepo','Cucurbitaceae','Fruit'),(30,'Potato','Solanum tuberosum','Solanaceae','Tuberous root vegetable'),(31,'Corn (Maize)','Zea mays','Poaceae','Annual cereal grain'),(32,'Peach','Prunus persica','Rosaceae','Deciduous fruit tree'),(33,'Apple','Malus domestica','Rosaceae','Deciduous fruit tree');
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
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prevention`
--

LOCK TABLES `prevention` WRITE;
/*!40000 ALTER TABLE `prevention` DISABLE KEYS */;
INSERT INTO `prevention` VALUES (1,1,'Apply fungicides like chlorothalonil, mancozeb, copper-based products, or azoxystrobin'),(2,1,'Begin treatments early, especially in humid or wet weather'),(3,1,'Remove and destroy infected plant debris'),(4,1,'Improve air circulation by pruning and staking'),(5,2,'Practice 2–3 year crop rotation'),(6,2,'Use disease-resistant or tolerant varieties if available'),(7,2,'Space plants properly to improve air flow'),(8,2,'Avoid overhead watering and keep foliage dry'),(9,3,'Plant TYLCV-resistant varieties (e.g., ‘Tygress’, ‘BHN 444’)'),(10,3,'Use reflective mulches to deter whiteflies'),(11,3,'Practice strict sanitation—remove infected plants immediately'),(12,3,'Avoid planting tomatoes near whitefly host plants'),(13,4,'Use certified disease-free seeds or transplants'),(14,4,'Avoid overhead watering to reduce leaf wetness'),(15,4,'Rotate crops every 2–3 years with non-solanaceous plants'),(16,4,'Sanitize tools and equipment between uses'),(17,4,'Apply mulch to prevent splash transmission from soil'),(18,5,'Practice crop rotation and field sanitation'),(19,5,'Use drip irrigation to avoid wetting foliage'),(20,5,'Improve air circulation by spacing plants adequately'),(21,5,'Control weeds that may serve as alternate hosts'),(22,6,'Use virus-resistant varieties'),(23,6,'Sanitize hands and tools regularly'),(24,6,'Avoid smoking in the growing area (tobacco may carry the virus)'),(25,6,'Control weed hosts'),(26,7,'Ensure good ventilation and air circulation, especially in greenhouses'),(27,7,'Avoid overhead watering and high humidity'),(28,7,'Use resistant tomato varieties (e.g., those with the Cf gene)'),(29,7,'Practice crop rotation and clean up plant debris'),(30,8,'Keep plants well-watered and reduce drought stress'),(31,8,'Ensure proper airflow and humidity in greenhouses'),(32,8,'Regularly inspect for early signs of infestation'),(33,8,'Avoid over-fertilizing with nitrogen, which can promote mite populations'),(34,9,'Prune vines to improve air circulation and reduce humidity'),(35,9,'Avoid overhead irrigation'),(36,9,'Use disease-resistant grape cultivars when available'),(37,9,'Practice regular sanitation and remove leaf litter after harvest'),(42,11,'Plant resistant cultivars if available'),(43,11,'Maintain open canopies through pruning to improve airflow'),(44,11,'Avoid overhead watering and minimize leaf wetness'),(45,11,'Use clean planting material and practice proper vineyard hygiene'),(46,12,'Avoid large pruning wounds during wet periods'),(47,12,'Use sanitized pruning tools'),(48,12,'Remove infected plant material from the vineyard'),(49,12,'Avoid water stress, which predisposes plants to infection'),(50,13,'Select resistant cherry cultivars when available'),(51,13,'Avoid excessive nitrogen fertilization'),(52,13,'Ensure good airflow by proper tree spacing and regular pruning'),(53,13,'Sanitize tools and remove infected plant debris after the season'),(54,14,'Use resistant or tolerant strawberry varieties'),(55,14,'Space plants adequately to allow airflow'),(56,14,'Employ drip irrigation instead of overhead watering'),(57,14,'Remove old plant debris and infected leaves from the field'),(58,15,'Use certified disease-free seed and resistant cultivars'),(59,15,'Avoid overhead irrigation and splashing water'),(60,15,'Rotate crops with non-solanaceous plants for at least two years'),(61,15,'Control weeds and volunteer solanaceous plants that can harbor the bacteria'),(62,16,'Plant in well-drained soils and use raised beds with plastic mulch.'),(63,16,'Avoid using surface water for irrigation; opt for drip irrigation systems.'),(64,16,'Rotate crops with non-host species like cereals.'),(65,16,'Remove and destroy infected plants and fruits promptly.'),(66,16,'Sanitize equipment and tools to prevent pathogen spread.'),(67,17,'Plant certified disease-free nursery stock.'),(68,17,'Implement strict quarantine measures to prevent the introduction of infected material.'),(69,17,'Regular monitoring and early detection of psyllid populations.'),(70,17,'Use of insect-proof netting and biological control agents to manage psyllid vectors.'),(71,17,'Public awareness and education programs to identify and report symptoms early.'),(72,18,'Plant resistant squash varieties when available.'),(73,18,'Ensure proper spacing for air circulation.'),(74,18,'Avoid overhead watering to reduce humidity.'),(75,18,'Remove and destroy infected plant debris promptly.'),(76,18,'Implement crop rotation with non-cucurbit plants.'),(77,19,'Plant certified disease-free seed potatoes.'),(78,19,'Implement crop rotation, avoiding planting potatoes or tomatoes in the same location for at least two years.'),(79,19,'Ensure proper spacing and staking to improve air circulation.'),(80,19,'Monitor weather conditions and apply fungicides proactively during periods of high risk.'),(81,20,'Use certified disease-free seed potatoes.'),(82,20,'Implement crop rotation, avoiding planting potatoes or tomatoes in the same location for at least two years.'),(83,20,'Maintain balanced soil fertility to reduce plant stress.'),(84,20,'Control weeds and volunteer Solanaceous plants that can harbor the pathogen.'),(85,21,'Use resistant hybrids to reduce the risk of infection.'),(86,21,'Implement crop rotation and tillage practices to reduce inoculum levels.'),(87,21,'Monitor fields regularly for early detection and management.'),(88,22,'Use resistant hybrids to reduce the risk of infection.'),(89,22,'Implement crop rotation and tillage practices to reduce inoculum levels.'),(90,22,'Monitor fields regularly for early detection and management.'),(91,23,'Plant resistant cultivars when available.'),(92,23,'Implement proper pruning to improve air circulation.'),(93,23,'Avoid overhead irrigation to reduce leaf wetness.'),(94,23,'Remove and destroy infected plant material to reduce inoculum sources.'),(95,24,'Use resistant or tolerant tomato varieties when available'),(96,24,'Practice crop rotation and do not plant tomatoes or potatoes in the same location more than once every 3–4 years'),(97,24,'Avoid overhead irrigation and water early in the day to allow foliage to dry'),(98,24,'Provide good air circulation by proper plant spacing and pruning lower foliage'),(99,24,'Destroy volunteer tomato and potato plants, which can harbor the pathogen'),(100,24,'Keep the garden free of plant debris and solanaceous weeds'),(101,25,'Plant resistant hybrids'),(102,25,'Rotate crops and manage residue to reduce overwintering spores'),(103,25,'Avoid excessive irrigation and ensure plant spacing'),(104,26,'Plant resistant apple cultivars (e.g., Liberty, Freedom)'),(105,26,'Rake and dispose of fallen leaves'),(106,26,'Prune for air circulation and avoid overhead irrigation'),(107,27,'Maintain tree vigor through proper fertilization and watering'),(108,27,'Avoid wounding the tree'),(109,27,'Clean up orchard debris regularly'),(110,28,'Use resistant apple varieties (e.g., Redfree, Liberty)'),(111,28,'Prune out galls from nearby juniper species'),(112,28,'Ensure good airflow and sanitation'),(113,29,'Continue standard good agricultural practices to maintain plant health');
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
  `species` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `diseaseID` (`diseaseID`),
  CONSTRAINT `species_affected_ibfk_1` FOREIGN KEY (`diseaseID`) REFERENCES `disease` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `species_affected`
--

LOCK TABLES `species_affected` WRITE;
/*!40000 ALTER TABLE `species_affected` DISABLE KEYS */;
INSERT INTO `species_affected` VALUES (1,1,'Solanum lycopersicum'),(2,1,'Solanum tuberosum'),(3,2,'Solanum lycopersicum'),(4,2,'Solanum melongena'),(5,2,'Solanum tuberosum'),(6,3,'Solanum lycopersicum'),(7,3,'Capsicum spp.'),(8,3,'Nicotiana tabacum'),(9,3,'Solanum melongena'),(10,3,'Phaseolus spp.'),(11,3,'Petunia spp.'),(12,4,'Solanum lycopersicum'),(13,4,'Capsicum spp.'),(14,4,'Solanum melongena'),(15,4,'Nicotiana tabacum'),(16,5,'Solanum lycopersicum'),(17,5,'Solanum tuberosum'),(18,5,'Capsicum annuum'),(19,5,'Solanum melongena'),(20,5,'Carica papaya'),(21,6,'Solanum lycopersicum'),(22,6,'Nicotiana tabacum'),(23,6,'Capsicum spp.'),(24,6,'Petunia spp.'),(25,6,'Spinacia oleracea'),(26,6,'Lactuca sativa'),(27,6,'Cucumis sativus'),(28,6,'Various ornamentals'),(29,7,'Solanum lycopersicum'),(30,7,'Solanum pimpinellifolium'),(31,8,'Solanum lycopersicum'),(32,8,'Fragaria × ananassa'),(33,8,'Vitis vinifera'),(34,8,'Capsicum spp.'),(35,8,'Solanum melongena'),(36,8,'Phaseolus spp.'),(37,8,'Cucurbitaceae'),(38,8,'Ornamentals'),(39,9,'Vitis vinifera'),(40,9,'Vitis labrusca'),(41,9,'Vitis riparia'),(42,9,'Wild grape species'),(46,11,'Vitis vinifera'),(47,11,'Vitis labrusca'),(48,11,'Hybrids'),(49,11,'Virginia creeper (Parthenocissus quinquefolia)'),(50,12,'Vitis vinifera'),(51,12,'Vitis labrusca'),(52,12,'Other woody vines occasionally affected'),(53,13,'Prunus avium'),(54,13,'Prunus cerasus'),(55,13,'Peach, plum, and other Prunus species (occasionally)'),(56,14,'Fragaria × ananassa'),(57,14,'Fragaria virginiana'),(58,14,'Fragaria vesca'),(59,15,'Capsicum annuum'),(60,15,'Capsicum frutescens'),(61,15,'Solanum lycopersicum'),(62,15,'Solanum melongena'),(63,16,'Capsicum annuum'),(64,16,'Capsicum frutescens'),(65,16,'Solanum lycopersicum'),(66,16,'Solanum melongena'),(67,16,'Cucurbits'),(68,17,'Citrus × sinensis'),(69,17,'Other citrus species including lemon, lime, grapefruit, and mandarin'),(70,18,'Cucurbita spp. (including zucchini, yellow squash, and pattypan)'),(71,18,'Other cucurbits like cucumbers, melons, and pumpkins'),(72,19,'Potato (Solanum tuberosum)'),(73,19,'Tomato (Solanum lycopersicum)'),(74,19,'Other Solanaceae family members'),(75,20,'Potato (Solanum tuberosum)'),(76,20,'Tomato (Solanum lycopersicum)'),(77,20,'Eggplant (Solanum melongena)'),(78,20,'Peppers (Capsicum spp.)'),(79,20,'Other Solanaceae family members'),(80,21,'Corn (Zea mays)'),(81,22,'Corn (Zea mays)'),(82,23,'Peach (Prunus persica)'),(83,23,'Nectarine'),(84,23,'Apricot'),(85,23,'Plum'),(86,24,'Tomato (Solanum lycopersicum)'),(87,24,'Potato (Solanum tuberosum)'),(88,24,'Eggplant (Solanum melongena)'),(89,24,'Petunia (Petunia spp.)'),(90,24,'Other Solanaceae family members (rare)'),(91,25,'Corn (maize) (Zea mays)'),(92,26,'Apple (Malus domestica)'),(93,26,'Crabapple (Malus spp.)'),(94,27,'Apple (Malus domestica)'),(95,27,'Crabapple (Malus spp.)'),(96,28,'Apple (Malus domestica)'),(97,28,'Crabapple (Malus spp.)'),(98,28,'Eastern red cedar (Juniperus virginiana) and other Juniperus species'),(99,29,'No diseases detected');
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
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `symptom`
--

LOCK TABLES `symptom` WRITE;
/*!40000 ALTER TABLE `symptom` DISABLE KEYS */;
INSERT INTO `symptom` VALUES (1,1,'Begins on older, lower leaves as small dark spots'),(2,1,'Spots expand into concentric rings, forming a characteristic \'bullseye\' pattern'),(3,1,'Surrounding tissue often turns yellow and the leaf dies'),(4,1,'In severe cases, progresses upward causing defoliation'),(5,1,'Dark, sunken lesions may develop on stems and fruits, especially near the calyx'),(6,2,'Tiny, round lesions with dark brown margins and pale gray or tan centers'),(7,2,'Often surrounded by a yellow halo'),(8,2,'Lesions contain black fruiting bodies (pycnidia) visible with a hand lens'),(9,2,'Progresses rapidly in wet conditions, causing defoliation from the bottom up'),(10,2,'Fruit is rarely affected but may suffer from sunscald due to leaf loss'),(11,3,'Young leaves curl upward and turn yellow along the margins'),(12,3,'Plants are stunted with limited flowering and fruiting'),(13,3,'Fruit may be undersized or fail to develop'),(14,3,'Leaves appear thickened and brittle'),(15,3,'Symptoms may mimic nutrient deficiencies or herbicide damage'),(16,4,'Water-soaked lesions with yellow halos on leaves, stems, and fruit'),(17,4,'Spots become brown or black with time'),(18,4,'Leaves may become tattered and fall off'),(19,4,'Fruit may show small, raised, scabby spots that affect marketability'),(20,5,'Small, dark, circular lesions with concentric rings'),(21,5,'Lesions enlarge and may merge, leading to significant leaf loss'),(22,5,'Leaf drop starts from the bottom and progresses upward'),(23,5,'May also affect stems and fruit in severe infections'),(24,6,'Mottling and mosaic patterns on leaves'),(25,6,'Leaf curling, distortion, and narrowing'),(26,6,'Stunted plant growth'),(27,6,'Deformed and discolored fruits'),(28,6,'Yield reduction'),(29,7,'Pale green or yellow spots on upper leaf surfaces, which enlarge over time'),(30,7,'Fuzzy, olive-green to grayish mold on the underside of leaves directly below spots'),(31,7,'Infected leaves may wither, die, and fall off'),(32,7,'Typically begins in lower foliage and progresses upward'),(33,7,'Fruit and stem infections are rare'),(34,8,'Fine webbing on leaves and stems'),(35,8,'Stippled, yellow, or bronzed appearance of leaves due to feeding'),(36,8,'Leaf curling, drying, and eventual drop'),(37,8,'Heavy infestations can severely stunt plant growth or kill seedlings'),(38,9,'Brown to black angular leaf spots, often limited by leaf veins'),(39,9,'Concentric ring patterns may develop in spots (similar to target spots)'),(40,9,'Leaf yellowing and premature drop'),(41,9,'Symptoms appear first on lower, shaded leaves'),(42,11,'Circular brown lesions on leaves with dark borders'),(43,11,'Black rot on fruit: sunken brown lesions that turn into hard, black mummified berries'),(44,11,'Infected shoots show black cankers'),(45,11,'Can significantly affect yield if not managed'),(46,12,'Leaf symptoms appear as interveinal chlorosis with tiger-stripe patterns'),(47,12,'Dead leaf tissue between veins (necrosis)'),(48,12,'Black streaks visible in wood after cutting stems (vascular discoloration)'),(49,12,'Berry shriveling and poor ripening (in advanced stages)'),(50,12,'Plant decline and sudden dieback in severe cases'),(51,13,'White to gray, powdery fungal growth on the upper surface of leaves, flower buds, stems, and young shoots'),(52,13,'Leaves may become distorted, curled, or stunted'),(53,13,'Severe infections can cause early leaf drop, reduced fruit set, and weakened trees'),(54,13,'Infected buds may fail to open or produce malformed shoots'),(55,14,'Irregular, reddish-brown spots on leaf margins that may expand and coalesce, giving a scorched appearance'),(56,14,'Leaf tips and edges may die back; affected leaves eventually dry out and fall off'),(57,14,'Symptoms often confused with drought or salt injury'),(58,14,'Severely infected plants show reduced vigor and yield'),(59,15,'Small, water-soaked, greasy lesions on leaves, stems, and fruit'),(60,15,'Lesions enlarge and turn dark brown to black, often with a yellow halo'),(61,15,'Leaf spots may coalesce, leading to blighting and premature defoliation'),(62,15,'On fruit, spots are raised, scab-like, and may cause unmarketable blemishes'),(63,15,'Can lead to secondary infections and fruit rot'),(64,16,'Sudden wilting of plants without yellowing of leaves.'),(65,16,'Dark brown lesions at the soil line that may girdle the stem.'),(66,16,'Water-soaked fruit lesions that become covered with white, cottony mold.'),(67,17,'Yellowing of leaf veins and adjacent tissues, leading to blotchy mottling.'),(68,17,'Premature leaf drop and twig dieback.'),(69,17,'Stunted tree growth and reduced vigor.'),(70,17,'Small, misshapen fruits with a thick, pale peel that remains green at the bottom.'),(71,17,'Fruits have a bitter taste and are often misshapen.'),(72,17,'Asymmetrical yellowing distinguishes it from nutrient deficiencies.'),(73,18,'White to grayish powdery spots on leaves and stems.'),(74,18,'Spots may enlarge, covering entire leaf surfaces.'),(75,18,'Infected leaves may turn yellow, curl, and eventually die.'),(76,18,'Reduced plant vigor and fruit yield.'),(77,19,'Water-soaked lesions on leaves that rapidly enlarge and turn brown or black, often with a yellowish halo.'),(78,19,'White, fuzzy fungal growth (sporangia) may appear on the undersides of leaves under humid conditions.'),(79,19,'Stems develop dark brown to black lesions, leading to collapse.'),(80,19,'Tubers exhibit firm, brown, granular rot that can extend into the flesh.'),(81,20,'Initial symptoms appear as small, dark, dry spots on older leaves.'),(82,20,'Lesions enlarge, forming concentric rings, giving a \'target\' or \'bullseye\' appearance.'),(83,20,'Surrounding tissue may turn yellow, leading to leaf drop.'),(84,20,'Stem lesions are dark and sunken, potentially girdling the stem.'),(85,20,'Infected tubers exhibit dark, sunken lesions with dry, corky rot.'),(86,21,'Initial symptoms appear as small, light-green to grayish spots approximately 1–2 weeks after infection.'),(87,21,'Lesions expand into long, narrow, tan to gray \'cigar-shaped\' lesions, typically 1–6 inches in length.'),(88,21,'Lesions may coalesce, covering large leaf areas, leading to significant loss of photosynthetic tissue.'),(89,21,'In severe cases, leaves may appear prematurely dead or gray, resembling frost damage.'),(90,22,'Initial symptoms are small, pinpoint, olive-green spots on lower leaves.'),(91,22,'Lesions expand into long (up to 2 inches), narrow, rectangular, light tan to gray spots, typically confined between leaf veins.'),(92,22,'In severe infections, leaves may appear prematurely dead or gray.'),(93,23,'Leaves: Small, angular, water-soaked spots that may turn reddish-brown and eventually fall out, giving a \'shot-hole\' appearance.'),(94,23,'Fruits: Sunken, dark lesions that can crack and exude gum, leading to unmarketable fruit.'),(95,23,'Twigs: Cankers that may ooze gum, potentially leading to dieback.'),(96,24,'Large, irregular, water-soaked lesions on leaves that quickly turn brown and papery'),(97,24,'White, fuzzy mold (sporangia) may appear on the undersides of infected leaves under humid conditions'),(98,24,'Stems develop dark brown to black greasy-looking lesions that can girdle and kill them'),(99,24,'Fruit develops firm, brown, greasy lesions which may lead to soft rot'),(100,24,'Rapid disease progression can lead to total plant collapse within days under ideal conditions'),(101,25,'Small, round to oval cinnamon-brown pustules on both upper and lower leaf surfaces'),(102,25,'Leaves may yellow and die prematurely under heavy infection'),(103,25,'Reduced photosynthesis and yield'),(104,26,'Olive-green to brown velvety spots on the underside of leaves'),(105,26,'Leaves may curl, distort, and fall prematurely'),(106,26,'Fruit shows dark, sunken, scabby lesions that can crack'),(107,26,'Severe infections reduce fruit yield and tree vigor'),(108,27,'Purple-brown leaf spots with concentric rings (“frog-eye” lesions)'),(109,27,'Fruit rot begins as small, dark spots, enlarging into firm, black rotted areas'),(110,27,'Cankers form on branches, often girdling them and causing dieback'),(111,28,'Yellow-orange leaf spots on apple in spring'),(112,28,'Fruit may show small, sunken lesions'),(113,28,'On cedar, produces gelatinous orange galls during wet spring weather'),(114,29,'No visible signs of disease or abnormality observed');
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
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
INSERT INTO `treatment` VALUES (1,1,'Apply fungicides like chlorothalonil, mancozeb, copper-based products, or azoxystrobin'),(2,1,'Begin treatments early, especially in humid or wet weather'),(3,1,'Remove and destroy infected plant debris'),(4,1,'Improve air circulation by pruning and staking'),(5,2,'Fungicides with active ingredients like chlorothalonil, mancozeb, or copper'),(6,2,'Begin at first sign of disease and repeat at 7–10 day intervals'),(7,2,'Remove infected leaves and dispose of them far from garden beds'),(8,3,'No cure once infected'),(9,3,'Control whitefly populations with insecticidal soaps, neem oil, or imidacloprid'),(10,3,'Introduce natural predators (e.g., Encarsia formosa, ladybugs)'),(11,4,'Use copper-based bactericides or a combination of copper and mancozeb'),(12,4,'Antibiotics like streptomycin (where permitted) may be used under strict guidelines'),(13,4,'Remove and destroy infected plant parts'),(14,5,'Apply fungicides such as chlorothalonil, mancozeb, or copper-based products'),(15,5,'Remove severely infected foliage'),(16,5,'Reapply fungicides on a regular schedule during humid conditions'),(17,6,'No treatment available for viral infections'),(18,6,'Remove and destroy infected plants'),(19,6,'Disinfect tools and equipment'),(20,7,'Apply fungicides such as chlorothalonil, copper-based products, or mancozeb'),(21,7,'Remove and destroy infected leaves'),(22,7,'Disinfect greenhouses and tools between crops'),(23,8,'Apply insecticidal soaps, neem oil, or horticultural oils'),(24,8,'Use predatory mites (e.g., Phytoseiulus persimilis) as biological control'),(25,8,'Remove heavily infested leaves'),(26,9,'Use fungicides containing copper, sulfur, or mancozeb'),(27,9,'Remove and destroy infected leaves and canes'),(28,9,'Apply fungicides preventively during wet, warm weather'),(29,11,'Apply fungicides like thiophanate-methyl, mancozeb, or copper compounds during the growing season'),(30,11,'Remove and destroy all mummified fruit and infected debris'),(31,11,'Prune out diseased wood during dormancy'),(32,12,'No effective chemical treatment exists'),(33,12,'Remove and destroy infected vines or severely affected wood'),(34,12,'Perform trunk surgery in some cases (removal of diseased wood internally)'),(35,13,'Apply fungicides such as sulfur, potassium bicarbonate, or myclobutanil early in the season and at regular intervals'),(36,13,'Remove and destroy infected shoots and leaves'),(37,13,'Prune trees to increase air circulation'),(38,14,'Apply fungicides like captan or myclobutanil during periods of high humidity'),(39,14,'Remove infected foliage and avoid working with wet plants'),(40,14,'Improve irrigation practices to avoid leaf wetness'),(41,15,'Apply copper-based bactericides or streptomycin (where legally permitted)'),(42,15,'Remove infected plant parts and dispose of them away from the field'),(43,15,'Disinfect tools and equipment between uses'),(44,16,'Plant in well-drained soils and use raised beds with plastic mulch.'),(45,16,'Avoid using surface water for irrigation; opt for drip irrigation systems.'),(46,16,'Rotate crops with non-host species like cereals.'),(47,16,'Remove and destroy infected plants and fruits promptly.'),(48,16,'Sanitize equipment and tools to prevent pathogen spread.'),(49,17,'There is currently no cure for HLB.'),(50,17,'Removal and destruction of infected trees to prevent spread.'),(51,17,'Application of insecticides to control psyllid populations.'),(52,17,'Use of antibiotics and heat treatments are under research but not widely adopted.'),(53,18,'Apply sulfur-based fungicides (use with caution in high temperatures).'),(54,18,'Use neem oil or potassium bicarbonate sprays.'),(55,18,'Homemade remedies like a milk and water mixture (40:60 ratio).'),(56,18,'Use fungicides containing chlorothalonil, myclobutanil, or triflumizole.'),(57,18,'Rotate fungicides to prevent resistance development.'),(58,19,'Apply fungicides preventatively and continue applications at 5- to 7-day intervals during conducive conditions. Effective fungicides include chlorothalonil, mancozeb, and products containing cyazofamid or dimethomorph.'),(59,19,'Remove and destroy infected plants promptly.'),(60,19,'Avoid overhead irrigation to minimize leaf wetness.'),(61,20,'Apply fungicides preventatively, especially during favorable conditions for the disease.'),(62,20,'Effective fungicides include chlorothalonil, mancozeb, azoxystrobin, and copper-based products.'),(63,20,'Rotate fungicides with different modes of action to prevent resistance development.'),(64,20,'Remove and destroy infected plant debris promptly.'),(65,20,'Avoid overhead irrigation to minimize leaf wetness.'),(66,20,'Ensure adequate plant spacing to improve air circulation.'),(67,21,'Fungicides: Application of fungicides may be warranted, especially on susceptible hybrids. Fungicides should be applied during the early stages of the disease.'),(68,22,'Fungicides: Application of fungicides may be warranted, especially on susceptible hybrids. Fungicides should be applied during the early stages of the disease.'),(69,23,'Chemical Control: Application of bactericides, such as copper-based compounds or oxytetracycline, starting at the late dormant stage through shuck split. Care must be taken to avoid phytotoxicity.'),(70,24,'Apply fungicides with active ingredients such as chlorothalonil, mancozeb, or copper-based products at first signs of disease'),(71,24,'In severe cases, systemic fungicides like fluopicolide, cymoxanil, or mandipropamid may be used'),(72,24,'Immediately remove and destroy infected plant material—do not compost'),(73,24,'Monitor crops closely and apply protective sprays during periods of high risk'),(74,25,'Apply fungicides like azoxystrobin, pyraclostrobin, or propiconazole when disease reaches threshold levels'),(75,25,'Monitor regularly to time applications correctly'),(76,26,'Apply fungicides such as myclobutanil, captan, or mancozeb at bud break and during early fruit development'),(77,26,'Prune infected branches and remove fallen debris'),(78,26,'Apply dormant sprays in late winter'),(79,27,'Remove and destroy infected fruit, leaves, and limbs'),(80,27,'Apply fungicides like captan or thiophanate-methyl during the growing season'),(81,27,'Prune cankers during dormancy'),(82,28,'Apply fungicides such as myclobutanil or propiconazole during early bud stages on apple'),(83,28,'Remove cedar hosts within 300–500 feet if possible'),(84,29,'No treatment necessary');
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

-- Dump completed on 2025-05-01 20:49:17
