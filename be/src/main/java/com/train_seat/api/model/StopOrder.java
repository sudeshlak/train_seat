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
@Table(name = "stop_orders")
public class StopOrder extends BaseEntity {

	@Column(name = "stop_sequence", nullable = false)
	private Integer stopSequence;

	@ManyToOne(optional = false)
	@JoinColumn(name = "route_id", nullable = false)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private Route route;

	@ManyToOne(optional = false)
	@JoinColumn(name = "station_id", nullable = false)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private Station station;
}
