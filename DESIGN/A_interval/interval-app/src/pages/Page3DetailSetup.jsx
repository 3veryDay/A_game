import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterval } from '../context/IntervalContext';
import styles from './Page3.module.css';

const Page3DetailSetup = () => {
  const { pattern, setDetails } = useInterval();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMin, setNewMin] = useState('');
  const [newSec, setNewSec] = useState('');

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
      musicType: 'NONE',
      musicDetail: '',
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const handleNext = () => {
    const finalDetails = inputs.map((input) => {
      const { duration, speed, type, musicType, musicDetail } = input;

      const typesWithDetail = ['GENRE', 'MOOD', 'BPM', 'ARTIST', 'ALBUM', 'SONG'];

      const musicInfo =
        typesWithDetail.includes(musicType ?? '') && musicDetail?.trim() !== ''
          ? musicDetail.trim()
          : null;

      return {
        duration,
        speed,
        type,
        musicType,
        musicDetail,
        music_info: musicInfo,
      };
    });

    setDetails(finalDetails);
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

        <div className={styles.addButtonWrapper}>
          <button
            className={styles.addButton}
            onClick={() => setShowAddModal(true)}
          >
            ➕ 세그먼트 추가
          </button>
        </div>

        {inputs.map((input, idx) => (
          <div key={idx} className={styles.segment}>
            <div className={styles.segmentTopBar}>
              <p className={styles.segmentTitle}>
                {Math.floor(input.duration / 60)}분
                {input.duration % 60 !== 0 && ` ${input.duration % 60}초`} 세그먼트
              </p>

              {inputs.length > 1 && (
                <button
                  className={styles.deleteButton}
                  title="Delete Segment"
                  onClick={() => {
                    const updated = inputs.filter((_, i) => i !== idx);
                    setInputs(updated);
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <input
              className={styles.compactInput}
              type="number"
              placeholder="목표 속도 (km/h)"
              value={input.speed}
              onChange={(e) => handleChange(idx, 'speed', e.target.value)}
            />

            <select
              className={styles.compactInput}
              value={input.type}
              onChange={(e) => handleChange(idx, 'type', e.target.value)}
            >
              <option value="WALK">Walk</option>
              <option value="RUN">Run</option>
              <option value="JOG">Jog</option>
              <option value="SPRINT">Sprint</option>
            </select>

            <select
              className={styles.compactInput}
              value={input.musicType}
              onChange={(e) => handleChange(idx, 'musicType', e.target.value)}
            >
              <option value="NONE">None</option>
              <option value="GENRE">Genre</option>
              <option value="RANDOM">Random</option>
              <option value="MOOD">Mood</option>
              <option value="BPM">BPM</option>
              <option value="PLAYLIST">Playlist</option>
              <option value="FAVORITES">Favorites</option>
              <option value="ARTIST">Artist</option>
              <option value="ALBUM">Album</option>
              <option value="SONG">Song</option>
              <option value="RECENT">Recent</option>
              <option value="TOPHITS">Top Hits</option>
              <option value="NEWRELEASES">New Releases</option>
            </select>

            {['GENRE', 'MOOD', 'BPM', 'ARTIST', 'ALBUM', 'SONG'].includes(input.musicType ?? '') && (
              <input
                className={styles.compactInput}
                type="text"
                placeholder="세부 정보 입력"
                value={input.musicDetail}
                onChange={(e) => handleChange(idx, 'musicDetail', e.target.value)}
              />
            )}

            {['PLAYLIST', 'FAVORITES'].includes(input.musicType ?? '') && (
              <button
                className={styles.selectButton}
                onClick={() => alert('추후 연결 예정')}
              >
                Select
              </button>
            )}
          </div>
        ))}

        <button onClick={handleNext} className={styles.button}>
          다음으로
        </button>

        {showAddModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>추가할 세그먼트 시간</h3>
              <div className={styles.timeInputRow}>
                <input
                  type="number"
                  placeholder="분"
                  value={newMin}
                  onChange={(e) => setNewMin(e.target.value)}
                  className={styles.timeInput}
                />
                <span>분</span>
                <input
                  type="number"
                  placeholder="초"
                  value={newSec}
                  onChange={(e) => setNewSec(e.target.value)}
                  className={styles.timeInput}
                />
                <span>초</span>
              </div>
              <div className={styles.modalButtons}>
                <button
                  onClick={() => {
                    const m = parseInt(newMin) || 0;
                    const s = parseInt(newSec) || 0;
                    const duration = m * 60 + s;
                    if (duration > 0) {
                      const newSegment = {
                        duration,
                        speed: '',
                        type: 'WALK',
                        musicType: 'NONE',
                        musicDetail: '',
                      };
                      setInputs([...inputs, newSegment]);
                      setShowAddModal(false);
                      setNewMin('');
                      setNewSec('');
                    } else {
                      alert('시간을 입력해주세요!');
                    }
                  }}
                >
                  확인
                </button>
                <button onClick={() => setShowAddModal(false)}>취소</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page3DetailSetup;
