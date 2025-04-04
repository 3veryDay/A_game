// ✅ 사용자의 플레이리스트를 불러오고 선택할 수 있는 컴포넌트
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const MusicLab = () => {
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
    <div style={styles.container}>
      <h1 style={styles.title}>🎛️ Music Lab</h1>
  
      <button
        style={styles.button}
        onClick={() =>
          navigate("/music-lab-interval", {
            state: {
              token,
              deviceId,
            },
          })
        }
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#1ed760")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#1DB954")}
      >
        ⏭️ 다음 인터벌 설정 페이지로 이동
      </button>
    </div>
  );
  
};

export default MusicLab;
const styles = {
    container: {
      padding: "2.5rem",
      minHeight: "100vh",
      backgroundColor: "#121212",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "2rem",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#1DB954", // Spotify Green
    },
    button: {
      backgroundColor: "#1DB954",
      color: "#000",
      padding: "0.75rem 1.5rem",
      fontSize: "1rem",
      fontWeight: "600",
      border: "none",
      borderRadius: "1.5rem",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
      transition: "background-color 0.3s",
    },
  };
  