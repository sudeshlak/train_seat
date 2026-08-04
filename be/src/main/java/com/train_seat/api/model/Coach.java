package com.train_seat.api.model;

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
@Table(name = "coaches")
public class Coach extends BaseEntity {

	@Column(name = "coach_number", nullable = false)
	private Integer number;

	@Column(name = "online_bookable", nullable = false)
	private boolean onlineBookable;

	@ManyToOne(optional = false)
	@JoinColumn(name = "train_id", nullable = false)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private Train train;

	@ManyToOne(optional = false)
	@JoinColumn(name = "class_type_id", nullable = false)
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private ClassType classType;

	@OneToMany(mappedBy = "coach")
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private List<Seat> seats = new ArrayList<>();
}
