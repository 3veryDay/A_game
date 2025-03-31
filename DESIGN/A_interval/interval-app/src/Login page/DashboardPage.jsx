import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // 백엔드의 /spotify/me 호출 → 사용자 정보 가져오기
    fetch("http://localhost:8080/spotify/me", {
      method: "GET",
      credentials: "include", // 세션 쿠키 유지
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Unknown error");
        }

        setUserInfo(data);
      })
      .catch((err) => {
        console.error("사용자 정보 가져오기 실패", err.message);
      });
  }, []); // ✅ 의존성 배열 빠뜨리지 말기

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎉 로그인 완료!</h1>
      {userInfo ? (
        <div style={styles.info}>
          <p>
            <strong>Display Name:</strong> {userInfo.display_name}
          </p>
          <p>
            <strong>User ID:</strong> {userInfo.id}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
        </div>
      ) : (
        <p>불러오는 중...</p>
      )}
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
  },
};

export default DashboardPage;
