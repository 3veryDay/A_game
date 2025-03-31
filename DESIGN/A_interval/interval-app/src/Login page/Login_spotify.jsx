import React from 'react';
import styles from './Login_spotify.module.css'; // 또는 './LoginPage.css' (일반 CSS라면)

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:8080/spotify/login";
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎵 Spotify 계정 연결</h1>
      <button className={styles.button} onClick={handleLogin}>
        Login with Spotify
      </button>
    </div>
  );
};

export default LoginPage;
