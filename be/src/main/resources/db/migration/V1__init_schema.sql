CREATE TABLE users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_name     VARCHAR(255) NOT NULL,
    password      VARCHAR(255) NOT NULL,
    created_at    DATETIME(6)  NOT NULL,
    updated_at    DATETIME(6)  NOT NULL,
    deleted_at    DATETIME(6)  NULL,
    CONSTRAINT uk_users_user_name UNIQUE (user_name)
);

CREATE TABLE stations (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    created_at    DATETIME(6)  NOT NULL,
    updated_at    DATETIME(6)  NOT NULL,
    deleted_at    DATETIME(6)  NULL,
    CONSTRAINT uk_stations_name UNIQUE (name)
);

CREATE TABLE class_types (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    created_at    DATETIME(6)  NOT NULL,
    updated_at    DATETIME(6)  NOT NULL,
    deleted_at    DATETIME(6)  NULL,
    CONSTRAINT uk_class_types_name UNIQUE (name)
);

CREATE TABLE trains (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    created_at    DATETIME(6)  NOT NULL,
    updated_at    DATETIME(6)  NOT NULL,
    deleted_at    DATETIME(6)  NULL,
    CONSTRAINT uk_trains_name UNIQUE (name)
);

CREATE TABLE routes (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    departure_time   TIME         NOT NULL,
    train_id         BIGINT       NOT NULL,
    created_at       DATETIME(6)  NOT NULL,
    updated_at       DATETIME(6)  NOT NULL,
    deleted_at       DATETIME(6)  NULL,
    CONSTRAINT fk_routes_train FOREIGN KEY (train_id) REFERENCES trains (id)
);

CREATE TABLE coaches (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    coach_number     INT          NOT NULL,
    train_id         BIGINT       NOT NULL,
    class_type_id    BIGINT       NOT NULL,
    online_bookable  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at       DATETIME(6)  NOT NULL,
    updated_at       DATETIME(6)  NOT NULL,
    deleted_at       DATETIME(6)  NULL,
    CONSTRAINT fk_coaches_train FOREIGN KEY (train_id) REFERENCES trains (id),
    CONSTRAINT fk_coaches_class_type FOREIGN KEY (class_type_id) REFERENCES class_types (id)
);

CREATE TABLE seats (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    seat_number   INT          NOT NULL,
    coach_id      BIGINT       NOT NULL,
    created_at    DATETIME(6)  NOT NULL,
    updated_at    DATETIME(6)  NOT NULL,
    deleted_at    DATETIME(6)  NULL,
    CONSTRAINT fk_seats_coach FOREIGN KEY (coach_id) REFERENCES coaches (id)
);

CREATE TABLE stop_orders (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    stop_sequence   INT          NOT NULL,
    route_id        BIGINT       NOT NULL,
    station_id      BIGINT       NOT NULL,
    created_at      DATETIME(6)  NOT NULL,
    updated_at      DATETIME(6)  NOT NULL,
    deleted_at      DATETIME(6)  NULL,
    CONSTRAINT fk_stop_orders_route FOREIGN KEY (route_id) REFERENCES routes (id),
    CONSTRAINT fk_stop_orders_station FOREIGN KEY (station_id) REFERENCES stations (id)
);

CREATE TABLE fares (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    price              DOUBLE       NOT NULL,
    route_id           BIGINT       NOT NULL,
    class_type_id      BIGINT       NOT NULL,
    start_station_id   BIGINT       NOT NULL,
    end_station_id     BIGINT       NOT NULL,
    created_at         DATETIME(6)  NOT NULL,
    updated_at         DATETIME(6)  NOT NULL,
    deleted_at         DATETIME(6)  NULL,
    CONSTRAINT fk_fares_route FOREIGN KEY (route_id) REFERENCES routes (id),
    CONSTRAINT fk_fares_class_type FOREIGN KEY (class_type_id) REFERENCES class_types (id),
    CONSTRAINT fk_fares_start_station FOREIGN KEY (start_station_id) REFERENCES stations (id),
    CONSTRAINT fk_fares_end_station FOREIGN KEY (end_station_id) REFERENCES stations (id)
);

CREATE TABLE bookings (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id              BIGINT       NOT NULL,
    amount               DOUBLE       NOT NULL,
    status               VARCHAR(255) NOT NULL,
    travel_date          DATE         NOT NULL,
    seat_id              BIGINT       NOT NULL,
    from_stop_order_id   BIGINT       NOT NULL,
    to_stop_order_id     BIGINT       NOT NULL,
    created_at           DATETIME(6)  NOT NULL,
    updated_at           DATETIME(6)  NOT NULL,
    deleted_at           DATETIME(6)  NULL,
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_bookings_seat FOREIGN KEY (seat_id) REFERENCES seats (id),
    CONSTRAINT fk_bookings_from_stop FOREIGN KEY (from_stop_order_id) REFERENCES stop_orders (id),
    CONSTRAINT fk_bookings_to_stop FOREIGN KEY (to_stop_order_id) REFERENCES stop_orders (id)
);
