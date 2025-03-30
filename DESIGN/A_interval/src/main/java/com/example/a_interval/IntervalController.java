package com.example.a_interval;

import com.example.a_interval.Dtos.IntervalRequestDTO;
import com.example.a_interval.Dtos.IntervalResponseDTO;
import com.example.a_interval.Dtos.IntervalSegmentResponseDTO;
import com.example.a_interval.Dtos.SegmentGroupResponseDTO;
import com.example.a_interval.Entities.Interval;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/intervals")
@RequiredArgsConstructor
public class IntervalController {

    private final IntervalService intervalService;

    @PostMapping
    public ResponseEntity<IntervalResponseDTO> createInterval(@RequestBody IntervalRequestDTO request) {
        Interval interval = intervalService.createInterval(request);

        // 그룹 & 세그먼트 포함한 응답 DTO로 변환
        List<SegmentGroupResponseDTO> groupDTOs = interval.getGroups().stream()
                .map(group -> {
                    List<IntervalSegmentResponseDTO> segmentDTOs = group.getSegments().stream()
                            .map(segment -> new IntervalSegmentResponseDTO(
                                    segment.getSegmentOrder(),
                                    segment.getDuration(),
                                    segment.getType(),
                                    segment.getTargetSpeed(),
                                    segment.getMusicSelectionType(),
                                    segment.getMusicSourceId()
                            ))
                            .collect(Collectors.toList());

                    return new SegmentGroupResponseDTO(
                            group.getGroupOrder(),
                            group.getRepeatCount(),
                            segmentDTOs
                    );
                })
                .collect(Collectors.toList());

        IntervalResponseDTO responseDTO = new IntervalResponseDTO(
                interval.getIntervalId(),
                interval.getIntervalName(),
                interval.getTotalIntervalTime(),
                interval.getTotalCalBurned(),
                interval.getLastRun(),
                groupDTOs
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
}

