# YouTube Integration - Quick Reference

## 🎯 Implementation Complete

All YouTube link ingest functionality has been successfully implemented and tested.

---

## 📋 Required Setup

### 1. Add YouTube API Key to `.env`

```bash
YOUTUBE_API_KEY="YOUR_ACTUAL_YOUTUBE_API_KEY"
```

**Get your API key:**
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create API credentials

---

## 🔗 New Endpoints

### Preview YouTube Video (No DB Write)
```
POST /api/videos/preview/youtube
```

### Ingest YouTube Video (Save to DB)
```
POST /api/videos/ingest/youtube
```

Both endpoints:
- ✅ Protected with `@Roles(CREATOR, ADMIN)`
- ✅ Documented in Swagger
- ✅ Support multiple URL formats

---

## 🧪 Example cURL Commands

### Get Authentication Token

```bash
# Register creator
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "creator@example.com",
    "password": "password123",
    "fullName": "Test Creator",
    "role": "CREATOR"
  }'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "creator@example.com",
    "password": "password123"
  }'
```

Save the `token` from response.

---

### Preview YouTube Video

```bash
curl -X POST http://localhost:5001/api/videos/preview/youtube \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "provider": "YOUTUBE",
    "providerVideoId": "dQw4w9WgXcQ",
    "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "title": "Rick Astley - Never Gonna Give You Up",
    "durationSec": 212,
    "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "channelTitle": "Rick Astley",
    "publishedAt": "2009-10-25T06:57:33Z"
  }
}
```

---

### Ingest YouTube Video (Save to DB)

```bash
curl -X POST http://localhost:5001/api/videos/ingest/youtube \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "provider": "YOUTUBE",
    "providerVideoId": "dQw4w9WgXcQ",
    "status": "READY",
    "title": "Rick Astley - Never Gonna Give You Up",
    "durationSec": 212,
    "playbackMeta": {
      "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      "channelTitle": "Rick Astley",
      "publishedAt": "2009-10-25T06:57:33Z",
      "source": "youtube"
    },
    "createdAt": "2026-02-15T06:09:28.000Z",
    "updatedAt": "2026-02-15T06:09:28.000Z"
  }
}
```

---

## 🎨 Supported URL Formats

✅ `https://www.youtube.com/watch?v=VIDEO_ID`  
✅ `https://youtu.be/VIDEO_ID`  
✅ `https://www.youtube.com/shorts/VIDEO_ID`  
✅ URLs with query parameters (`&t=`, `&list=`, etc.)

---

## 📊 Database Schema

No migration needed! The schema already has:
- ✅ `YOUTUBE` in `VideoProvider` enum
- ✅ `playback_meta` JSON field for metadata
- ✅ Unique constraint on `(provider, providerVideoId)`

**Upsert behavior:** Re-ingesting the same YouTube video updates the existing record instead of creating a duplicate.

---

## 📚 Swagger Documentation

Visit: **http://localhost:5001/docs**

Find the new endpoints under the **Videos** tag:
- `POST /api/videos/preview/youtube`
- `POST /api/videos/ingest/youtube`

---

## ✅ What Was Implemented

| Component | Status | File |
|-----------|--------|------|
| YouTube Service | ✅ | [youtube.service.ts](file:///Users/mehriddin/Projects/nest_back/src/videos/youtube.service.ts) |
| Preview DTO | ✅ | [preview-youtube.dto.ts](file:///Users/mehriddin/Projects/nest_back/src/videos/dto/preview-youtube.dto.ts) |
| Ingest DTO | ✅ | [ingest-youtube.dto.ts](file:///Users/mehriddin/Projects/nest_back/src/videos/dto/ingest-youtube.dto.ts) |
| Service Methods | ✅ | [videos.service.ts](file:///Users/mehriddin/Projects/nest_back/src/videos/videos.service.ts) |
| Controller Endpoints | ✅ | [videos.controller.ts](file:///Users/mehriddin/Projects/nest_back/src/videos/videos.controller.ts) |
| Module Config | ✅ | [videos.module.ts](file:///Users/mehriddin/Projects/nest_back/src/videos/videos.module.ts) |
| Environment | ✅ | [.env.example](file:///Users/mehriddin/Projects/nest_back/.env.example) |

---

## 🚀 Start Server

```bash
npm run start:dev
```

Server runs on: **http://localhost:5001**  
Swagger docs: **http://localhost:5001/docs**

---

## 🔍 Verify Database

```sql
SELECT * FROM video_assets WHERE provider = 'YOUTUBE';
```

Expected fields:
- `provider`: `YOUTUBE`
- `provider_video_id`: YouTube video ID
- `status`: `READY`
- `playback_meta`: JSON with embed URL, thumbnail, channel, etc.
