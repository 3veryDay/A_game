import axios from 'axios';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInterval } from '../context/IntervalContext';
import styles from './Page5Result.module.css';

const Page5Result = () => {
  const { details, repeatCount } = useInterval();
  const [searchParams] = useSearchParams();
  const startNow = searchParams.get('start') === 'now';

  useEffect(() => {
    if (details.length === 0 || repeatCount === 0) return;

    const saveInterval = async () => {
      const group = {
        groupOrder: 1,
        repeatCount: repeatCount,
        segments: details.map((d, i) => {
          const musicSelectionType = d.musicType ?? 'NONE';
          const musicSourceId = d.music_info ?? null;

          return {
            segmentOrder: i + 1,
            duration: parseFloat(d.duration),
            type: d.type,
            targetSpeed: parseFloat(d.speed),
            musicSelectionType,
            musicSourceId,
          };
        }),
      };

      const requestData = {
        intervalName: 'My Auto Session Interval',
        groups: [group],
      };

      console.log('보내는 데이터:', requestData); // 디버깅용

      try {
        const response = await axios.post('http://localhost:8080/api/intervals', requestData);
        console.log('생성 성공:', response.data);
      } catch (error) {
        console.error('생성 실패:', error);
      }
    };

    saveInterval();
  }, [details, repeatCount]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>러닝 세션 저장 완료</h1>
        <p className={styles.message}>
          {startNow ? '바로 러닝을 시작합니다!' : '세션이 저장되었습니다. 나중에 실행하세요.'}
        </p>
      </div>
    </div>
  );
};

export default Page5Result;
