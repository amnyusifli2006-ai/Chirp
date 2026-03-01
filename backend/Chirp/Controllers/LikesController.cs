using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TwitterClone.Data;
using TwitterClone.Models;

namespace TwitterClone.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LikesController : ControllerBase
{
    private readonly AppDbContext _context;

    public LikesController(AppDbContext context)
    {
        _context = context;
    }


    [Authorize]
    [HttpPost("{postId}")]
    public IActionResult Like(int postId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        if (!_context.Posts.Any(p => p.Id == postId))
            return NotFound(new { message = "Not found" });

        if (_context.Likes.Any(l => l.UserId == userId && l.PostId == postId))
            return Conflict(new { message = "Already liked" });

        _context.Likes.Add(new Like { UserId = userId, PostId = postId });
        _context.SaveChanges();

        var count = _context.Likes.Count(l => l.PostId == postId);
        return Ok(new { message = "Liked", likeCount = count });
    }

    
    [Authorize]
    [HttpDelete("{postId}")]
    public IActionResult Unlike(int postId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var like = _context.Likes
            .FirstOrDefault(l => l.UserId == userId && l.PostId == postId);

        if (like == null)
            return NotFound(new { message = "Not found" });

        _context.Likes.Remove(like);
        _context.SaveChanges();

        var count = _context.Likes.Count(l => l.PostId == postId);
        return Ok(new { message = "Like removed", likeCount = count });
    }

    
    [HttpGet("{postId}/count")]
    public IActionResult GetCount(int postId)
    {
        var count = _context.Likes.Count(l => l.PostId == postId);
        return Ok(new { postId, likeCount = count });
    }
}