import { useEffect, useState } from 'react';
import './MusicTypeSelector.css';

const musicTypes = [
  { label: 'Recommendation', value: 'RECOMMENDATION', icon: '✨' },
  { label: 'Genre', value: 'GENRE', icon: '🎵' },
  { label: 'Mood', value: 'MOOD', icon: '😌' },
  { label: 'BPM', value: 'BPM', icon: '💓' },
  { label: 'Artist', value: 'ARTIST', icon: '👤' },
  { label: 'Album', value: 'ALBUM', icon: '💿' },
  { label: 'Song', value: 'SONG', icon: '🎶' },
  { label: 'Playlist', value: 'PLAYLIST', icon: '📂' },
  { label: 'Favorites', value: 'FAVORITES', icon: '❤️' },
  { label: 'Recent', value: 'RECENT', icon: '🕘' },
  { label: 'Top Hits', value: 'TOPHITS', icon: '🔥' },
  { label: 'New Releases', value: 'NEWRELEASES', icon: '🆕' },
  { label: 'Random', value: 'RANDOM', icon: '🎲' },
];

export default function MusicTypeSelector({ selectedType, musicDetail, onChange }) {
  const [selected, setSelected] = useState(selectedType ?? 'RECOMMENDATION');

  const [detail, setDetail] = useState('');


  useEffect(() => {
    setDetail(musicDetail || '');
  }, [musicDetail]);

  const handleSelect = (type) => {
    setSelected(type);
    setDetail('');
    onChange({ musicType: type, musicDetail: '' });
  };

  const handleDetailChange = (e) => {
    setDetail(e.target.value);
    onChange({ musicType: selected, musicDetail: e.target.value });
  };

  const needsDetail = ['GENRE', 'MOOD', 'BPM', 'ARTIST', 'ALBUM', 'SONG'].includes(selected);
  const needsSelectButton = ['PLAYLIST', 'FAVORITES'].includes(selected);

  return (
    <div className="music-selector">
      <div className="music-buttons">
        {musicTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => handleSelect(type.value)}
            className={`music-button ${selected === type.value ? 'selected' : ''}`}
          >
            <span>{type.icon}</span>
            {type.label}
          </button>
        ))}
      </div>

      {needsDetail && (
        <input
          type="text"
          value={detail}
          onChange={handleDetailChange}
          placeholder="세부 정보 입력"
          className="music-input"
        />
      )}

      {needsSelectButton && (
        <button
          onClick={() => alert('플레이리스트/즐겨찾기 연결 예정')}
          className="select-button"
        >
          Select
        </button>
      )}
    </div>
  );
}
