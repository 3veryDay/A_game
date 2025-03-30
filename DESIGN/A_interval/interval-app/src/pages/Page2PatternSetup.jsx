// src/pages/Page2PatternSetup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterval } from '../context/IntervalContext';
import styles from './Page2PatternSetup.module.css';

const Page2PatternSetup = () => {
  const { pattern, setPattern, repeatCount, setRepeatCount } = useInterval();
  const [localPattern, setLocalPattern] = useState(pattern.map(p => p.duration || ''));
  const [repeat, setRepeat] = useState(repeatCount);
  const navigate = useNavigate();

  const handleNext = () => {
    const durations = localPattern.map((d) => parseFloat(d));
    setPattern(durations.map((duration) => ({ duration })));
    setRepeatCount(repeat);
    navigate('/setup-details');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>인터벌 패턴 설정</h1>

        {localPattern.map((val, idx) => (
          <input
            key={idx}
            className={styles.input}
            type="number"
            placeholder={`패턴 ${idx + 1} (분)`}
            value={val}
            onChange={(e) => {
              const newPattern = [...localPattern];
              newPattern[idx] = e.target.value;
              setLocalPattern(newPattern);
            }}
          />
        ))}

        <input
          className={styles.input}
          type="number"
          placeholder="반복 횟수"
          value={repeat}
          onChange={(e) => setRepeat(parseInt(e.target.value))}
        />

        <button onClick={handleNext} className={styles.button}>
          다음으로
        </button>
      </div>
    </div>
  );
};

export default Page2PatternSetup;