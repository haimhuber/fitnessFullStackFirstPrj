------------------------------------------
-- HOW TO DROP DB, 
--  IN CASE YOU WANT TO COMPLETELY DELETE IT
-- 1) JUST DROP IT
use master
GO
DROP DATABASE FitnessClubDB


-- Create a new database called 'PizzaDB'
-- Connect to the 'master' database to run this snippet
USE master
GO

-- Create the new database if it does not exist already
IF NOT EXISTS (
    SELECT [name]
        FROM sys.databases
        WHERE [name] = 'FitnessClubDB'
)
CREATE DATABASE FitnessClubDB;
GO


USE FitnessClubDB;
GO


	/*------------   Create tables   --------------*/
	CREATE TABLE Members (
		id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
		fullName varchar(255) NOT NULL,
		email varchar(255)UNIQUE NOT NULL,
		userName  varchar(255)UNIQUE NOT NULL,
		password   varchar(255) NOT NULL,
		phoneNumber varchar(15) NOT NULL,
		dateOfBirth DATE NOT NULL,
		joinDate DATE DEFAULT GETDATE(),
	);
	
	CREATE TABLE ContactForm (
		id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
		name varchar(255) NOT NULL,
		email varchar(255) NOT NULL,
		subject varchar(255) NOT NULL,
		message varchar(255),
		contactFormCreated DATETIME DEFAULT GETDATE()
	);
	
	CREATE TABLE ContactFormStatus (
		id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
		contactFormId INT NOT NULL,
		status varchar(255) NOT NULL,
		handleBy varchar(255) NOT NULL,
		FOREIGN KEY (contactFormId ) REFERENCES ContactForm(id) ON DELETE CASCADE
	);
	

	CREATE TABLE TrainersDetails
	 (
		id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
		fullName varchar(255) NOT NULL,
		phoneNumber varchar(15) NOT NULL,
		address VARCHAR(255) NOT NULL,
		dateOfBirth DATE NOT NULL,
		height INT NOT NULL,
		weight INT NOT NULL
	);


	CREATE TABLE TrainerSpecialization
	 (
		id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
		trainerId INT,
		specialization VARCHAR(255) NOT NULL,
		startExperienceDate DATE NOT NULL,
		FOREIGN KEY (trainerId) REFERENCES TrainersDetails(id) ON DELETE CASCADE	 
	);


	CREATE TABLE WorkoutPlans
	 (
		id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
		trainerId INT NOT NULL,
		planName varchar(255) NOT NULL,
		description varchar(1000),
		freqPerWeek INT NOT NULL CHECK (freqPerWeek > 0 ) ,
		price DECIMAL(10,2) NOT NULL,
		FOREIGN KEY (trainerId) REFERENCES TrainersDetails(id) ON DELETE CASCADE
	);

	CREATE TABLE RegistrationToWorkoutPlans
	 (
		id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
		memberId INT NOT NULL,
		planId INT NOT NULL,
		startDate DATE DEFAULT GETDATE(),
		FOREIGN KEY (memberId) REFERENCES Members(id) ON DELETE CASCADE,
		FOREIGN KEY (planId) REFERENCES WorkoutPlans(id) ON DELETE CASCADE
	);

	CREATE TABLE PaymentsDetails
	 (
		id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
		registrationId INT NOT NULL,
		amount DECIMAL NOT NULL,
		paymentMethods  VARCHAR(255) NOT NULL check (paymentMethods IN ('Credit Card', 'Paypal', 'Bank Transfer', 'Google Pay', 'Apple Pay')),
		paymentVerification  VARCHAR(255) NOT NULL,
		FOREIGN KEY (registrationId) REFERENCES RegistrationToWorkoutPlans(id) ON DELETE CASCADE
	);

	GO

/* ------------------------ Insert Data into Tables -------------------- */
/* Members Details*/
INSERT INTO Members (fullName, email, userName, password, phoneNumber, dateOfBirth) VALUES
('John Doe', 'john.doe@example.com', 'john_doe', 'password123', '555-0100', '1990-01-01'),
('Jane Smith', 'jane.smith@example.com', 'jane_smith', 'securepass!', '555-0101', '1992-02-14'),
('Mike Jones', 'mike.jones@example.com', 'mike_jones', 'mikepass2024', '555-0102', '1988-04-05'),
('Sarah Lee', 'sarah.lee@example.com', 'sarah_lee', 'sarahSecure99', '555-0103', '1995-06-17'),
('David Brown', 'david.brown@example.com', 'david_brown', 'davidPass@321', '555-0104', '1985-08-23'),
('Linda White', 'linda.white@example.com', 'linda_white', 'linda$pass', '555-0105', '1991-11-30'),
('Robert Clark', 'robert.clark@example.com', 'robert_clark', 'robert!123', '555-0106', '1984-09-11'),
('Emily Hall', 'emily.hall@example.com', 'emily_hall', 'emilyPass789', '555-0107', '1993-03-22'),
('William Evans', 'william.evans@example.com', 'william_evans', 'willSecure321', '555-0108', '1987-07-15'),
('Olivia Martin', 'olivia.martin@example.com', 'olivia_martin', 'oliviaPass999', '555-0109', '1990-12-02'),
('James Taylor', 'james.taylor@example.com', 'james_taylor', 'jamesT@2024', '555-0110', '1989-02-18'),
('Charlotte Wilson', 'charlotte.wilson@example.com', 'charlotte_wilson', 'charlottePass', '555-0111', '1994-05-29'),
('Daniel Thomas', 'daniel.thomas@example.com', 'daniel_thomas', 'daniel!pass', '555-0112', '1986-04-12'),
('Sophia Walker', 'sophia.walker@example.com', 'sophia_walker', 'sophiaPass987', '555-0113', '1992-01-09'),
('Matthew Harris', 'matthew.harris@example.com', 'matthew_harris', 'matthew$123', '555-0114', '1983-10-06'),
('Amelia Robinson', 'amelia.robinson@example.com', 'amelia_robinson', 'ameliaPass111', '555-0115', '1996-07-24'),
('Benjamin King', 'benjamin.king@example.com', 'benjamin_king', 'benjaminPass@555', '555-0116', '1990-03-17'),
('Isabella Scott', 'isabella.scott@example.com', 'isabella_scott', 'isabellaSecure', '555-0117', '1994-12-25'),
('Lucas Adams', 'lucas.adams@example.com', 'lucas_adams', 'lucasPass!456', '555-0118', '1991-01-13'),
('Mia Baker', 'mia.baker@example.com', 'mia_baker', 'miaPass$789', '555-0119', '1992-08-19'),
('Henry Mitchell', 'henry.mitchell@example.com', 'henry_mitchell', 'henrySecurePass', '555-0120', '1987-05-30'),
('Ava Perez', 'ava.perez@example.com', 'ava_perez', 'avaPass@777', '555-0121', '1993-11-04'),
('Ethan Carter', 'ethan.carter@example.com', 'ethan_carter', 'ethanPass333', '555-0122', '1985-02-20'),
('Grace Collins', 'grace.collins@example.com', 'grace_collins', 'gracePass555', '555-0123', '1996-09-10'),
('Alexander Morris', 'alexander.morris@example.com', 'alexander_morris', 'alexanderPass999', '555-0124', '1988-12-14'),
('Ella Cooper', 'ella.cooper@example.com', 'ella_cooper', 'ellaSecure123', '555-0125', '1994-04-03'),
('Samuel Reed', 'samuel.reed@example.com', 'samuel_reed', 'samuel!pass', '555-0126', '1990-06-22'),
('Chloe Bell', 'chloe.bell@example.com', 'chloe_bell', 'chloePass888', '555-0127', '1989-11-17'),
('Jackson Wright', 'jackson.wright@example.com', 'jackson_wright', 'jacksonPass!222', '555-0128', '1991-03-09'),
('Victoria Foster', 'victoria.foster@example.com', 'victoria_foster', 'victoriaPass444', '555-0129', '1992-05-01');



GO

/* TrainersDetails */
INSERT INTO TrainersDetails (fullName, phoneNumber, address, dateOfBirth, height, weight)
VALUES
('John Doe', '555-1234567', '123 Elm St, NY', '1990-05-15', 175, 70),
('Jane Smith', '555-2345678', '456 Maple Ave, CA', '1985-08-22', 160, 55),
('Mike Johnson', '555-3456789', '789 Oak St, TX', '1992-11-10', 180, 80),
('Emily Davis', '555-4567890', '321 Pine St, FL', '1988-04-05', 165, 60),
('Chris Brown', '555-5678901', '654 Cedar Rd, WA', '1995-07-19', 185, 85),
('Olivia Wilson', '555-6789012', '987 Birch Ln, IL', '1993-02-25', 170, 65),
('David Martinez', '555-7890123', '741 Palm Dr, AZ', '1991-09-30', 178, 75),
('Sophia Anderson', '555-8901234', '852 Spruce Ct, NV', '1987-12-18', 168, 58),
('James Taylor', '555-9012345', '369 Cherry St, CO', '1994-06-08', 182, 78),
('Emma Thomas', '555-0123456', '159 Redwood St, OR', '1996-10-21', 163, 57),
('Daniel White', '555-1122334', '357 Aspen Ave, NJ', '1989-03-12', 176, 72),
('Isabella Harris', '555-2233445', '468 Magnolia Blvd, GA', '1997-05-27', 167, 59),
('Ethan Lewis', '555-3344556', '579 Cypress Rd, TN', '1998-08-14', 180, 77),
('Mia Walker', '555-4455667', '680 Fir St, VA', '1990-12-02', 162, 54),
('Alexander Hall', '555-5566778', '791 Alder St, MI', '1993-07-15', 185, 83),
('Charlotte Young', '555-6677889', '892 Beech Ln, OH', '1986-11-09', 169, 61),
('Benjamin King', '555-7788990', '903 Walnut Rd, SC', '1984-01-28', 177, 74),
('Amelia Scott', '555-8899001', '204 Hickory St, PA', '1992-06-16', 164, 56),
('Mason Green', '555-9900112', '315 Poplar Dr, MO', '1995-09-05', 181, 79),
('Harper Baker', '555-1011122', '426 Sycamore Ln, KY', '1999-02-18', 166, 58),
('Logan Carter', '555-1112233', '537 Willow St, MN', '1989-05-07', 179, 76),
('Evelyn Nelson', '555-2223344', '648 Juniper Ave, WI', '1987-10-30', 170, 63),
('Liam Perez', '555-3334455', '759 Elmwood Dr, IN', '1996-03-23', 183, 81),
('Avery Roberts', '555-4445566', '860 Pinecone Rd, OK', '1994-08-12', 161, 55),
('Elijah Adams', '555-5556677', '971 Cedarwood St, LA', '1991-12-29', 174, 71),
('Scarlett Collins', '555-6667788', '182 Birchwood Ct, MA', '1997-04-09', 165, 60),
('Noah Stewart', '555-7778899', '293 Maplewood Ave, NC', '1990-09-17', 178, 73),
('Lily Sanchez', '555-8889900', '404 Oakwood Blvd, UT', '1988-06-20', 169, 62),
('William Murphy', '555-9990011', '515 Redwood Ct, KS', '1993-11-04', 186, 86),
('Sofia Rivera', '555-0001122', '626 Cherrywood St, AL', '1995-07-28', 164, 57);


GO
/* --------------------------------------------------------- */

/* TrainerSpecialization */
INSERT INTO TrainerSpecialization (trainerId, specialization, startExperienceDate) VALUES
(1, 'Strength Training', '2015-06-01'),
(2, 'Cardio Training', '2017-08-15'),
(3, 'Yoga', '2014-03-20'),
(4, 'Pilates', '2016-09-10'),
(5, 'HIIT', '2015-01-25'),
(6, 'Strength Training', '2018-07-05'),
(7, 'CrossFit', '2016-04-18'),
(8, 'Weight Loss Coaching', '2017-05-11'),
(9, 'Mobility Training', '2014-11-02'),
(10, 'Personal Training', '2019-02-01'),
(11, 'Boxing', '2016-10-10'),
(12, 'Strength Training', '2015-12-20'),
(13, 'Yoga', '2018-06-15'),
(14, 'Sports Nutrition', '2017-01-22'),
/* Second */
(1, 'Functional Fitness', '2016-05-10'),
(2, 'Sports Nutrition', '2018-03-12'),
(3, 'Boxing', '2014-08-23'),
(4, 'Cardio Training', '2017-09-17'),
(5, 'Pilates', '2019-04-20'),
(6, 'Weight Loss Coaching', '2015-11-11'),
(7, 'Yoga', '2016-02-19'),
(8, 'Strength Training', '2019-06-01'),
(9, 'HIIT', '2017-07-10'),
(10, 'Personal Training', '2018-08-15'),
(11, 'Boxing', '2015-01-08'),
(12, 'Sports Nutrition', '2017-11-05'),
(13, 'Yoga', '2014-05-25'),
(14, 'Strength Training', '2016-12-01'),
/* Third */
(1, 'CrossFit', '2015-04-01'),
(2, 'Strength Training', '2016-11-23'),
(3, 'HIIT', '2017-05-17'),
(4, 'Mobility Training', '2018-02-05'),
(5, 'Cardio Training', '2019-01-12'),
(6, 'Sports Nutrition', '2015-03-10'),
(7, 'Weight Loss Coaching', '2017-10-04'),
(8, 'Boxing', '2018-08-23'),
(9, 'Yoga', '2016-07-18'),
(10, 'Personal Training', '2015-09-28'),
(11, 'Strength Training', '2014-10-05'),
(12, 'HIIT', '2019-06-07'),
(13, 'Pilates', '2016-02-03'),
(14, 'Mobility Training', '2018-04-21');
GO

/* WorkoutPlans */
INSERT INTO WorkoutPlans (trainerId, planName, description, freqPerWeek, price) VALUES
(1, 'Strength Training Program', 'A comprehensive strength training plan focused on building muscle and increasing strength.', 3, 200.00),
(2, 'Cardio Blast', 'High-intensity cardio workouts designed for fat loss and cardiovascular health.', 5, 150.00),
(3, 'Yoga for Flexibility', 'A yoga program aimed at improving flexibility, mobility, and reducing stress.', 2, 120.00),
(4, 'Pilates for Core Strength', 'Pilates classes designed to strengthen your core and improve posture.', 3, 180.00),
(5, 'HIIT for Weight Loss', 'Intense HIIT workouts for those looking to lose weight and boost their metabolism.', 4, 210.00),
(6, 'Beginner Strength Training', 'A beginner-friendly program to get started with weight training and build basic strength.', 2, 140.00),
(7, 'CrossFit Conditioning', 'CrossFit-inspired program to improve overall fitness, strength, and endurance.', 4, 220.00),
(8, 'Weight Loss and Toning', 'A program focused on weight loss, muscle toning, and overall body sculpting.', 5, 160.00),
(9, 'Mobility and Stretching', 'A plan focused on improving joint mobility and flexibility through stretches and movements.', 2, 110.00),
(10, 'Personal Training Program', 'One-on-one personal training focusing on personalized goals and progress tracking.', 2, 250.00),
(11, 'Boxing for Fitness', 'Boxing-inspired workouts to improve cardiovascular health and upper body strength.', 3, 180.00),
(12, 'Advanced Strength Training', 'An advanced strength training program designed for experienced lifters looking to push their limits.', 3, 250.00),
(13, 'Mindful Yoga', 'A yoga program focusing on mental well-being, mindfulness, and relaxation.', 2, 130.00),
(14, 'Sports Nutrition and Fitness', 'Combines fitness training with expert nutritional guidance for optimal performance.', 3, 200.00),
(1, 'Bodybuilding Program', 'A comprehensive bodybuilding plan focused on muscle hypertrophy and strength gains.', 4, 250.00),
(2, 'Total Body Conditioning', 'A full-body conditioning program to enhance strength, endurance, and flexibility.', 3, 190.00),
(3, 'Power Yoga', 'An intense yoga program combining strength, flexibility, and cardio to improve overall fitness.', 2, 140.00),
(4, 'Rehabilitation Program', 'A program designed for rehabilitation of injuries, focusing on safe exercises for recovery.', 2, 120.00),
(5, 'Advanced HIIT', 'An advanced high-intensity interval training program designed for fat loss and athletic conditioning.', 5, 220.00),
(6, 'Strength Training for Women', 'A strength training program tailored specifically for women looking to build lean muscle and strength.', 3, 180.00),
(7, 'CrossFit for Beginners', 'A CrossFit program designed for beginners looking to improve strength, endurance, and conditioning.', 4, 210.00),
(8, 'Low-Impact Fitness', 'A low-impact fitness program suitable for beginners or those recovering from injury.', 3, 160.00),
(9, 'Athletic Performance Training', 'A performance training program designed to improve athletic skills, speed, and agility.', 4, 230.00),
(10, 'Endurance Training Program', 'A program focusing on improving cardiovascular endurance and stamina through running and cycling.', 3, 190.00),
(11, 'Core Strength and Stability', 'A focused core training plan designed to build core strength, stability, and improve posture.', 3, 150.00),
(12, 'Senior Strength Program', 'A strength training program specifically designed for seniors to maintain muscle and bone health.', 2, 120.00),
(13, 'Sports-Specific Conditioning', 'Conditioning tailored to a specific sport to enhance performance and prevent injuries.', 3, 210.00),
(14, 'Functional Movement Training', 'A functional training program focusing on exercises that mimic everyday movements and improve mobility.', 4, 200.00),
(1, 'Beginner Strength Training', 'A basic plan for beginners focusing on full-body workouts.', 3, 49.99),
(2, 'Fat Loss Program', 'High-intensity interval training to help shed fat quickly.', 4, 59.99),
(3, 'Muscle Gain Blueprint', 'Advanced hypertrophy-focused program for serious lifters.', 5, 79.99),
(4, 'Endurance Boost', 'Designed for improving cardiovascular fitness and stamina.', 4, 54.99),
(1, 'Powerlifting Routine', 'Strength-focused training with progressive overload principles.', 4, 69.99),
(5, 'Bodyweight Mastery', 'Calisthenics-based training for strength and flexibility.', 3, 44.99),
(2, 'Athletic Performance', 'Speed, agility, and strength drills for athletes.', 5, 89.99),
(6, 'Postpartum Fitness', 'A gentle yet effective program for new mothers.', 3, 39.99),
(3, 'Yoga & Flexibility', 'Yoga-based plan for mobility and stress relief.', 3, 34.99),
(4, 'CrossFit Essentials', 'Functional movements with high-intensity training.', 4, 74.99),
(5, 'Home Workout Plan', 'No equipment needed, perfect for home workouts.', 3, 29.99),
(6, 'Senior Fitness', 'Low-impact exercises tailored for older adults.', 3, 39.99),
(11, 'Lean Bulk Program', 'Nutrition and strength-focused plan for lean muscle gain.', 5, 79.99),
(14, 'Boxing Conditioning', 'Boxing-inspired training for endurance and fat loss.', 4, 69.99);
GO


/* Payments */
INSERT INTO RegistrationToWorkoutPlans (memberId, planId)
VALUES
(1, 5), (2, 12), (3, 8), (4, 20), (5, 15),
(6, 3), (7, 7), (8, 10), (9, 25), (10, 30),
(11, 2), (12, 18), (13, 21), (14, 35), (15, 40),
(16, 1), (17, 9), (18, 13), (19, 28), (20, 32),
(21, 6), (22, 14), (23, 22), (24, 37), (25, 39),
(26, 4), (27, 19), (28, 23), (29, 31), (30, 36),
(1, 16), (2, 11), (3, 29), (4, 34), (5, 41),
(6, 17), (7, 24), (8, 26), (9, 38), (10, 33),
(11, 27), (12, 5), (13, 12), (14, 8), (15, 20),
(16, 15), (17, 3), (18, 7), (19, 10), (20, 25),
(21, 30), (22, 2), (23, 18), (24, 21), (25, 35),
(26, 40), (27, 1), (28, 9), (29, 13), (30, 28),
(21, 32), (1, 6), (2, 14), (3, 22), (4, 37),
(5, 39), (6, 4), (7, 19), (8, 23), (9, 31),
(10, 36), (11, 16), (12, 11), (13, 29), (14, 34),
(15, 41), (16, 17), (17, 24), (18, 26), (19, 38),
(20, 33), (21, 27), (22, 5), (23, 12), (24, 8),
(25, 20), (26, 15), (27, 3), (28, 7), (29, 10),
(30, 25), (23, 30), (1, 2), (2, 18), (3, 21),
(4, 35), (5, 40);


GO


/* PaymentsDetails fill the amount!!!! */
INSERT INTO PaymentsDetails (registrationId, amount, paymentMethods, paymentVerification)
VALUES
(1, 49.99, 'Credit Card', 'Verified'),
(2, 59.99, 'Paypal', 'Verified'),
(3, 39.99, 'Bank Transfer', 'Verified'),
(4, 69.99, 'Google Pay', 'Verified'),
(5, 79.99, 'Apple Pay', 'Verified'),
(6, 54.99, 'Credit Card', 'Verified'),
(7, 44.99, 'Paypal', 'Verified'),
(8, 34.99, 'Bank Transfer', 'Verified'),
(9, 74.99, 'Google Pay', 'Verified'),
(10, 29.99, 'Apple Pay', 'Verified'),
(11, 89.99, 'Credit Card', 'Verified'),
(12, 69.99, 'Paypal', 'Verified'),
(13, 39.99, 'Bank Transfer', 'Verified'),
(14, 49.99, 'Google Pay', 'Verified'),
(15, 59.99, 'Apple Pay', 'Verified'),
(16, 34.99, 'Credit Card', 'Verified'),
(17, 74.99, 'Paypal', 'Verified'),
(18, 29.99, 'Bank Transfer', 'Verified'),
(19, 99.99, 'Google Pay', 'Verified'),
(20, 79.99, 'Apple Pay', 'Verified'),
(21, 44.99, 'Credit Card', 'Verified'),
(22, 54.99, 'Paypal', 'Verified'),
(23, 64.99, 'Bank Transfer', 'Verified'),
(24, 49.99, 'Google Pay', 'Verified'),
(25, 59.99, 'Apple Pay', 'Verified'),
(26, 39.99, 'Credit Card', 'Verified'),
(27, 89.99, 'Paypal', 'Verified'),
(28, 69.99, 'Bank Transfer', 'Verified'),
(29, 79.99, 'Google Pay', 'Verified'),
(30, 29.99, 'Apple Pay', 'Verified'),
(31, 49.99, 'Credit Card', 'Verified'),
(32, 34.99, 'Paypal', 'Verified'),
(33, 74.99, 'Bank Transfer', 'Verified'),
(34, 54.99, 'Google Pay', 'Verified'),
(35, 64.99, 'Apple Pay', 'Verified'),
(36, 44.99, 'Credit Card', 'Verified'),
(37, 99.99, 'Paypal', 'Verified'),
(38, 89.99, 'Bank Transfer', 'Verified'),
(39, 79.99, 'Google Pay', 'Verified'),
(40, 69.99, 'Apple Pay', 'Verified'),
(41, 34.99, 'Credit Card', 'Verified'),
(42, 39.99, 'Paypal', 'Verified'),
(43, 49.99, 'Bank Transfer', 'Verified'),
(44, 54.99, 'Google Pay', 'Verified'),
(45, 29.99, 'Apple Pay', 'Verified'),
(46, 59.99, 'Credit Card', 'Verified'),
(47, 64.99, 'Paypal', 'Verified'),
(48, 44.99, 'Bank Transfer', 'Verified'),
(49, 79.99, 'Google Pay', 'Verified'),
(50, 99.99, 'Apple Pay', 'Verified'),
(51, 89.99, 'Credit Card', 'Verified'),
(52, 69.99, 'Paypal', 'Verified'),
(53, 39.99, 'Bank Transfer', 'Verified'),
(54, 49.99, 'Google Pay', 'Verified'),
(55, 29.99, 'Apple Pay', 'Verified'),
(56, 54.99, 'Credit Card', 'Verified'),
(57, 79.99, 'Paypal', 'Verified'),
(58, 44.99, 'Bank Transfer', 'Verified'),
(59, 64.99, 'Google Pay', 'Verified'),
(60, 59.99, 'Apple Pay', 'Verified'),
(61, 34.99, 'Credit Card', 'Verified'),
(62, 74.99, 'Paypal', 'Verified'),
(63, 99.99, 'Bank Transfer', 'Verified'),
(64, 69.99, 'Google Pay', 'Verified'),
(65, 49.99, 'Apple Pay', 'Verified'),
(66, 89.99, 'Credit Card', 'Verified'),
(67, 39.99, 'Paypal', 'Verified'),
(68, 54.99, 'Bank Transfer', 'Verified'),
(69, 64.99, 'Google Pay', 'Verified'),
(70, 29.99, 'Apple Pay', 'Verified'),
(71, 79.99, 'Credit Card', 'Verified'),
(72, 44.99, 'Paypal', 'Verified'),
(73, 49.99, 'Bank Transfer', 'Verified'),
(74, 74.99, 'Google Pay', 'Verified'),
(75, 34.99, 'Apple Pay', 'Verified'),
(76, 89.99, 'Credit Card', 'Verified'),
(77, 99.99, 'Paypal', 'Verified'),
(78, 39.99, 'Bank Transfer', 'Verified'),
(79, 69.99, 'Google Pay', 'Verified'),
(80, 59.99, 'Apple Pay', 'Verified'),
(81, 54.99, 'Credit Card', 'Verified'),
(82, 44.99, 'Paypal', 'Verified'),
(83, 74.99, 'Bank Transfer', 'Verified'),
(84, 79.99, 'Google Pay', 'Verified'),
(85, 64.99, 'Apple Pay', 'Verified'),
(86, 49.99, 'Credit Card', 'Verified'),
(87, 89.99, 'Paypal', 'Verified'),
(88, 29.99, 'Bank Transfer', 'Verified'),
(89, 99.99, 'Google Pay', 'Verified'),
(90, 39.99, 'Apple Pay', 'Verified'),
(91, 59.99, 'Credit Card', 'Verified'),
(92, 69.99, 'Paypal', 'Verified'),
(93, 44.99, 'Bank Transfer', 'Verified'),
(94, 34.99, 'Google Pay', 'Verified'),
(95, 54.99, 'Apple Pay', 'Verified'),
(96, 79.99, 'Credit Card', 'Verified')

GO

/* Stored Procedure */
-- Procedure 1 - Update user using PATCH
CREATE OR ALTER PROCEDURE [dbo].[spUpdateUser]
@userId INT,
@fullName VARCHAR(255),
@email VARCHAR(255),
@phoneNumber VARCHAR(15),
@dateOfBirth DATE
AS	
BEGIN
    UPDATE Members 
    SET 
        fullName = @fullName,
        email = @email,
        phoneNumber = @phoneNumber,
        dateOfBirth = @dateOfBirth
    WHERE id = @userId;

END
GO

-- Procedure 2 - Check is user email exist
CREATE OR ALTER PROCEDURE [dbo].[spIsUserExist]
@email VARCHAR(255)
AS	
BEGIN
    SELECT email, password
    FROM Members 
    WHERE email = @email;

END
GO
-- Procedure 3 - Check Which member pays the most
CREATE OR ALTER PROCEDURE [dbo].[spWhichMemberPaysTheMost]
AS
BEGIN

    SELECT memberId, SUM(WorkoutPlans.price) AS TotalAmountPaid
    FROM RegistrationToWorkoutPlans
    JOIN WorkoutPlans ON RegistrationToWorkoutPlans.planId = WorkoutPlans.id
    GROUP BY memberId
    ORDER BY TotalAmountPaid DESC;  -- Order by the total amount paid (highest first)
END
GO


-- הרצת ה-Stored Procedure
EXEC spWhichMemberPaysTheMost
GO
 

-- Procedure 4 - Check which trainer have start experience from given date
CREATE OR ALTER PROCEDURE [dbo].[spWhichTrainerHaveExperienceFronGivenDate]
@StartDate DATE
AS
BEGIN
   
    SELECT TrainersDetails.fullName as [Trainer Name], TrainerSpecialization.specialization [Trainer specialization]
    FROM TrainersDetails
    JOIN TrainerSpecialization ON TrainersDetails.id = TrainerSpecialization.trainerId
	where TrainerSpecialization.startExperienceDate >= @StartDate
	ORDER BY TrainerSpecialization.startExperienceDate;
END
GO


-- הרצת ה-Stored Procedure
EXEC spWhichTrainerHaveExperienceFronGivenDate '2016-05-10'
GO


-- Procedure 5 - Check which Trainer is youngest\oldest by LookFor 
CREATE OR ALTER PROCEDURE [dbo].[spWhichTrainerByLookFor]
@LookFor VARCHAR(50)
AS
BEGIN

    if @LookFor = 'Youngest'
	begin 
		SELECT top 1 *
		from TrainersDetails
		order by TrainersDetails.dateOfBirth DESC
	end
	else if @LookFor = 'Oldest'
	begin 
		SELECT top 1 *
		from TrainersDetails
		order by TrainersDetails.dateOfBirth ASC
	end
END
GO

 
-- הרצת ה-Stored Procedure
EXEC spWhichTrainerByLookFor 'Youngest'
GO


-- Procedure 6 - Check which How many pays with given method 
CREATE OR ALTER PROCEDURE [dbo].[spMethodPayByInput]
@MathodPay VARCHAR(50)
AS
BEGIN

    SELECT *
	FROM Members
	join RegistrationToWorkoutPlans on Members.id = RegistrationToWorkoutPlans.memberId
	join PaymentsDetails on RegistrationToWorkoutPlans.id = PaymentsDetails.registrationId
	where PaymentsDetails.paymentMethods like '%' + @MathodPay + '%';
END
GO
-- הרצת ה-Stored Procedure
EXEC spMethodPayByInput 'Paypal'
GO



-- Procedure 7 - Payment Checks 
CREATE OR ALTER PROCEDURE [dbo].[spPaymentsCheck]
AS
BEGIN
	select Members.fullName as [Member Name], count(RegistrationToWorkoutPlans.planId) as [Registered workout], sum(WorkoutPlans.price) as [Total Plans Price], sum(PaymentsDetails.amount) as [Total Amount Pay], (sum(WorkoutPlans.price) - sum(PaymentsDetails.amount)) as [Not yet paid]
		from Members
			join RegistrationToWorkoutPlans on Members.id = RegistrationToWorkoutPlans.memberId
			join WorkoutPlans on RegistrationToWorkoutPlans.planId = WorkoutPlans.id
			join PaymentsDetails on RegistrationToWorkoutPlans.id = PaymentsDetails.registrationId
	group by Members.fullName
	order by [Not yet paid] DESC
END
GO
-- הרצת ה-Stored Procedure
EXEC spPaymentsCheck
GO



-- Procedure 8 - Return the total profit ot the club
CREATE OR ALTER PROCEDURE [dbo].[spTotalProfit]
@totalProfit DECIMAL(10,2) OUTPUT
AS
BEGIN
DECLARE @i int 
DECLARE @profitSum DECIMAL(10,2)

select @profitSum = sum(PaymentsDetails.amount)
from PaymentsDetails
set  @totalProfit = @profitSum
select @totalProfit as [Total Club Profit]
END
GO
-- הרצת ה-Stored Procedure
DECLARE @profitSummirng DECIMAL(10,2)
EXEC spTotalProfit
@totalProfit = @profitSummirng OUTPUT
GO



-- Procedure 9 - Return Who is older than given number
CREATE OR ALTER PROCEDURE [dbo].[spCheckIfAgeIsInGivenNumber]
@ageToCheck INT,
@totalMembers INT OUTPUT
AS
BEGIN
DECLARE @TempTotalMembers INT = 0
	select @TempTotalMembers = count(*)
	from Members
		WHERE DATEDIFF(YEAR, Members.dateOfBirth, GETDATE()) > @ageToCheck	
	set @totalMembers = @TempTotalMembers
	select @totalMembers as [Total Member older than 18] 
END
GO
-- הרצת ה-Stored Procedure
DECLARE @totalMembers INT;
EXEC spCheckIfAgeIsInGivenNumber 18, @totalMembers OUTPUT;
GO


-- Procedure 10 - Trainers AVG - Age, height & weight
CREATE OR ALTER PROCEDURE [dbo].[spTrainersAvgParameters]
AS
BEGIN
	declare @RowCount int;
	select @RowCount = Count(*) from TrainersDetails;
	select sum(DATEDIFF(YEAR, TrainersDetails.dateOfBirth, GETDATE()))/NULLIF(@RowCount,0) as [Trainers avg age],
	   sum(TrainersDetails.height / NULLIF(@RowCount,0)) as [Trainers avg height],
	   sum(TrainersDetails.weight / NULLIF(@RowCount,0)) as [Trainers avg weight]
	from TrainersDetails
END
GO
-- הרצת ה-Stored Procedure
EXEC spCheckIfAgeIsInGivenNumber
GO