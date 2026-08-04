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
@Table(name = "seats")
public class Seat extends BaseEntity {

	@Column(name = "seat_number", nullable = false)
	private Integer number;

	@ManyToOne(optional = false)
	@JoinColumn(name = "coach_id", nullable = false)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private Coach coach;
}
