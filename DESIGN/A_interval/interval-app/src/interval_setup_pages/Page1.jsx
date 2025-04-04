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
        <h1 className={styles.title}>한 반복 안에 몇 가지 동작 패턴을 넣을까요?</h1>
        <h3>권장 패턴 : 2개</h3>
        <h5>
  여러 패턴을 설정하면 운동을 더 다양하게 구성할 수 있어요! 예를 들어:  
  <br /><br />
  - <strong>패턴 2개</strong><br />
  1. 2분 운동<br />
  2. 1분 휴식<br /><br />

  - <strong>패턴 3개</strong><br />
  1. 2분 가볍게 운동<br />
  2. 2분 강도 높게 운동<br />
  3. 1분 휴식<br /><br />

  즉, 패턴의 개수는 하나의 반복 안에서 몇 가지 단계로 나눌지 정하는 거예요. 원하는 운동과 휴식 시간을 조합해 자신만의 인터벌을 만들어보세요! 😊
</h5>

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
