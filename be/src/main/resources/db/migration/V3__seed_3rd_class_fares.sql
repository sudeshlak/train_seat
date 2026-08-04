-- 3rd class = 70% of matching 2nd-class fare for every stop pair on route 1
INSERT INTO fares (price, route_id, class_type_id, start_station_id, end_station_id, created_at, updated_at, deleted_at)
SELECT
    ROUND(f.price * 0.70, 2) AS price,
    f.route_id,
    3 AS class_type_id,
    f.start_station_id,
    f.end_station_id,
    CURRENT_TIMESTAMP(6),
    CURRENT_TIMESTAMP(6),
    NULL
FROM fares f
WHERE f.route_id = 1
  AND f.class_type_id = 2
  AND f.deleted_at IS NULL;
