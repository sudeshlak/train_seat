package com.train_seat.api.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "bookings")
public class Booking extends BaseEntity {

	@ManyToOne(optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private User user;

	@Column(nullable = false)
	private Double amount;

	@Column(nullable = false)
	private String status;

	@Column(name = "travel_date", nullable = false)
	private LocalDate date;

	@ManyToOne(optional = false)
	@JoinColumn(name = "seat_id", nullable = false)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private Seat seat;

	@ManyToOne(optional = false)
	@JoinColumn(name = "from_stop_order_id", nullable = false)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private StopOrder fromStopOrder;

	@ManyToOne(optional = false)
	@JoinColumn(name = "to_stop_order_id", nullable = false)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private StopOrder toStopOrder;
}
