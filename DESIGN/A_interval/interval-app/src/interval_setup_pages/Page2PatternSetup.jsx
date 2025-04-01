// Page2PatternSetup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterval } from '../context/IntervalContext';
import styles from './Page2PatternSetup.module.css';

const Page2PatternSetup = () => {
  const { pattern, setPattern, repeatCount, setRepeatCount } = useInterval();
  const [localPattern, setLocalPattern] = useState(
    pattern.map(p => {
      const totalSec = p.duration || 0;
      return {
        min: Math.floor(totalSec / 60).toString(),
        sec: (totalSec % 60).toString(),
      };
    })
  );
  const [repeat, setRepeat] = useState(repeatCount);
  const navigate = useNavigate();

  const handleNext = () => {
    const durations = localPattern.map(({ min, sec }) => {
      const m = parseInt(min) || 0;
      const s = parseInt(sec) || 0;
      return m * 60 + s;
    });
    setPattern(durations.map((duration) => ({ duration })));
    setRepeatCount(repeat);
    navigate('/setup-details');
  };

  const handleTimeChange = (idx, field, value) => {
    const updated = [...localPattern];
    updated[idx][field] = value;
    setLocalPattern(updated);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>인터벌 패턴 설정</h1>

        {localPattern.map((time, idx) => (
          <div key={idx} className={styles.timeRow}>
            <span>패턴 {idx + 1}: </span>
            <input
              className={styles.timeInput}
              type="number"
              placeholder="분"
              value={time.min}
              onChange={(e) => handleTimeChange(idx, 'min', e.target.value)}
            />
            <span>분</span>
            <input
              className={styles.timeInput}
              type="number"
              placeholder="초"
              value={time.sec}
              onChange={(e) => handleTimeChange(idx, 'sec', e.target.value)}
            />
            <span>초</span>
          </div>
        ))}
<div style={{ marginTop: '30px' }}/>
        <h4 style={{textAlign : 'center'}} >이 인터벌을 몇번 반복하실건가요?</h4>
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
