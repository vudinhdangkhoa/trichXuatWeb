using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TrichXuatWeb.Models;
using TrichXuatWeb.Services;
using Microsoft.Extensions.Logging;

namespace TrichXuatWeb.controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrichXuatController : ControllerBase
    {
        private readonly IXuLyLogic _contentService;
        private readonly ILogger<TrichXuatController> _logger;

        public TrichXuatController(IXuLyLogic contentService, ILogger<TrichXuatController> logger)
        {
            _contentService = contentService;
            _logger = logger;
        }

        [HttpPost("extract")]
        public async Task<IActionResult> ExtractFromUrl([FromBody] UrlRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request?.Url))
                {
                    return BadRequest(new { error = "URL bị rỗng" });
                }

                _logger.LogInformation($"Extract request for URL: {request.Url}");
                
                var result = await _contentService.ProcessUrlAsync(request.Url);
                
                return Ok(new { 
                    success = true,
                    data = result,
                    message = "trích xuất thành công"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "lỗi khi trích xuất");
                return StatusCode(500, new { 
                    success = false,
                    error = "Đã xảy ra lỗi trong quá trình trích xuất",
                    details = ex.Message 
                });
            }
        }
    }
}