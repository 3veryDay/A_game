package com.example.a_interval.Dtos;


import com.example.a_interval.Entities.MusicSelectionType;
import com.example.a_interval.Entities.SegmentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IntervalSegmentRequestDTO {
    private int segmentOrder;

    private BigDecimal duration;
    private SegmentType type;
    private BigDecimal targetSpeed;
    private MusicSelectionType musicSelectionType;
    private String musicSourceId;
}