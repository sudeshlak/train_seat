package com.train_seat.api.model;

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
@Table(name = "fares")
public class Fare extends BaseEntity {

	@Column(nullable = false)
	private Double price;

	@ManyToOne(optional = false)
	@JoinColumn(name = "route_id", nullable = false)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private Route route;

	@ManyToOne(optional = false)
	@JoinColumn(name = "class_type_id", nullable = false)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private ClassType classType;

	@ManyToOne(optional = false)
	@JoinColumn(name = "start_station_id", nullable = false)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private Station startStation;

	@ManyToOne(optional = false)
	@JoinColumn(name = "end_station_id", nullable = false)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private Station endStation;
}
