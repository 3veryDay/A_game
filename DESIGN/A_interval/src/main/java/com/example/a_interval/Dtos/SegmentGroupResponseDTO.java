package com.example.a_interval.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SegmentGroupResponseDTO {
    private int groupOrder;
    private int repeatCount;
    private List<IntervalSegmentResponseDTO> segments;
}
