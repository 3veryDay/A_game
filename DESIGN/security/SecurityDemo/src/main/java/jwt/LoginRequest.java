package jwt;

public class LoginRequest {
    private String username;
    private String password;

    public String getUsername(){
        return username;
    }
    public void setUsername(String username){
        System.out.println("setUsername called with: " + username);
        this.username = username;
    }
    public String getPassword(){
        return password;
    }

    public void setPassword(String password) {
        System.out.println("setPassword called with: " + password);
        this.password = password;
    }
}
