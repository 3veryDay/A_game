import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PlaylistSelector from "../components/PlaylistSelector";
import "./MusicLabPage2.css";

const MusicLabPage2 = () => {
  const location = useLocation();
  const token = location.state?.token;
  const deviceId = location.state?.deviceId || window.spotifyDeviceId;

  const [playlist1, setPlaylist1] = useState(null);
  const [playlist2, setPlaylist2] = useState(null);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [time1, setTime1] = useState(30);
  const [time2, setTime2] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(0);
  const timeoutRef = useRef(null);
  const positionStore = useRef({});

  const saveCurrentPosition = async () => {
    try {
      const res = await fetch("https://api.spotify.com/v1/me/player", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 204) return;

      const data = await res.json();
      const contextUri = data.context?.uri;
      const trackUri = data.item?.uri;
      const position = data.progress_ms;

      if (contextUri && trackUri && position != null) {
        positionStore.current[contextUri] = { trackUri, position };
      }
    } catch (err) {
      console.error("현재 재생 위치 저장 실패:", err);
    }
  };

  const playPlaylist = async (playlistUri) => {
    const resumeData = positionStore.current[playlistUri];
    const offsetUri = resumeData?.trackUri || null;
    const resumeMs = resumeData?.position || 0;

    try {
      const body = {
        context_uri: playlistUri,
        position_ms: resumeMs,
      };
      if (offsetUri) {
        body.offset = { uri: offsetUri };
      }

      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error("재생 실패:", err);
    }
  };

  const playLoop = async (index) => {
    const uri = index === 0 ? playlist1 : playlist2;
    const duration = index === 0 ? time1 : time2;

    if (!uri) return;

    await playPlaylist(uri);
    setPlayingIndex(index);

    timeoutRef.current = setTimeout(async () => {
      await saveCurrentPosition();
      playLoop(index === 0 ? 1 : 0);
    }, duration * 1000);
  };

  const startAlternating = () => {
    if (!playlist1 || !playlist2 || !time1 || !time2) {
      alert("두 플레이리스트와 시간을 모두 입력해주세요");
      return;
    }
    setIsRunning(true);
    playLoop(0);
  };

  const stopAlternating = () => {
    clearTimeout(timeoutRef.current);
    setIsRunning(false);
  };

  return (
    <div className="music-lab-container">
      <h1 className="music-lab-title">🎛️ Music Lab - 자동 전환 모드</h1>

      <div className="music-lab-playlists-row">
        {/* Playlist 1 */}
        <div className="music-lab-block">
        <h3 className="playlist-block-title">🎵 Playlist 1</h3>

          {image1 && <img src={image1} alt="playlist1 cover" className="playlist-cover" />}

          <div className="playlist-time-input">
            <label htmlFor="time1">재생 시간</label>
            <input
              id="time1"
              type="number"
              min="5"
              value={time1}
              onChange={(e) => setTime1(Number(e.target.value))}
            />
            <span>초</span>
          </div>

          {name1 && <p className="playlist-selected-name"> Playlist: {name1}</p>}

          <PlaylistSelector
            token={token}
            onSelect={(uri, name, image) => {
              setPlaylist1(uri);
              setName1(name);
              setImage1(image);
            }}
          />
        </div>

        {/* Playlist 2 */}
        <div className="music-lab-block">
        <h3 className="playlist-block-title">🎵 Playlist 2</h3>
          {image2 && <img src={image2} alt="playlist2 cover" className="playlist-cover" />}

          <div className="playlist-time-input">
            <label htmlFor="time2">재생 시간</label>
            <input
              id="time2"
              type="number"
              min="5"
              value={time2}
              onChange={(e) => setTime2(Number(e.target.value))}
            />
            <span>초</span>
          </div>

          {name2 && <p className="playlist-selected-name">Playlist: {name2}</p>}

          <PlaylistSelector
            token={token}
            onSelect={(uri, name, image) => {
              setPlaylist2(uri);
              setName2(name);
              setImage2(image);
            }}
          />
        </div>
      </div>

      <div className="music-lab-controls">
        {!isRunning ? (
          <button className="music-lab-button start" onClick={startAlternating}>
            ▶️ 전환 시작
          </button>
        ) : (
          <button className="music-lab-button stop" onClick={stopAlternating}>
            ⏹️ 중단
          </button>
        )}
      </div>

      {isRunning && (
        <p className="music-lab-status">
          🔁 현재 재생 중: Playlist {playingIndex + 1} ({playingIndex === 0 ? time1 : time2}초)
        </p>
      )}
    </div>
  );
};

export default MusicLabPage2;
