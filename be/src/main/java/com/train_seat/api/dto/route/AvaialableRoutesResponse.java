package com.train_seat.api.dto.route;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaialableRoutesResponse {
    private List<Long> routes;
    
}
