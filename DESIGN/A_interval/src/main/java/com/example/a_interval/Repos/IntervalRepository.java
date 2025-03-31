package com.example.a_interval.Repos;

import com.example.a_interval.Entities.Interval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IntervalRepository extends JpaRepository<Interval, Long> {
    // 필요한 경우, 커스텀 쿼리를 여기에 추가할 수 있어
}
