using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TwitterClone.Data;
using TwitterClone.Models;

namespace TwitterClone.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FollowsController : ControllerBase
{
    private readonly AppDbContext _context;

    public FollowsController(AppDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpPost("{userId}")]
    public IActionResult Follow(int userId)
    {
        var followerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        if (followerId == userId)
            return BadRequest(new { message = "error" });

        if (!_context.Users.Any(u => u.Id == userId))
            return NotFound(new { message = "user not found" });

        if (_context.Follows.Any(f => f.FollowerId == followerId && f.FollowingId == userId))
            return Conflict(new { message = "already followed" });

        _context.Follows.Add(new Follow { FollowerId = followerId, FollowingId = userId });
        _context.SaveChanges();

        return Ok(new { message = "followed" });
    }

    [Authorize]
    [HttpDelete("{userId}")]
    public IActionResult Unfollow(int userId)
    {
        var followerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var follow = _context.Follows
            .FirstOrDefault(f => f.FollowerId == followerId && f.FollowingId == userId);

        if (follow == null)
            return NotFound(new { message = "Not following" });

        _context.Follows.Remove(follow);
        _context.SaveChanges();

        return Ok(new { message = "unfollowed" });
    }

    [HttpGet("{userId}/followers")]
    public IActionResult GetFollowers(int userId)
    {
        var followers = _context.Follows
            .Where(f => f.FollowingId == userId)
            .Include(f => f.Follower)
            .Select(f => new {
                f.Follower.Id,
                f.Follower.Username,
                f.Follower.AvatarUrl
            })
            .ToList();

        return Ok(followers);
    }

    [HttpGet("{userId}/following")]
    public IActionResult GetFollowing(int userId)
    {
        var following = _context.Follows
            .Where(f => f.FollowerId == userId)
            .Include(f => f.Following)
            .Select(f => new {
                f.Following.Id,
                f.Following.Username,
                f.Following.AvatarUrl
            })
            .ToList();

        return Ok(following);
    }
}