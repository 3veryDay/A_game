// ✅ MusicLabPage2 - 두 개의 플레이리스트를 설정 시간대로 자동 전환하는 페이지
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PlaylistSelector from "../components/PlaylistSelector";

const MusicLabPage2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token || window.spotifyToken;
  const deviceId = location.state?.deviceId || window.spotifyDeviceId;

  const [playlist1, setPlaylist1] = useState(null);
  const [playlist2, setPlaylist2] = useState(null);
  const [time1, setTime1] = useState(30); // seconds
  const [time2, setTime2] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(0); // 0 or 1
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (token && deviceId) {
      console.log("📦 전역 변수에 저장된 token 및 deviceId:", token, deviceId);
      window.spotifyToken = token;
      window.spotifyDeviceId = deviceId;
    }
  }, [token, deviceId]);

  const playPlaylist = async (playlistUri) => {
    if (!token || !deviceId) return;
    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
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
      console.log("▶️ 재생됨:", playlistUri);
    } catch (err) {
      console.error("재생 실패:", err);
    }
  };

  const playLoop = (index) => {
    const uri = index === 0 ? playlist1 : playlist2;
    const duration = index === 0 ? time1 : time2;

    if (!uri) return;
    playPlaylist(uri);
    setPlayingIndex(index);

    timeoutRef.current = setTimeout(() => {
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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🎛️ Music Lab - 자동 전환 모드</h1>

      <div className="space-y-2">
        <label className="block font-medium">🎵 Playlist 1 (재생 시간)</label>
        <input
          type="number"
          min="5"
          value={time1}
          onChange={(e) => setTime1(Number(e.target.value))}
          className="border px-2 py-1 rounded w-24"
        /> 초
        <PlaylistSelector token={token} onSelect={(uri) => setPlaylist1(uri)} />
        {playlist1 && <p className="text-sm text-gray-700 mt-1">선택된 Playlist 1: {playlist1}</p>}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">🎵 Playlist 2 (재생 시간)</label>
        <input
          type="number"
          min="5"
          value={time2}
          onChange={(e) => setTime2(Number(e.target.value))}
          className="border px-2 py-1 rounded w-24"
        /> 초
        <PlaylistSelector token={token} onSelect={(uri) => setPlaylist2(uri)} />
        {playlist2 && <p className="text-sm text-gray-700 mt-1">선택된 Playlist 2: {playlist2}</p>}
      </div>

      <div className="space-x-4">
        {!isRunning ? (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={startAlternating}
          >
            ▶️ 전환 시작
          </button>
        ) : (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={stopAlternating}
          >
            ⏹️ 중단
          </button>
        )}
      </div>

      {isRunning && (
        <p className="text-sm text-gray-600">
          🔁 현재 재생 중: Playlist {playingIndex + 1} ({playingIndex === 0 ? time1 : time2}초)
        </p>
      )}
    </div>
  );
};

export default MusicLabPage2;
