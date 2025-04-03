// ✅ MusicLabPage2 - 두 개의 플레이리스트를 설정 시간대로 자동 전환하는 페이지
import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PlaylistSelector from "../components/PlaylistSelector";

const MusicLabPage2 = () => {
  const location = useLocation();
  const token = location.state?.token;
  const deviceId = location.state?.deviceId || window.spotifyDeviceId;

  const [playlist1, setPlaylist1] = useState(null);
  const [playlist2, setPlaylist2] = useState(null);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [time1, setTime1] = useState(30); // seconds
  const [time2, setTime2] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(0); // 0 or 1
  const timeoutRef = useRef(null);

  // ✅ 마지막 재생 위치 저장용 객체 (메모리 내)
  const positionStore = useRef({});

  const saveCurrentPosition = async () => {
    try {
      const res = await fetch("https://api.spotify.com/v1/me/player", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 204) {
        console.warn("⚠️ 현재 재생 상태 없음 (204)");
        return;
      }

      const data = await res.json();
      const contextUri = data.context?.uri;
      const trackUri = data.item?.uri;
      const position = data.progress_ms;

      if (contextUri && trackUri && position != null) {
        positionStore.current[contextUri] = { trackUri, position };
        console.log("💾 저장 완료:", contextUri, trackUri, `${position}ms`);
      }
    } catch (err) {
      console.error("현재 재생 위치 저장 실패:", err);
    }
  };

  const playPlaylist = async (playlistUri) => {
    const resumeData = positionStore.current[playlistUri];
    const offsetUri = resumeData?.trackUri || null;
    const resumeMs = resumeData?.position || 0;

    console.log("▶️ 재생 요청:", playlistUri, "resume at", resumeMs);

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
      console.log("✅ 재생됨:", playlistUri, `(${resumeMs}ms)`);
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
        <PlaylistSelector
          token={token}
          onSelect={(uri, name) => {
            setPlaylist1(uri);
            setName1(name);
          }}
        />
        {name1 && <p className="text-sm text-gray-600">✅ 선택됨: {name1}</p>}
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
        <PlaylistSelector
          token={token}
          onSelect={(uri, name) => {
            setPlaylist2(uri);
            setName2(name);
          }}
        />
        {name2 && <p className="text-sm text-gray-600">✅ 선택됨: {name2}</p>}
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

//-------------------------------------------------------
// // ✅ MusicLabPage2 - 두 개의 플레이리스트를 설정 시간대로 자동 전환하는 페이지
// import React, { useEffect, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";
// import PlaylistSelector from "../components/PlaylistSelector";

// const MusicLabPage2 = () => {
//   const location = useLocation();
//   const token = location.state?.token;
//   const deviceId = location.state?.deviceId || window.spotifyDeviceId;

//   const [playlist1, setPlaylist1] = useState(null);
//   const [playlist2, setPlaylist2] = useState(null);
//   const [playlistName1, setPlaylistName1] = useState('');
//   const [playlistName2, setPlaylistName2] = useState('');
//   const [time1, setTime1] = useState(30); // seconds
//   const [time2, setTime2] = useState(30);
//   const [isRunning, setIsRunning] = useState(false);
//   const [playingIndex, setPlayingIndex] = useState(0); // 0 or 1
//   const [currentNames, setCurrentNames] = useState({ 0: '', 1: '' });
//   const timeoutRef = useRef(null);

//   // ✅ 마지막 재생 위치 저장용 객체 (메모리 내)
//   const positionStore = useRef({});

//   const saveCurrentPosition = async () => {
//     try {
//       const res = await fetch(`https://api.spotify.com/v1/me/player`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.status === 204) {
//         console.warn("⚠️ 현재 재생 상태 없음 (204)");
//         return;
//       }

//       const data = await res.json();
//       const contextUri = data.context?.uri;
//       const position = data.progress_ms;

//       if (contextUri && position != null) {
//         positionStore.current[contextUri] = position;
//         console.log("💾 저장 완료:", contextUri, `${position}ms`);
//       }
//     } catch (err) {
//       console.error("현재 재생 위치 저장 실패:", err);
//     }
//   };

//   const playPlaylist = async (playlistUri) => {
//     const resumePosition = positionStore.current[playlistUri] || 0;
//     console.log("▶️ 재생 요청:", playlistUri, "resume at", resumePosition);

//     try {
//       await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           context_uri: playlistUri,
//           offset: { position: 0 },
//           position_ms: resumePosition,
//         }),
//       });
//       console.log("✅ 재생됨:", playlistUri, `(${resumePosition}ms)`);
//     } catch (err) {
//       console.error("재생 실패:", err);
//     }
//   };

//   const playLoop = async (index) => {
//     const uri = index === 0 ? playlist1 : playlist2;
//     const duration = index === 0 ? time1 : time2;

//     if (!uri) return;

//     await playPlaylist(uri);
//     setPlayingIndex(index);

//     timeoutRef.current = setTimeout(async () => {
//       await saveCurrentPosition();
//       playLoop(index === 0 ? 1 : 0);
//     }, duration * 1000);
//   };

//   const startAlternating = () => {
//     if (!playlist1 || !playlist2 || !time1 || !time2) {
//       alert("두 플레이리스트와 시간을 모두 입력해주세요");
//       return;
//     }
//     setIsRunning(true);
//     playLoop(0);
//   };

//   const stopAlternating = () => {
//     clearTimeout(timeoutRef.current);
//     setIsRunning(false);
//   };

//   const getPlaylistName = async (playlistUri, index) => {
//     const id = playlistUri.split(':').pop();
//     try {
//       const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (index === 0) setPlaylistName1(data.name);
//       else setPlaylistName2(data.name);
//     } catch (err) {
//       console.error("플레이리스트 이름 가져오기 실패:", err);
//     }
//   };

//   useEffect(() => {
//     if (playlist1) getPlaylistName(playlist1, 0);
//   }, [playlist1]);

//   useEffect(() => {
//     if (playlist2) getPlaylistName(playlist2, 1);
//   }, [playlist2]);

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">🎛️ Music Lab - 자동 전환 모드</h1>

//       <div className="space-y-2">
//         <label className="block font-medium">🎵 Playlist 1 (재생 시간)</label>
//         <input
//           type="number"
//           min="5"
//           value={time1}
//           onChange={(e) => setTime1(Number(e.target.value))}
//           className="border px-2 py-1 rounded w-24"
//         /> 초
//         <PlaylistSelector token={token} onSelect={(uri) => {
//           setPlaylist1(uri);
//           setCurrentNames((prev) => ({ ...prev, 0: uri.split(':').pop() }));
//         }} />
//         {playlistName1 && <p className="text-sm text-gray-600">선택됨: {playlistName1}</p>}
//       </div>

//       <div className="space-y-2">
//         <label className="block font-medium">🎵 Playlist 2 (재생 시간)</label>
//         <input
//           type="number"
//           min="5"
//           value={time2}
//           onChange={(e) => setTime2(Number(e.target.value))}
//           className="border px-2 py-1 rounded w-24"
//         /> 초
//         <PlaylistSelector token={token} onSelect={(uri) => {
//           setPlaylist2(uri);
//           setCurrentNames((prev) => ({ ...prev, 1: uri.split(':').pop() }));
//         }} />
//         {playlistName2 && <p className="text-sm text-gray-600">선택됨: {playlistName2}</p>}
//       </div>

//       <div className="space-x-4">
//         {!isRunning ? (
//           <button
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//             onClick={startAlternating}
//           >
//             ▶️ 전환 시작
//           </button>
//         ) : (
//           <button
//             className="bg-red-500 text-white px-4 py-2 rounded"
//             onClick={stopAlternating}
//           >
//             ⏹️ 중단
//           </button>
//         )}
//       </div>

//       {isRunning && (
//         <p className="text-sm text-gray-600">
//           🔁 현재 재생 중: Playlist {playingIndex + 1} ({playingIndex === 0 ? time1 : time2}초) <br />
//           🏷️ URI: {currentNames[playingIndex]}
//         </p>
//       )}
//     </div>
//   );
// };

// export default MusicLabPage2;

