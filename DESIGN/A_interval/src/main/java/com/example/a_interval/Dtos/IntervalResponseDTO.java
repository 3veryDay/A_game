package com.example.a_interval.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IntervalResponseDTO {
    private Long intervalId;
    private String intervalName;
    private Integer totalIntervalTime;
    private BigDecimal totalCalBurned;
    private LocalDateTime lastRun;
    private List<SegmentGroupResponseDTO> groups;
}

