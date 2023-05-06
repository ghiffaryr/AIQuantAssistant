/*
SQLyog Ultimate v13.1.1 (32 bit)
MySQL - 8.0.32 : Database - ai_store
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`ai_store` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `ai_store`;

/*Table structure for table `cart` */

DROP TABLE IF EXISTS `cart`;

CREATE TABLE `cart` (
  `cart_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `FKl70asp4l4w0jmbm1tqyofho4o` (`user_id`),
  CONSTRAINT `FKl70asp4l4w0jmbm1tqyofho4o` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `cart` */

insert  into `cart`(`cart_id`,`user_id`) values 
(26,1),
(21,2);

/*Table structure for table `hibernate_sequence` */

DROP TABLE IF EXISTS `hibernate_sequence`;

CREATE TABLE `hibernate_sequence` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `hibernate_sequence` */

insert  into `hibernate_sequence`(`next_val`) values 
(30);

/*Table structure for table `order_detail` */

DROP TABLE IF EXISTS `order_detail`;

CREATE TABLE `order_detail` (
  `order_detail_id` bigint NOT NULL,
  `product_code` varchar(255) DEFAULT NULL,
  `product_price` decimal(19,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `cart_id` bigint DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  PRIMARY KEY (`order_detail_id`),
  KEY `FK1ntpvbsdhh3gx12a3vu0ft6ts` (`cart_id`),
  KEY `FKaj8p1et8vobyscl6vv7adoxr9` (`order_id`),
  CONSTRAINT `FK1ntpvbsdhh3gx12a3vu0ft6ts` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`),
  CONSTRAINT `FKaj8p1et8vobyscl6vv7adoxr9` FOREIGN KEY (`order_id`) REFERENCES `order_main` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `order_detail` */

insert  into `order_detail`(`order_detail_id`,`product_code`,`product_price`,`quantity`,`cart_id`,`order_id`) values 
(20,'autots3m',20.00,1,NULL,25),
(22,'facebookprophet1m',6.00,2,NULL,25),
(23,'neuralprophet1m',6.00,1,NULL,25),
(24,'autots12m',70.00,1,NULL,25);

/*Table structure for table `order_main` */

DROP TABLE IF EXISTS `order_main`;

CREATE TABLE `order_main` (
  `order_id` bigint NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `order_amount` decimal(19,2) DEFAULT NULL,
  `order_status` int DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `order_main` */

insert  into `order_main`(`order_id`,`create_time`,`order_amount`,`order_status`,`update_time`,`user_email`) values 
(25,'2023-05-01 16:26:20',108.00,1,'2023-05-02 02:24:07','customer@domain.com');

/*Table structure for table `product` */

DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `product_id` bigint NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `product_category_code` varchar(255) DEFAULT NULL,
  `product_code` varchar(255) DEFAULT NULL,
  `product_description` varchar(255) DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `product_period` int DEFAULT NULL,
  `product_price` decimal(19,2) DEFAULT NULL,
  `product_status` int DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `product` */

insert  into `product`(`product_id`,`create_time`,`product_category_code`,`product_code`,`product_description`,`product_image`,`product_name`,`product_period`,`product_price`,`product_status`,`update_time`) values 
(8,'2023-04-28 13:44:25','autots','autots1m','High performance AI quant assistant backed by ensemble method','https://raw.githubusercontent.com/winedarksea/AutoTS/master/img/autots_1280.png','Stock Market AI Assistant 1 Month Subscription',1,21.00,0,'2023-05-01 12:11:12'),
(9,'2023-04-28 13:50:11','autots','autots3m','High performance AI quant assistant backed by ensemble method','https://raw.githubusercontent.com/winedarksea/AutoTS/master/img/autots_1280.png','Stock Market AI Assistant 3 Month Subscription',3,20.00,1,'2023-04-28 13:50:11'),
(10,'2023-04-28 13:50:46','autots','autots6m','High performance AI quant assistant backed by ensemble method','https://raw.githubusercontent.com/winedarksea/AutoTS/master/img/autots_1280.png','Stock Market AI Assistant 6 Month Subscription',6,37.00,1,'2023-04-28 13:50:46'),
(11,'2023-04-28 13:54:02','facebookprophet','facebookprophet1m','High performance AI quant assistant backed by facebook regression model','https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg','Stock Market AI Assistant 1 Month Subscription',1,6.00,1,'2023-04-28 13:54:02'),
(12,'2023-04-28 13:54:40','facebookprophet','facebookprophet3m','High performance AI quant assistant backed by facebook regression model','https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg','Stock Market AI Assistant 3 Month Subscription',3,17.00,1,'2023-04-28 13:54:40'),
(13,'2023-04-28 13:55:29','facebookprophet','facebookprophet6m','High performance AI quant assistant backed by facebook regression model','https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg','Stock Market AI Assistant 6 Month Subscription',6,31.00,1,'2023-04-28 13:55:29'),
(14,'2023-04-28 14:01:47','neuralprophet','neuralprophet1m','High performance AI quant assistant backed by AR-Net','https://user-images.githubusercontent.com/21246060/111388960-6c367e80-866d-11eb-91c1-46f2c0d21879.PNG','Stock Market AI Assistant 1 Month Subscription',1,6.00,1,'2023-04-28 14:01:47'),
(15,'2023-04-28 14:02:09','neuralprophet','neuralprophet3m','High performance AI quant assistant backed by AR-Net','https://user-images.githubusercontent.com/21246060/111388960-6c367e80-866d-11eb-91c1-46f2c0d21879.PNG','Stock Market AI Assistant 3 Month Subscription',3,17.00,1,'2023-04-28 14:02:09'),
(16,'2023-04-28 14:02:26','neuralprophet','neuralprophet6m','High performance AI quant assistant backed by AR-Net','https://user-images.githubusercontent.com/21246060/111388960-6c367e80-866d-11eb-91c1-46f2c0d21879.PNG','Stock Market AI Assistant 6 Month Subscription',6,31.00,1,'2023-04-28 14:02:26'),
(17,'2023-04-28 14:39:45','autots','autots12m','High performance AI quant assistant backed by ensemble method','https://raw.githubusercontent.com/winedarksea/AutoTS/master/img/autots_1280.png','Stock Market AI Assistant 12 Month Subscription',12,70.00,1,'2023-05-01 12:11:31'),
(18,'2023-04-28 14:40:24','facebookprophet','facebookprophet12m','High performance AI quant assistant backed by facebook regression model','https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg','Stock Market AI Assistant 12 Month Subscription',12,60.00,0,'2023-04-28 14:40:24'),
(19,'2023-04-28 14:41:35','neuralprophet','neuralprophet12m','High performance AI quant assistant backed by AR-Net','https://user-images.githubusercontent.com/21246060/111388960-6c367e80-866d-11eb-91c1-46f2c0d21879.PNG','Stock Market AI Assistant 12 Month Subscription',12,60.00,0,'2023-04-28 14:39:45');

/*Table structure for table `product_category` */

DROP TABLE IF EXISTS `product_category`;

CREATE TABLE `product_category` (
  `product_category_id` bigint NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `product_category_code` varchar(255) DEFAULT NULL,
  `product_category_description` varchar(255) DEFAULT NULL,
  `product_category_image` varchar(255) DEFAULT NULL,
  `product_category_name` varchar(255) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`product_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `product_category` */

insert  into `product_category`(`product_category_id`,`create_time`,`product_category_code`,`product_category_description`,`product_category_image`,`product_category_name`,`update_time`) values 
(5,'2023-04-28 13:18:42','autots','AutoTS Algorithm','https://raw.githubusercontent.com/winedarksea/AutoTS/master/img/autots_1280.png','AutoTS','2023-05-01 11:30:38'),
(6,'2023-04-28 13:20:13','facebookprophet','Facebook Prophet Algorithm','https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg','Facebook Prophet','2023-04-28 13:20:13'),
(7,'2023-04-28 13:22:15','neuralprophet','Neural Prophet Algorithm','https://user-images.githubusercontent.com/21246060/111388960-6c367e80-866d-11eb-91c1-46f2c0d21879.PNG','Neural Prophet','2023-04-28 13:22:15');

/*Table structure for table `subscription` */

DROP TABLE IF EXISTS `subscription`;

CREATE TABLE `subscription` (
  `subscription_id` bigint NOT NULL,
  `exp_time` datetime DEFAULT NULL,
  `product_category_code` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`subscription_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `subscription` */

insert  into `subscription`(`subscription_id`,`exp_time`,`product_category_code`,`user_email`) values 
(27,'2023-07-02 02:24:06','facebookprophet','customer@domain.com'),
(28,'2023-11-02 02:36:53','autots','customer@domain.com'),
(29,'2023-06-02 02:24:07','neuralprophet','customer@domain.com');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` bigint NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `birthdate` datetime DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` bit(1) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `recovery_phrase` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `user` */

insert  into `user`(`id`,`active`,`address`,`birthdate`,`create_time`,`email`,`gender`,`image`,`name`,`password`,`phone`,`recovery_phrase`,`role`,`update_time`) values 
(1,'','New World','2023-04-27 09:35:45','2023-04-28 13:00:40','ghiffaryr@domain.com','','https://upload.wikimedia.org/wikipedia/id/5/5c/Spongebob-squarepants.png','Ghiffary Rifqialdi','$2a$10$Ur60PKRH8Qxpy8XMgw9/ee1A8dUh3CtF5TAl8jjUytjIfO6PMWtli','+628999999999','what zit tooya','ROLE_CUSTOMER','2023-05-01 11:25:18'),
(2,'',NULL,NULL,'2023-04-28 13:01:00','customer@domain.com',NULL,NULL,'Real Customer','$2a$10$Q9ImyIHm0erCwE3dkHOUXeJxitweUWAFxHrjIrzGW1zYynDeIXX6i',NULL,'what zit tooya','ROLE_CUSTOMER','2023-04-28 13:01:00'),
(3,'',NULL,NULL,'2023-04-28 13:01:09','employee@domain.com',NULL,NULL,'Real Employee','$2a$10$UQdoVXowcZsnUnD.OmnPW.WOGSh1GxfM/h7ZvPzwaF99cqEpSUGge',NULL,'what zit tooya','ROLE_EMPLOYEE','2023-04-28 13:01:09'),
(4,'',NULL,NULL,'2023-04-28 13:01:14','manager@domain.com',NULL,NULL,'Real Manager','$2a$10$PInEh3xY7xQDl6yv38ZTr.rgnrbiodGcz9Vf59RgAPN8QdEIvSji.',NULL,'what zit tooya','ROLE_MANAGER','2023-04-28 13:01:14');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
