using TwitterClone.Data;
using TwitterClone.Models;
using TwitterClone.Models.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace TwitterClone.Controllers;

[ApiController]
[Route("api/posts")]
public class PostsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PostsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var posts = _context.Posts
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Select(p => new PostReadDto
            {
                Id = p.Id,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                CreatedAt = p.CreatedAt,
                UserId = p.UserId,
                Username = p.User.Username,
                AvatarUrl = p.User.AvatarUrl,
                LikeCount = p.Likes.Count
            })
            .ToList();

        return Ok(posts);
    }
    [HttpGet("user/{userId}")]
public IActionResult GetByUser(int userId)
{
    var posts = _context.Posts
        .Where(p => p.UserId == userId)
        .Include(p => p.User)
        .Include(p => p.Likes)
        .OrderByDescending(p => p.CreatedAt)
        .Select(p => new PostReadDto
        {
            Id = p.Id,
            Content = p.Content,
            ImageUrl = p.ImageUrl,
            CreatedAt = p.CreatedAt,
            UserId = p.UserId,
            Username = p.User.Username,
            AvatarUrl = p.User.AvatarUrl,
            LikeCount = p.Likes.Count
        })
        .ToList();

    return Ok(posts);
}

    [Authorize]
    [HttpPost]
    public IActionResult Create([FromBody] CreatePostDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var post = new Post
        {
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Posts.Add(post);
        _context.SaveChanges();

        return Ok(post);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var post = _context.Posts.Find(id);

        if (post == null) return NotFound();
        if (post.UserId != userId) return Forbid();

        _context.Posts.Remove(post);
        _context.SaveChanges();

        return NoContent();
    }
}