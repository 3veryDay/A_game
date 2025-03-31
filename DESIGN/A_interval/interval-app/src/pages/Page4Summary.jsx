import { useNavigate } from 'react-router-dom';
import { useInterval } from '../context/IntervalContext';
import styles from './Page4Summary.module.css';

const Page4Summary = () => {
  const { details, repeatCount } = useInterval();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>세션 요약</h1>
        <p className={styles.subtitle}>총 반복 횟수: {repeatCount}회</p>

        {details.map((d, idx) => {
          const min = Math.floor(d.duration / 60);
          const sec = d.duration % 60;

          let musicDisplay = '';
          if (['GENRE', 'MOOD', 'BPM', 'ARTIST', 'ALBUM', 'SONG'].includes(d.musicType)) {
            musicDisplay = `${d.musicType.charAt(0)}${d.musicType.slice(1).toLowerCase()}: ${d.musicDetail}`;
          } else if (['PLAYLIST', 'FAVORITES'].includes(d.musicType)) {
            musicDisplay = `${d.musicType.charAt(0)}${d.musicType.slice(1).toLowerCase()}: 선택 필요`;
          } else if (d.musicType === 'NONE') {
            musicDisplay = 'None';
          } else {
            musicDisplay = d.musicType.charAt(0) + d.musicType.slice(1).toLowerCase();
          }

          return (
            <div key={idx} className={styles.segment}>
              <p className={styles.segmentText}>
                {min}분{sec !== 0 && ` ${sec}초`} | 속도: {d.speed}km/h | 타입: {d.type}
              </p>
              <p className={styles.musicText}>음악: {musicDisplay}</p>
            </div>
          );
        })}

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
