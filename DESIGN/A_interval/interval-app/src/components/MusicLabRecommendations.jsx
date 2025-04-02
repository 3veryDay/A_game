// ✅ 추천곡 기반 자동 "다음 곡 재생" 기능 구현 예시
import React, { useEffect, useState } from "react";

const MusicLabRecommendations = ({ token, deviceId, currentTrackId }) => {
  const [recommendedQueue, setRecommendedQueue] = useState([]);
  const [currentUri, setCurrentUri] = useState(null);

  // ✅ 현재 트랙 기반으로 추천곡 받아오기
  const fetchRecommendedTracks = async () => {
    const seedTrackId = currentTrackId || "4uLU6hMCjMI75M1A2tKUQC"; // ✅ 안전한 기본값
  
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/recommendations?limit=5&seed_tracks=${seedTrackId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (!res.ok) {
        const text = await res.text();
        console.error("❌ 추천곡 API 실패:", res.status, text);
        return;
      }
  
      const data = await res.json();
      setRecommendedQueue(data.tracks);
    } catch (err) {
      console.error("추천곡 불러오기 실패:", err);
    }
  };

  // ✅ 다음 곡 재생
  const playNextTrack = async () => {
    if (recommendedQueue.length === 0) {
      console.warn("추천 큐가 비었습니다. 다시 가져올게요.");
      await fetchRecommendedTracks();
      return;
    }

    const nextTrack = recommendedQueue[0];
    const nextUri = `spotify:track:${nextTrack.id}`;
    setCurrentUri(nextUri);
    setRecommendedQueue((prev) => prev.slice(1));

    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: [nextUri] }),
        }
      );
      console.log("▶️ 다음 추천 곡 재생됨:", nextTrack.name);
    } catch (err) {
      console.error("🚨 재생 실패:", err);
    }
  };

  useEffect(() => {
    if (currentTrackId) {
      fetchRecommendedTracks();
    }
  }, [currentTrackId]);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold">🔁 추천 기반 다음 곡</h2>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={playNextTrack}
      >
        ▶️ 다음 추천 곡 재생
      </button>
      {currentUri && <p className="mt-2 text-sm text-gray-700">현재 재생 URI: {currentUri}</p>}
    </div>
  );
};

export default MusicLabRecommendations;
