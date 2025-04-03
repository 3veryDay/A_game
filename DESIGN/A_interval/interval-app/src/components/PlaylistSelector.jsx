// ✅ 사용자의 플레이리스트를 불러오고 선택할 수 있는 컴포넌트
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PlaylistSelector = ({ token, onSelect, showIntervalButton = false }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      alert("❗ Spotify 디바이스가 아직 활성화되지 않았습니다. 곡을 먼저 재생하거나 Web Player가 준비될 때까지 기다려주세요.");
      return;
    }

    let method = action === 'play' || action === 'pause' ? 'PUT' : 'POST';

    try {
      const res = await fetch(`https://api.spotify.com/v1/me/player/${action}?device_id=${deviceId}`, {
        method,
        headers: {
          Authorization: `Bearer ${window.spotifyToken}`,
        },
      });

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

  if (loading) return <p>📡 플레이리스트 로딩 중...</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">🎵 내 플레이리스트</h2>
      <ul className="space-y-2">
        {playlists.map((playlist) => (
          <li
            key={playlist.id}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded border"
            onClick={() => onSelect(playlist.uri)}
          >
            {playlist.name} ({playlist.tracks.total}곡)
          </li>
        ))}
      </ul>

      {/* ✅ 재생 제어 버튼 */}
      <div className="flex items-center space-x-4 mt-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => controlPlayback('play')}
        >
          ▶️ 재생
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => controlPlayback('pause')}
        >
          ⏸️ 일시정지
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => controlPlayback('previous')}
        >
          ⏮️ 이전 곡
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => controlPlayback('next')}
        >
          ⏭️ 다음 곡
        </button>
      </div>

      {/* ✅ 다음 인터벌 설정 페이지로 이동 버튼 (MusicLabPage에서만 보임) */}
      {showIntervalButton && (
        <div className="mt-6">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={() => navigate("/music-lab-interval", {
              state: {
                token: window.spotifyToken,
                deviceId: window.spotifyDeviceId,
              },
            })}
          >
            ⏭️ 다음 인터벌 설정 페이지로 이동
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaylistSelector;
