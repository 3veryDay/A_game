// ✅ 사용자의 플레이리스트를 불러오고 선택할 수 있는 컴포넌트
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MusicLabRecommendations from "../components/MusicLabRecommendations";
import PlaylistSelector from '../components/PlaylistSelector';

const MusicLabPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(location.state?.token || null);
  const [deviceId, setDeviceId] = useState(location.state?.deviceId || null);
  const [trackUri, setTrackUri] = useState('spotify:track:3n3Ppam7vgaVa1iaRUc9Lp');
  const [trackInfo, setTrackInfo] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    if (trackUri) fetchTrackInfo();
  }, [trackUri]);

  useEffect(() => {
    if (token && deviceId) {
      window.spotifyToken = token;
      window.spotifyDeviceId = deviceId;
    }
  }, [token, deviceId]);

  useEffect(() => {
    if (!token || deviceId) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Music Lab Web Player',
        getOAuthToken: cb => cb(token),
        volume: 0.5,
      });

      player.addListener('ready', async ({ device_id }) => {
        setDeviceId(device_id);
        try {
          await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uris: [] }),
          });
        } catch (err) {
          console.error("디바이스 활성화 실패:", err);
        }
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('⛔ Web Playback SDK 비활성화됨:', device_id);
      });

      player.connect();
    };
  }, [token, deviceId]);

  const fetchTrackInfo = () => {
    if (!token || !trackUri) return;
    fetch(`http://localhost:8080/spotify/playback/track-info?trackUri=${encodeURIComponent(trackUri)}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setTrackInfo(data))
      .catch(err => console.error("Track info error:", err));
  };

  const playPlaylist = async (playlistUri) => {
    if (!token || !deviceId) return;
    try {
      const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context_uri: playlistUri,
          offset: { position: 0 },
          position_ms: 0,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("재생 실패:", res.status, text);
      }
    } catch (err) {
      console.error("재생 중 오류:", err);
    }
  };

  const controlPlayback = (action) => {
    let method = action === 'play' || action === 'pause' ? 'PUT' : 'POST';
    let body = null;

    if (action === 'play') {
      body = JSON.stringify({ track_uri: trackUri, device_id: deviceId });
    }

    fetch(`http://localhost:8080/spotify/playback/${action}`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then(res => res.text())
      .then(text => console.log(`${action} 성공:`, text))
      .catch(err => console.error(`${action} 실패:`, err));
  };

  const searchTracks = () => {
    fetch(`http://localhost:8080/spotify/music/search?type=track&q=${encodeURIComponent(keyword)}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setSearchResults(data.tracks.items))
      .catch(err => console.error("검색 실패:", err));
  };

  const changeVolume = (value) => {
    setVolume(value);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">🎛️ Music Lab</h1>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">🔍 곡 검색</h2>
        <div className="flex items-center space-x-2">
          <input
            className="border rounded px-2 py-1 w-96"
            type="text"
            placeholder="검색어 입력"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <button className="bg-purple-600 text-white px-4 py-1 rounded" onClick={searchTracks}>검색</button>
        </div>
        <ul className="mt-2 space-y-1">
          {searchResults.map(track => {
            const uri = `spotify:track:${track.id}`;
            return (
              <li
                key={track.id}
                onClick={() => setTrackUri(uri)}
                className={`cursor-pointer px-2 py-1 rounded transition-colors duration-150 hover:bg-gray-200 ${uri === trackUri ? 'bg-green-100 font-semibold' : ''}`}
              >
                🎵 {track.name} - {track.artists.map(a => a.name).join(', ')}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="space-y-2">
        <input
          className="border rounded px-2 py-1 mr-2 w-96"
          type="text"
          value={trackUri}
          onChange={e => setTrackUri(e.target.value)}
          placeholder="Enter Spotify Track URI"
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={fetchTrackInfo}>정보 조회</button>
      </div>

      {trackInfo && (
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">🎵 {trackInfo.name}</h2>
          <p>👤 아티스트: {trackInfo.artists?.map(a => a.name).join(", ")}</p>
          <p>💽 앨범: {trackInfo.album?.name}</p>
          {trackInfo.album?.images?.[0]?.url && (
            <img
              src={trackInfo.album.images[0].url}
              alt="앨범 커버"
              className="rounded shadow"
              style={{ width: '300px', height: '300px', objectFit: 'cover' }}
            />
          )}
        </div>
      )}

      <div className="flex items-center space-x-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => controlPlayback('play')}>▶️ 재생</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => controlPlayback('pause')}>⏸️ 정지</button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => controlPlayback('previous')}>⏮️ 이전</button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => controlPlayback('next')}>⏭️ 다음</button>
      </div>

      <MusicLabRecommendations
        token={token}
        deviceId={deviceId}
        currentTrackId={trackUri?.replace("spotify:track:", "")}
        artistId={trackInfo?.artists?.[0]?.id}
      />

      <PlaylistSelector
        token={token}
        onSelect={(playlistUri) => {
          playPlaylist(playlistUri);
        }}
      />

      {/* ✅ 인터벌 설정 페이지 이동 버튼 */}
      <div className="mt-4">
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/music-lab-interval", {
            state: {
              token,
              deviceId,
            },
          })}
        >
          ⏭️ 다음 인터벌 설정 페이지로 이동
        </button>
      </div>

      <div className="h-2 bg-gray-200 rounded-full mt-6">
        <div className="w-1/3 h-full bg-green-500 rounded-full" />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">🔊 볼륨</h2>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={e => changeVolume(e.target.value)}
        />
        <span className="ml-2">{volume}%</span>
      </div>
    </div>
  );
};

export default MusicLabPage;
