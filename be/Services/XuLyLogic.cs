using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TrichXuatWeb.Models;
using System.Net.Http;
using System.Text.RegularExpressions;
using HtmlAgilityPack; 
using Microsoft.AspNetCore.Hosting; 
using Microsoft.Extensions.Logging;
using System.IO;

namespace TrichXuatWeb.Services
{
    public class XuLyLogic: IXuLyLogic
    {
        private readonly IWebHostEnvironment _env;
    private readonly ILogger<XuLyLogic> _logger;
    private readonly HttpClient _httpClient = new();

    public XuLyLogic(IWebHostEnvironment env, ILogger<XuLyLogic> logger)
    {
        _env = env;
        _logger = logger;
    }

    public async Task<KetQua> ProcessUrlAsync(string url)
    {
        var html = await _httpClient.GetStringAsync(url);

        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var uri = new Uri(url);
        var domain = uri.Host.Replace(".", "_");
        // Thay đổi: lưu file ra ngoài wwwroot
        var basePath = Path.Combine(_env.WebRootPath, "downloads", domain);

        Directory.CreateDirectory(basePath);

        // Các danh sách lưu kết quả tải
        var images = await DownloadTags(doc, basePath, "images", "img", "src",url);
        var videos = await DownloadTags(doc, basePath, "video", "source", "src",url);
        var audios = await DownloadTags(doc, basePath, "sound", "source", "src",url);

        // Văn bản
        var texts = ExtractText(doc);
        var textPath = Path.Combine(basePath, "text");
        Directory.CreateDirectory(textPath);
        var textFile = Path.Combine(textPath, $"text_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}.txt");
        await File.WriteAllLinesAsync(textFile, texts);

        return new KetQua
        {
            ImageFiles = images,
            VideoFiles = videos,
            AudioFiles = audios,
            TextFiles = new List<string> { Path.GetFileName(textFile) }
        };
    }

    private async Task<List<string>> DownloadTags(HtmlDocument doc, string basePath, string folder, string tag, string attr,string baseUrl)
    {
        var nodes = doc.DocumentNode.SelectNodes($"//{tag}[@{attr}]") ?? new HtmlNodeCollection(null);
        var folderPath = Path.Combine(basePath, folder);
        Directory.CreateDirectory(folderPath);

        var savedFiles = new List<string>();

        foreach (var node in nodes)
        {
            var src = node.GetAttributeValue(attr, null);
            if (string.IsNullOrEmpty(src)) continue;

            try
            {
                var fullUrl = src.StartsWith("http") ? src : new Uri(new Uri(baseUrl), src).ToString();

                var bytes = await _httpClient.GetByteArrayAsync(fullUrl);
                var ext = Path.GetExtension(fullUrl);
                var filename = Slugify(Path.GetFileNameWithoutExtension(fullUrl)) + "_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() + ext;
                var filePath = Path.Combine(folderPath, filename);
                await File.WriteAllBytesAsync(filePath, bytes);
                savedFiles.Add(filename);
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"Failed to download {src}: {ex.Message}");
            }
        }

        return savedFiles;
    }

    private List<string> ExtractText(HtmlDocument doc)
    {
        var tags = new[] { "p", "h1", "h2", "h3", "h4", "h5", "h6" };
        var results = new List<string>();

        foreach (var tag in tags)
        {
            var nodes = doc.DocumentNode.SelectNodes($"//{tag}");
            if (nodes != null)
                results.AddRange(nodes.Select(n => n.InnerText.Trim()).Where(t => !string.IsNullOrEmpty(t)));
        }

        return results;
    }

    private string Slugify(string input)
    {
        return Regex.Replace(input.ToLowerInvariant(), @"[^a-z0-9]+", "-").Trim('-');
    }
    }
}