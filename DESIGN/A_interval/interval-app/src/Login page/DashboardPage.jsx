// ✅ DashboardPage.jsx (프리미엄 조건 분기 수정 완료)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  console.log("✅ DashboardPage 컴포넌트 렌더링됨");
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremiumError, setIsPremiumError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("code")) {
      window.history.replaceState({}, "", "/dashboard");
    }

    const fetchUserInfo = async () => {
      try {
        const tokenRes = await fetch("http://localhost:8080/spotify/token", {
          method: "GET",
          credentials: "include",
        });
        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || !tokenData.accessToken) {
          throw new Error("No access token found.");
        }

        const res = await fetch("http://localhost:8080/spotify/me", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 403) {
            setIsPremiumError(true);
          } else {
            throw new Error(data.error || "Unknown error");
          }
          return;
        }

        setUserInfo(data);
      } catch (err) {
        console.error("사용자 정보 가져오기 실패:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/spotify/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/spotify_login");
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  const goToMusicPlayer = () => {
    navigate("/play");
  };

  const premiumSignupUrl = "https://www.spotify.com/premium/";


  console.log("렌더링 시 상태:", { userInfo, isPremiumError, isLoading });
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎶 대시보드</h1>

      {isLoading ? (
        <p>불러오는 중...</p>
      ) : userInfo && (isPremiumError == false) ? (
        <div style={styles.info}>
          
          <p><strong>Display Name:</strong> {userInfo.display_name}</p>
          <p><strong>User ID:</strong> {userInfo.id}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <button onClick={goToMusicPlayer} style={styles.musicButton}>🎵 음악 듣기</button>
        </div>
      ) : isPremiumError ? (
        <div style={styles.errorBox}>
          <p>⚠️ 이 기능을 사용하려면 Spotify Premium 계정이 필요합니다.</p>
          <a href={premiumSignupUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
            여기서 가입하기 →
          </a>
        </div>
      ) : (
        <p>유저 정보를 불러올 수 없습니다.</p>
      )}

      <button onClick={handleLogout} style={styles.logoutButton}>로그아웃</button>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#121212",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Helvetica Neue, sans-serif",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  info: {
    backgroundColor: "#1db954",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "20px",
    textAlign: "center",
  },
  errorBox: {
    backgroundColor: "#ff4d4f",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "20px",
    textAlign: "center",
  },
  link: {
    color: "#fff",
    textDecoration: "underline",
    marginTop: "10px",
    display: "inline-block",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  musicButton: {
    padding: "10px 20px",
    backgroundColor: "white",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default DashboardPage;