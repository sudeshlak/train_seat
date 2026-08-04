-- Seed Podi Menike (Colombo Fort -> Ella) for booking tests

INSERT INTO class_types (id, name, created_at, updated_at, deleted_at) VALUES
    (1, '1st class', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (2, '2nd class', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (3, '3rd class', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL);

INSERT INTO stations (id, name, created_at, updated_at, deleted_at) VALUES
    (1,  'Colombo Fort', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (2,  'Maradana', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (3,  'Ragama', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (4,  'Gampaha', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (5,  'Veyangoda', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (6,  'Mirigama', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (7,  'Ambepussa', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (8,  'Polgahawela Junction', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (9,  'Rambukkana', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (10, 'Kadugannawa', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (11, 'Peradeniya Junction', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (12, 'Kandy', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (13, 'Peradeniya', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (14, 'Gampola', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (15, 'Nawalapitiya', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (16, 'Hatton', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (17, 'Talawakele', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (18, 'Great Western', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (19, 'Nanu Oya', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (20, 'Pattipola', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (21, 'Ohiya', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (22, 'Idalgashinna', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (23, 'Haputale', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (24, 'Diyatalawa', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (25, 'Bandarawela', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (26, 'Ella', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL);

INSERT INTO trains (id, name, created_at, updated_at, deleted_at) VALUES
    (1, 'Podi Menike', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL);

INSERT INTO routes (id, departure_time, train_id, created_at, updated_at, deleted_at) VALUES
    (1, '05:55:00', 1, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL);

INSERT INTO stop_orders (id, stop_sequence, route_id, station_id, created_at, updated_at, deleted_at) VALUES
    (1,  1,  1, 1,  CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (2,  2,  1, 2,  CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (3,  3,  1, 3,  CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (4,  4,  1, 4,  CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (5,  5,  1, 5,  CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (6,  6,  1, 6,  CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (7,  7,  1, 7,  CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (8,  8,  1, 8,  CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (9,  9,  1, 9,  CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (10, 10, 1, 10, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (11, 11, 1, 11, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (12, 12, 1, 12, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (13, 13, 1, 13, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (14, 14, 1, 14, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (15, 15, 1, 15, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (16, 16, 1, 16, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (17, 17, 1, 17, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (18, 18, 1, 18, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (19, 19, 1, 19, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (20, 20, 1, 20, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (21, 21, 1, 21, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (22, 22, 1, 22, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (23, 23, 1, 23, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (24, 24, 1, 24, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (25, 25, 1, 25, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (26, 26, 1, 26, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL);

-- Coach 1: 1st class (20 seats); 2–3: 2nd class (50 each); 4–8: 3rd class (50 each)
INSERT INTO coaches (id, coach_number, train_id, class_type_id, created_at, updated_at, deleted_at) VALUES
    (1, 1, 1, 1, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (2, 2, 1, 2, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (3, 3, 1, 2, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (4, 4, 1, 3, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (5, 5, 1, 3, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (6, 6, 1, 3, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (7, 7, 1, 3, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL),
    (8, 8, 1, 3, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL);

-- Seats: coach 1 -> 1..20; coaches 2..8 -> 1..50
INSERT INTO seats (seat_number, coach_id, created_at, updated_at, deleted_at)
WITH RECURSIVE nums AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM nums WHERE n < 50
)
SELECT n, 1, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL
FROM nums
WHERE n <= 20
UNION ALL
SELECT n, c.id, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), NULL
FROM nums
CROSS JOIN coaches c
WHERE c.id BETWEEN 2 AND 8
  AND n <= 50;

-- Fares for every upstream -> downstream pair: 2nd class + 1st class (1.5x)
-- hops = end_sequence - start_sequence
-- 2nd = ROUND(20.50 + (hops - 1) * 103.320833, 2)
INSERT INTO fares (price, route_id, class_type_id, start_station_id, end_station_id, created_at, updated_at, deleted_at)
SELECT
    ROUND(20.50 + (s2.stop_sequence - s1.stop_sequence - 1) * 103.320833, 2) AS price,
    1 AS route_id,
    2 AS class_type_id,
    s1.station_id AS start_station_id,
    s2.station_id AS end_station_id,
    CURRENT_TIMESTAMP(6),
    CURRENT_TIMESTAMP(6),
    NULL
FROM stop_orders s1
JOIN stop_orders s2
  ON s1.route_id = s2.route_id
 AND s1.stop_sequence < s2.stop_sequence
WHERE s1.route_id = 1;

INSERT INTO fares (price, route_id, class_type_id, start_station_id, end_station_id, created_at, updated_at, deleted_at)
SELECT
    ROUND(ROUND(20.50 + (s2.stop_sequence - s1.stop_sequence - 1) * 103.320833, 2) * 1.5, 2) AS price,
    1 AS route_id,
    1 AS class_type_id,
    s1.station_id AS start_station_id,
    s2.station_id AS end_station_id,
    CURRENT_TIMESTAMP(6),
    CURRENT_TIMESTAMP(6),
    NULL
FROM stop_orders s1
JOIN stop_orders s2
  ON s1.route_id = s2.route_id
 AND s1.stop_sequence < s2.stop_sequence
WHERE s1.route_id = 1;

-- Keep AUTO_INCREMENT in sync after explicit ids
ALTER TABLE class_types AUTO_INCREMENT = 4;
ALTER TABLE stations AUTO_INCREMENT = 27;
ALTER TABLE trains AUTO_INCREMENT = 2;
ALTER TABLE routes AUTO_INCREMENT = 2;
ALTER TABLE stop_orders AUTO_INCREMENT = 27;
ALTER TABLE coaches AUTO_INCREMENT = 9;
