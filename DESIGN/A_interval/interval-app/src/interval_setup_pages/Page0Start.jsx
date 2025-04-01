// src/pages/Page1Start.jsx
import { useNavigate } from 'react-router-dom';
import styles from './Page0Start.module.css';

const Page1Start = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>인터벌 러닝 세션</h1>
        <p className={styles.subtitle}>당신만의 맞춤 러닝을 지금 시작해보세요.</p>
        <button
          onClick={() => navigate('/setup-pattern')}
          className={styles.button}
        >
          시작하기
        </button>
      </div>
    </div>
  );
};

export default Page1Start;
