require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const { ACCESS_TOKEN } = process.env;

if (!ACCESS_TOKEN) {
  console.error("Missing ACCESS_TOKEN");
  process.exit(1);
}

app.get("/", (req, res) => {
  res.send("Hello Server!");
});

app.get("/api/posts", async (req, res) => {
  try {
    const nextUrl = req.query.next;
    const baseUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count&access_token=${ACCESS_TOKEN}&limit=12`;
    const url = nextUrl || baseUrl;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }

    res.json({
      posts: data.data,
      next: data.paging?.next || null,
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch Instagram posts" });
  }
});

app.get("/api/comments/:mediaId", async (req, res) => {
  const mediaId = req.params.mediaId;
  const url = `https://graph.instagram.com/${mediaId}/comments?fields=id,text,username&access_token=${ACCESS_TOKEN}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    res.json({ comments: data.data });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

app.post("/api/publish", async (req, res) => {
  const { imageUrl, caption } = req.body;
  if (!imageUrl || !caption) {
    console.error("Publish error: Missing imageUrl or caption", { imageUrl, caption });
    return res.status(400).json({ error: "Missing imageUrl or caption" });
  }

  // Basic URL validation
  const validImageFormats = ['.jpg', '.jpeg', '.png'];
  const validVideoFormats = ['.mp4', '.mov'];
  const isImage = validImageFormats.some((ext) => imageUrl.toLowerCase().endsWith(ext));
  const isVideo = validVideoFormats.some((ext) => imageUrl.toLowerCase().endsWith(ext));

  if (!isImage && !isVideo) {
    console.error("Publish error: Unsupported media format", { imageUrl });
    return res.status(400).json({ error: "Unsupported media format. Use JPEG, PNG, MP4, or MOV." });
  }

  try {
    console.log("Creating media with:", { imageUrl, caption });
    const mediaType = isVideo ? 'video_url' : 'image_url';
    const creationUrl = `https://graph.instagram.com/me/media?${mediaType}=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(caption)}&access_token=${ACCESS_TOKEN}`;
    const creationResponse = await fetch(creationUrl, { method: "POST" });
    const creationData = await creationResponse.json();
    if (!creationResponse.ok || creationData.error) {
      console.error("Creation failed:", creationData);
      throw new Error(creationData.error?.message || `Creation error: ${creationResponse.status}`);
    }
    const creationId = creationData.id;
    console.log("Publishing media with creationId:", creationId);
    const publishUrl = `https://graph.instagram.com/me/media_publish?creation_id=${creationId}&access_token=${ACCESS_TOKEN}`;
    const publishResponse = await fetch(publishUrl, { method: "POST" });
    const publishData = await publishResponse.json();
    if (!publishResponse.ok || publishData.error) {
      console.error("Publish failed:", publishData);
      throw new Error(publishData.error?.message || `Publish error: ${publishResponse.status}`);
    }
    res.json({ success: true, mediaId: publishData.id });
  } catch (err) {
    console.error("Error publishing post:", err.message);
    res.status(500).json({ error: `Failed to publish post: ${err.message}` });
  }
});

app.get("/api/profile", async (req, res) => {
  const url = `https://graph.instagram.com/me?fields=id,username,media_count&access_token=${ACCESS_TOKEN}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    res.json(data);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});