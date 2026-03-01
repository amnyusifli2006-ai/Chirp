namespace TwitterClone.Models;

public class Post
{
    public int Id { get; set; }
    public string Content { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public ICollection<Like> Likes { get; set; } = new List<Like>();
}