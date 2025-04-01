import React, { useEffect, useState } from 'react';

const MusicPlayerPage = () => {
  const [token, setToken] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [user, setUser] =useState(null);
  const [isPremium, setIsPremium] = useState(false);



  // 1. access_token 받아오기
  useEffect(() => {
    fetch("http://localhost:8080/spotify/token", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        console.log("받은 token : ",data );
        setToken(data.accessToken)});
  }, []);
  useEffect(() => {
    fetch("http://localhost:8080/spotify/profile", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        console.log("👤 사용자 정보 (백엔드 프록시 경유):", data);
        setUser(data);
        setIsPremium(data.product === "premium");
      })
      .catch(err => {
        console.error("😵 사용자 정보 불러오기 실패:", err);
      });
  }, []);
  

  // 3. SDK 초기화(premium 계정인 경우에만)
  useEffect(() => {
    if (!token || !isPremium) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'React Interval Player',
        getOAuthToken: cb => cb(token),
        volume: 0.5,
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Device ready:', device_id);
        setDeviceId(device_id);
      });

      player.connect();
    };
  }, [token, isPremium]);

  // 4. 음악 재생
  const playTrack = () => {
    if (!deviceId || !token) return;

    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      credentials : "include",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: ["spotify:track:3n3Ppam7vgaVa1iaRUc9Lp"],
      }),
    });
  };

  return (
    <div>
      <h1>🎵 음악 재생 테스트</h1>

      {!user && <p>로그인 정보를 불러오는 중...</p>}

      {user && !isPremium && (
        <p style={{ color: 'red' }}>🚫 Premium 계정이 아닙니다. 음악을 틀 수 없습니다!</p>
      )}

      {user && isPremium && (
        <>
          <p>👋 {user.display_name}님, 환영합니다!</p>
          <button onClick={playTrack}>음악 재생</button>
        </>
      )}
    </div>
  );
};

export default MusicPlayerPage;