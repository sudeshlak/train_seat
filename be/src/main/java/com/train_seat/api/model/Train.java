package com.train_seat.api.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "trains")
public class Train extends BaseEntity {

	@Column(nullable = false, unique = true)
	private String name;

	@OneToMany(mappedBy = "train")
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private List<Coach> coaches = new ArrayList<>();

	@OneToMany(mappedBy = "train")
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private List<Route> routes = new ArrayList<>();
}
