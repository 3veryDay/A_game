package com.example.a_interval.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SegmentGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long groupId;

    private int groupOrder;

    private int repeatCount;

    @ManyToOne
    @JoinColumn(name = "interval_id", nullable = false)
    private Interval interval;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<IntervalSegment> segments = new ArrayList<>();
}
