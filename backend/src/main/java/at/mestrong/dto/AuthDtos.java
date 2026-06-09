package at.mestrong.dto;

public class AuthDtos {
    public record RegisterRequest(String email, String password) {}
    public record LoginRequest(String email, String password) {}
    public record AuthResponse(String token, Long userId, String email) {}
}