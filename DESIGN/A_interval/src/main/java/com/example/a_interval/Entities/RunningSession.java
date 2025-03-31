package com.example.a_interval.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RunningSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    private Long userId;

    private LocalDateTime startedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Interval> intervals = new ArrayList<>();
}
