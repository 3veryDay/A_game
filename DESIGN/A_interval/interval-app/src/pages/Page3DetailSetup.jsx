// src/pages/Page3DetailSetup.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterval } from '../context/IntervalContext';
import styles from './Page3.module.css';

const Page3DetailSetup = () => {
  const { pattern, setDetails } = useInterval();
  const navigate = useNavigate();

  useEffect(() => {
    if (pattern.length === 0) {
      navigate('/setup-count');
    }
  }, [pattern, navigate]);

  const [inputs, setInputs] = useState(
    pattern.map((p) => ({
      duration: p.duration,
      speed: '',
      type: 'WALK',
      music: '',
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const handleNext = () => {
    setDetails(inputs);
    navigate('/summary');
  };

  if (pattern.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>세부 패턴 설정</h1>
          <p className={styles.subtitle}>패턴 정보가 없습니다. 이전 페이지로 돌아가주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>세부 패턴 설정</h1>
        <p className={styles.subtitle}>각 패턴에 대해 속도와 음악을 자유롭게 설정하세요 🎶</p>

        {inputs.map((input, idx) => (
          <div key={idx} className={styles.segment}>
            <p className={styles.segmentTitle}>{input.duration}분 세그먼트</p>
            <input
              className={styles.input}
              type="number"
              placeholder="목표 속도 (km/h)"
              value={input.speed}
              onChange={(e) => handleChange(idx, 'speed', e.target.value)}
            />
            <select
              className={styles.select}
              value={input.type}
              onChange={(e) => handleChange(idx, 'type', e.target.value)}
            >
              <option value="WALK">Walk</option>
              <option value="RUN">Run</option>
              <option value="JOG">Jog</option>
              <option value="SPRINT">Sprint</option>
            </select>
            <input
              className={styles.input}
              placeholder="음악 (플레이리스트 또는 장르)"
              value={input.music}
              onChange={(e) => handleChange(idx, 'music', e.target.value)}
            />
          </div>
        ))}

        <button onClick={handleNext} className={styles.button}>
          다음으로
        </button>
      </div>
    </div>
  );
};

export default Page3DetailSetup;