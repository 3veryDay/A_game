import { useNavigate } from 'react-router-dom';
import { useInterval } from '../context/IntervalContext';
import styles from './Page4Summary.module.css';


// 여기서 이름 설정 
const Page4Summary = () => {
  const { details, repeatCount } = useInterval();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>세션 요약</h1>
        <p className={styles.subtitle}>총 반복 횟수: {repeatCount}회</p>
        {details.map((d, idx) => (
          <div key={idx} className={styles.segment}>
            <p>{d.duration}분 | 속도: {d.speed}km/h | 타입: {d.type}</p>
            <p>음악: {d.music}</p>
          </div>
        ))}
        <div className={styles.buttonGroup}>
          <button
            onClick={() => navigate('/result?start=now')}
            className={`${styles.button} ${styles.green}`}
          >
            저장하고 바로 시작!
          </button>
          <button
            onClick={() => navigate('/result?start=later')}
            className={`${styles.button} ${styles.gray}`}
          >
            나중에 시작
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page4Summary;
