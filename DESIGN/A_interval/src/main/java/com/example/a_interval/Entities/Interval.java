package com.example.a_interval.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Interval {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long intervalId;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private RunningSession session;

    private String intervalName;

    private Integer totalIntervalTime; // in minutes

    private BigDecimal totalCalBurned;

    private LocalDateTime lastRun = LocalDateTime.now();

    @OneToMany(mappedBy = "interval", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SegmentGroup> groups = new ArrayList<>();
}