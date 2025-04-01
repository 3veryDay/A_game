package com.example.a_interval;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyApiThreading;
import se.michaelthelin.spotify.exceptions.detailed.ForbiddenException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.model_objects.specification.User;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;
import se.michaelthelin.spotify.requests.data.users_profile.GetCurrentUsersProfileRequest;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpHeaders;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/*
[React 버튼 클릭]
   ↓
GET /spotify/login (백엔드)
   ↓
[Spotify 로그인 페이지로 이동 → 인증 완료 → Redirect URI로 돌아옴]
   ↓
GET /spotify/callback?code=xxxx
   ↓
[Access Token 발급 완료]

로그인 성공 시, 발급된 access token / refresh token을 세션, 쿠키, DB, 혹은 토큰 기반 인증으로 저장

/me 호출 시마다 그 사용자 토큰을 꺼내서 SpotifyApi를 새로 생성해서 써야 해
 */
//https://github.com/spotify-web-api-java/spotify-web-api-java
@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/spotify")
@RequiredArgsConstructor
public class SpotifyTestController {

    @Value("${spotify.client.id}")
    private String clientId;

    @Value("${spotify.client.secret.id}")
    private String clientSecret;

    @Value("${spotify.redirectUri}")
    private String redirectUri;

//    private SpotifyApi spotifyApi;


    @GetMapping("/login")
    public ResponseEntity<String> login() {
        SpotifyApi apiForLogin = new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRedirectUri(URI.create(redirectUri))
                .build();

        AuthorizationCodeUriRequest authorizationCodeUriRequest = apiForLogin.authorizationCodeUri()
                .scope("user-read-private user-read-email user-read-playback-state user-read-recently-played user-modify-playback-state")
                .show_dialog(true)
                .build();
        URI uri = authorizationCodeUriRequest.execute();
        System.out.println("로그인 URL: " + uri); // 👉 이거 콘솔에 찍어서 확인해봐!

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(uri).build();

    }


    @GetMapping("/callback")
    public ResponseEntity<String> callback(@RequestParam("code") String code, HttpSession session) {
        SpotifyApi apiForCallback = new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRedirectUri(URI.create(redirectUri))
                .build();
        try {
            System.out.println("🟡 콜백 진입");

            AuthorizationCodeRequest authorizationCodeRequest = apiForCallback.authorizationCode(code).build();
            AuthorizationCodeCredentials credentials = authorizationCodeRequest.execute();


            System.out.println("🟢 accessToken 발급 완료: " + credentials.getAccessToken());
            System.out.println("🔍 Granted scopes: " + credentials.getScope());

            String accessToken = credentials.getAccessToken();
            session.setAttribute("accessToken", accessToken);

            System.out.println("🟢 accessToken 발급 완료: " + accessToken);

            // 테스트용 API 호출
            SpotifyApi testApi = new SpotifyApi.Builder()
                    .setAccessToken(accessToken)
                    .build();

            final User user = testApi.getCurrentUsersProfile().build().execute();
            System.out.println("✅ 유저: " + user.getDisplayName());

            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", "http://localhost:3000/dashboard")
                    .build();

        } catch (Exception e) {
            System.out.println("❌ 예외 발생!");
            e.printStackTrace(); // 콘솔 출력

            // 에러를 클라이언트에게 그대로 전달 (확실히 보기 위해!)
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("서버 에러 발생: " + e.getClass().getSimpleName() + "\n" + e.getMessage());
        }
    }

    @GetMapping("/token")
    public ResponseEntity<?> getToken(HttpSession session) {
        String accessToken = (String) session.getAttribute("accessToken");
        if (accessToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "no Access Token"));
        }

        return ResponseEntity.ok(Map.of("accessToken", accessToken));
    }

    // 3. 사용자 정보 가져오기
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserProfile(HttpSession session) {
        String accessToken = (String) session.getAttribute("accessToken");
        System.out.println("//me : accessToken: " + accessToken);
        if (accessToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "no Access Token"));
        }

        SpotifyApi api = new SpotifyApi.Builder()
                .setAccessToken(accessToken)
                .build();

        try {
            final GetCurrentUsersProfileRequest getCurrentUsersProfileRequest = api.getCurrentUsersProfile().build();
            final User user = getCurrentUsersProfileRequest.execute();
            System.out.println("Display name: " + user.getDisplayName());
            Map<String, Object> userInfo = Map.of(
                    "id", user.getId(),
                    "display_name", user.getDisplayName(),
                    "email", user.getEmail()
            );

            return ResponseEntity.ok(userInfo);
        } catch (ForbiddenException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "4-3"));
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        System.out.println("✅ 세션 로그아웃 완료");
        return ResponseEntity.ok().build();
    }

}
