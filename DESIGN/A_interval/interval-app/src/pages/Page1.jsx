// src/pages/Page1.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterval } from '../context/IntervalContext';
import styles from './Page1.module.css';

const Page1 = () => {
  const navigate = useNavigate();
  const { setPattern } = useInterval();
  const [count, setCount] = useState(3);

  const handleNext = () => {
    const emptyPattern = Array(count).fill('').map(() => ({ duration: '' }));
    setPattern(emptyPattern);
    navigate('/setup-pattern');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>몇 개의 패턴을 만들까요?</h1>
        <input
          className={styles.input}
          type="number"
          min={1}
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value))}
          placeholder="패턴 개수 입력"
        />
        <button className={styles.button} onClick={handleNext}>
          다음으로
        </button>
      </div>
    </div>
  );
};

export default Page1;
