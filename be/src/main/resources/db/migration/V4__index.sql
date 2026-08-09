CREATE INDEX idx_bookings_seat_date
  ON bookings (travel_date, seat_id);

CREATE UNIQUE INDEX uk_fares_lookup
  ON fares (route_id, class_type_id, start_station_id, end_station_id);
  
CREATE INDEX idx_coaches_train_online
  ON coaches (train_id, online_bookable);
