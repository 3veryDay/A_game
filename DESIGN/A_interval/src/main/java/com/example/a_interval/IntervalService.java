package com.example.a_interval;

import com.example.a_interval.Dtos.IntervalRequestDTO;
import com.example.a_interval.Dtos.IntervalSegmentRequestDTO;
import com.example.a_interval.Dtos.SegmentGroupRequestDTO;
import com.example.a_interval.Entities.*;
import com.example.a_interval.Repos.IntervalRepository;
import com.example.a_interval.Repos.RunningSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IntervalService {

    private final IntervalRepository intervalRepository;
    private final RunningSessionRepository runningSessionRepository;

    public Interval createInterval(IntervalRequestDTO dto) {
        // 세션 자동 생성
        RunningSession session = new RunningSession();
        session.setUserId(1L); // <- 나중에 인증 붙이면 현재 로그인된 유저 ID 넣기
        session.setStartedAt(LocalDateTime.now());

        RunningSession savedSession = runningSessionRepository.save(session);
        Interval interval = new Interval();
        interval.setSession(session);
        interval.setIntervalName(dto.getIntervalName());
        interval.setLastRun(LocalDateTime.now());

        List<SegmentGroup> groups = new ArrayList<>();

        for (SegmentGroupRequestDTO groupDTO : dto.getGroups()) {
            SegmentGroup group = new SegmentGroup();
            group.setGroupOrder(groupDTO.getGroupOrder());
            group.setRepeatCount(groupDTO.getRepeatCount());
            group.setInterval(interval);

            List<IntervalSegment> segments = new ArrayList<>();

            for (IntervalSegmentRequestDTO segmentDTO : groupDTO.getSegments()) {
                IntervalSegment segment = new IntervalSegment();
                segment.setSegmentOrder(segmentDTO.getSegmentOrder());
                segment.setDuration(segmentDTO.getDuration());
                segment.setType(segmentDTO.getType());
                segment.setTargetSpeed(segmentDTO.getTargetSpeed());
                segment.setMusicSelectionType(segmentDTO.getMusicSelectionType());
                segment.setMusicSourceId(segmentDTO.getMusicSourceId());
                segment.setGroup(group);

                segments.add(segment);
            }

            group.setSegments(segments);
            groups.add(group);
        }

        interval.setGroups(groups);

        // Optionally calculate totalIntervalTime & totalCalBurned here
        interval.setTotalIntervalTime(calculateTotalTime(groups));
        interval.setTotalCalBurned(null);

        return intervalRepository.save(interval);
    }

    private int calculateTotalTime(List<SegmentGroup> groups) {
        int total = 0;
        for (SegmentGroup group : groups) {
            BigDecimal groupTime = group.getSegments().stream()
                    .map(IntervalSegment::getDuration)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            total += groupTime.multiply(BigDecimal.valueOf(group.getRepeatCount())).intValue();
        }
        return total;
    }

    private BigDecimal calculateCalories(List<SegmentGroup> groups) {
        // You can replace this with a real formula later
        BigDecimal total = BigDecimal.ZERO;
        for (SegmentGroup group : groups) {
            for (IntervalSegment seg : group.getSegments()) {
                BigDecimal factor = seg.getType() == SegmentType.RUN ? BigDecimal.valueOf(10) : BigDecimal.valueOf(5);
                total = total.add(factor.multiply(seg.getDuration()).multiply(BigDecimal.valueOf(group.getRepeatCount())));
            }
        }
        return total.setScale(2, RoundingMode.HALF_UP);
    }
}
