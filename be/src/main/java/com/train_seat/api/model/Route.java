package com.train_seat.api.model;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "routes")
public class Route extends BaseEntity {

	@Column(name = "departure_time", nullable = false)
	private LocalTime time;

	@ManyToOne(optional = false)
	@JoinColumn(name = "train_id", nullable = false)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private Train train;

	@OneToMany(mappedBy = "route")
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private List<StopOrder> stopOrders = new ArrayList<>();
}
