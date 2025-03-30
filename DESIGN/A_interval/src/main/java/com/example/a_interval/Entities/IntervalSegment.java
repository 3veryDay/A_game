package com.example.a_interval.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IntervalSegment {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID segmentId;

    private int segmentOrder;

    //in seconds
    private BigDecimal duration;

    // WALK, RUN, JOG, SPRINT, WARMUP, COOLDOWN
    @Enumerated(EnumType.STRING)
    private SegmentType type;

    //in km/h
    private BigDecimal targetSpeed;

    @Enumerated(EnumType.STRING)
    private MusicSelectionType musicSelectionType;

    private String musicSourceId;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private SegmentGroup group;
}
