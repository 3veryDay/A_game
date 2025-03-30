package com.example.a_interval.Repos;

import com.example.a_interval.Entities.RunningSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RunningSessionRepository extends JpaRepository<RunningSession, Long> {
    // 사용자 ID로 세션 찾기 등 커스텀 메서드도 추가 가능
}
