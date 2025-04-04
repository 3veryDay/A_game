import React, { useEffect, useState } from "react";
import "./PlaylistSelector.css";

const PlaylistSelector = ({ token, onSelect }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me/playlists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPlaylists(data.items || []);
        setLoading(false);
      } catch (err) {
        console.error("플레이리스트 불러오기 실패:", err);
        setLoading(false);
      }
    };

    if (token) {
      fetchPlaylists();
    }
  }, [token]);

  const controlPlayback = async (action) => {
    const deviceId = window.spotifyDeviceId;
    if (!window.spotifyToken || !deviceId) {
      alert("❗ Spotify 디바이스가 아직 활성화되지 않았습니다.");
      return;
    }

    let method = action === "play" || action === "pause" ? "PUT" : "POST";

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/me/player/${action}?device_id=${deviceId}`,
        {
          method,
          headers: { Authorization: `Bearer ${window.spotifyToken}` },
        }
      );

      if (res.ok) {
        console.log(`✅ ${action} 성공`);
      } else {
        const text = await res.text();
        console.error(`🚨 ${action} 실패:`, res.status, text);
      }
    } catch (err) {
      console.error(`${action} 요청 중 오류 발생:`, err);
    }
  };

  if (loading) return <p className="playlist-loading">📡 플레이리스트 로딩 중...</p>;

  return (
    <div className="playlist-selector">
      <h2 className="playlist-title">🎵 내 플레이리스트</h2>
      <ul className="playlist-list">
        {playlists.map((playlist) => (
          <li
            key={playlist.id}
            className="playlist-item"
            onClick={() =>
              onSelect(
                playlist.uri,
                playlist.name,
                playlist.images?.[0]?.url || ""
              )
            }
          >
            {playlist.name} ({playlist.tracks.total}곡)
          </li>
        ))}
      </ul>

      <div className="playlist-controls">
        <button className="playlist-btn green" onClick={() => controlPlayback("play")}>
          ▶️ 재생
        </button>
        <button className="playlist-btn gray" onClick={() => controlPlayback("pause")}>
          ⏸️ 일시정지
        </button>
        <button className="playlist-btn gray" onClick={() => controlPlayback("previous")}>
          ⏮️ 이전
        </button>
        <button className="playlist-btn gray" onClick={() => controlPlayback("next")}>
          ⏭️ 다음
        </button>
      </div>
    </div>
  );
};

export default PlaylistSelector;
