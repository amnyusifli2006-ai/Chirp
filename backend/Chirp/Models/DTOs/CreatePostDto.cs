namespace TwitterClone.Models.DTOs;

public class CreatePostDto
{
    public string Content { get; set; } = null!;
    public string? ImageUrl { get; set; }
}