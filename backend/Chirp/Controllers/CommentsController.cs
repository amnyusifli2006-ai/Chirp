using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TwitterClone.Data;
using TwitterClone.Models;
using TwitterClone.Models.DTOs;

namespace TwitterClone.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CommentsController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet("{postId}")]
    public IActionResult GetByPost(int postId)
    {
        var comments = _context.Comments
            .Where(c => c.PostId == postId)
            .Include(c => c.User)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new {
                c.Id,
                c.Content,
                c.CreatedAt,
                c.PostId,
                Username = c.User.Username,
                AvatarUrl = c.User.AvatarUrl
            })
            .ToList();

        return Ok(comments);
    }

    [Authorize]
    [HttpPost("{postId}")]
    public IActionResult Create(int postId, [FromBody] CreateCommentDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        if (!_context.Posts.Any(p => p.Id == postId))
            return NotFound(new { message = "Post not found" });

        var comment = new Comment
        {
            Content = dto.Content,
            PostId = postId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        _context.SaveChanges();

        return Ok(comment);
    }
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var comment = _context.Comments.Find(id);

        if (comment == null) return NotFound();
        if (comment.UserId != userId) return Forbid();

        _context.Comments.Remove(comment);
        _context.SaveChanges();

        return NoContent();
    }
}