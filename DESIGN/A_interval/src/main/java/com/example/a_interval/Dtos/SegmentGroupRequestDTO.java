package com.example.a_interval.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SegmentGroupRequestDTO {
    private int groupOrder;
    private int repeatCount;
    private List<IntervalSegmentRequestDTO> segments;
}
