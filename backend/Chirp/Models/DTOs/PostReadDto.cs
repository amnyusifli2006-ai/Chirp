namespace TwitterClone.Models.DTOs;

public class PostReadDto
{
    public int Id { get; set; }
    public string Content { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = null!;
    public string? AvatarUrl { get; set; }
    public int LikeCount { get; set; }
}