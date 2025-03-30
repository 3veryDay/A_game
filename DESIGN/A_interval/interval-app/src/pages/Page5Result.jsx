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
    const saveInterval = async () => {
      const group = {
        groupOrder: 1,
        repeatCount: repeatCount,
        segments: details.map((d, i) => ({
          segmentOrder: i + 1,
          duration: d.duration,
          type: d.type,
          targetSpeed: parseFloat(d.speed),
          musicSelectionType: d.music.includes('playlist') ? 'PLAYLIST' : 'GENRE',
          musicSourceId: d.music,
        })),
      };

      const requestData = {
        intervalName: '사용자 지정 러닝',
        groups: [group],
      };

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
