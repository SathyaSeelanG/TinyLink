# TinyLink API Documentation

Complete API reference for the TinyLink URL shortener application.

---

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Create Link](#create-link)
  - [List Links](#list-links)
  - [Get Link Details](#get-link-details)
  - [Delete Link](#delete-link)
  - [Redirect](#redirect)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Overview

The TinyLink API is a RESTful API that allows you to create, manage, and track shortened URLs. All API requests and responses use JSON format.

### API Version
Current version: `1.0`

### Content Type
All requests and responses use `application/json` content type.

---

## Base URL

**Local Development:**
```
https://tiny-link-clone.vercel.app
```

**Production:**
```
https://your-domain.vercel.app
```

---

## Authentication

Currently, TinyLink uses **cookie-based user identification**. No API keys or OAuth tokens are required.

- A unique `user_id` cookie is automatically created on first visit
- All links are associated with this user ID
- Users can only view and delete their own links

---

## Endpoints

### Health Check

Check the health and status of the API.

**Endpoint:** `GET /healthz`

**Response:** `200 OK`
```json
{
  "ok": true,
  "version": "1.0"
}
```

**Example:**
```bash
curl https://tiny-link-clone.vercel.app/healthz
```

---

### Create Link

Create a new shortened URL.

**Endpoint:** `POST /api/links`

**Request Body:**
```json
{
  "url": "https://example.com/very/long/url",
  "code": "custom123"  // Optional: 6-8 alphanumeric characters
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | The original URL to shorten. Must be a valid URL. |
| `code` | string | No | Custom short code (6-8 alphanumeric characters). If not provided, a random code will be generated. |

**Success Response:** `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "custom123",
  "original_url": "https://example.com/very/long/url",
  "click_count": 0,
  "created_at": "2025-11-22T03:30:00.000Z",
  "last_clicked": null,
  "user_id": "c31c4629-af58-48a1-8f35-f13fbf35817a"
}
```

**Error Responses:**

`400 Bad Request` - Invalid URL or code format
```json
{
  "error": "Invalid URL format"
}
```

`409 Conflict` - Code already exists
```json
{
  "error": "Code already exists"
}
```

**Example:**
```bash
curl -X POST https://tiny-link-clone.vercel.app/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com/SathyaSeelanG/TinyUrl",
    "code": "github"
  }'
```

---

### List Links

Get all links created by the current user.

**Endpoint:** `GET /api/links`

**Query Parameters:** None

**Success Response:** `200 OK`
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "abc123",
    "original_url": "https://example.com",
    "click_count": 42,
    "created_at": "2025-11-22T03:30:00.000Z",
    "last_clicked": "2025-11-22T05:45:00.000Z",
    "user_id": "c31c4629-af58-48a1-8f35-f13fbf35817a"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "code": "xyz789",
    "original_url": "https://example.org",
    "click_count": 15,
    "created_at": "2025-11-22T04:00:00.000Z",
    "last_clicked": "2025-11-22T06:00:00.000Z",
    "user_id": "c31c4629-af58-48a1-8f35-f13fbf35817a"
  }
]
```

**Example:**
```bash
curl https://tiny-link-clone.vercel.app/api/links
```

---

### Get Link Details

Get detailed information about a specific link.

**Endpoint:** `GET /api/links/:code`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `code` | string | The short code of the link |

**Success Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "abc123",
  "original_url": "https://example.com",
  "click_count": 42,
  "created_at": "2025-11-22T03:30:00.000Z",
  "last_clicked": "2025-11-22T05:45:00.000Z",
  "user_id": "c31c4629-af58-48a1-8f35-f13fbf35817a"
}
```

**Error Response:**

`404 Not Found` - Link does not exist
```json
{
  "error": "Link not found"
}
```

**Example:**
```bash
curl https://tiny-link-clone.vercel.app/api/links/abc123
```

---

### Delete Link

Delete a specific link. Only the owner can delete their links.

**Endpoint:** `DELETE /api/links/:code`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `code` | string | The short code of the link to delete |

**Success Response:** `200 OK`
```json
{
  "message": "Link deleted successfully"
}
```

**Error Responses:**

`404 Not Found` - Link not found or user doesn't have permission
```json
{
  "error": "Link not found or you don't have permission to delete it"
}
```

**Example:**
```bash
curl -X DELETE https://tiny-link-clone.vercel.app/api/links/abc123
```

---

### Redirect

Redirect to the original URL and track the click.

**Endpoint:** `GET /:code`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `code` | string | The short code of the link |

**Success Response:** `302 Found`
- Redirects to the original URL
- Increments the click count
- Updates the `last_clicked` timestamp

**Error Response:**

`404 Not Found` - Link does not exist
```json
{
  "error": "Link not found"
}
```

**Example:**
```bash
curl -L https://tiny-link-clone.vercel.app/abc123
# Redirects to the original URL
```

---

## Data Models

### Link Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier for the link |
| `code` | string | Short code (6-8 alphanumeric characters) |
| `original_url` | string | The original long URL |
| `click_count` | integer | Number of times the link has been clicked |
| `created_at` | ISO 8601 timestamp | When the link was created |
| `last_clicked` | ISO 8601 timestamp \| null | When the link was last clicked (null if never clicked) |
| `user_id` | UUID | ID of the user who created the link |

**Example:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "abc123",
  "original_url": "https://example.com",
  "click_count": 42,
  "created_at": "2025-11-22T03:30:00.000Z",
  "last_clicked": "2025-11-22T05:45:00.000Z",
  "user_id": "c31c4629-af58-48a1-8f35-f13fbf35817a"
}
```

---

## Error Handling

All errors follow the same JSON structure:

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success - Request completed successfully |
| `201` | Created - Link created successfully |
| `302` | Redirect - Temporary redirect to original URL |
| `400` | Bad Request - Invalid input (malformed URL, invalid code format) |
| `404` | Not Found - Resource does not exist |
| `409` | Conflict - Code already exists |
| `500` | Internal Server Error - Server-side error |

---

## Rate Limiting

Currently, there is **no rate limiting** implemented. However, in production, consider implementing:

- Maximum requests per minute per IP
- Maximum links per user per day
- CAPTCHA for suspicious activity

---

## Code Validation Rules

### URL Validation
- Must be a valid HTTP/HTTPS URL
- Must include a domain
- Cannot be empty

### Code Validation
- **Auto-generated:** 6-8 alphanumeric characters
- **Custom codes:** 
  - Length: 6-8 characters
  - Characters: Only letters (A-Z, a-z) and numbers (0-9)
  - Regex: `^[A-Za-z0-9]{6,8}$`
  - Must be globally unique

**Valid codes:**
- `abc123`
- `GitHub`
- `test01`
- `XyZ789pq`

**Invalid codes:**
- `short` (too short)
- `toolongcode` (too long)
- `test-01` (contains hyphen)
- `hello_world` (contains underscore)

---

## Examples

### Complete Workflow Example

```bash
# 1. Create a new link
curl -X POST https://tiny-link-clone.vercel.app/api/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/SathyaSeelanG/TinyUrl", "code": "github"}'

# Response:
# {
#   "id": "...",
#   "code": "github",
#   "original_url": "https://github.com/SathyaSeelanG/TinyUrl",
#   "click_count": 0,
#   ...
# }

# 2. Get all your links
curl https://tiny-link-clone.vercel.app/api/links

# 3. Access the short link (redirect)
curl -L https://tiny-link-clone.vercel.app/github
# Redirects to https://github.com/SathyaSeelanG/TinyUrl

# 4. Get link stats
curl https://tiny-link-clone.vercel.app/api/links/github

# Response:
# {
#   "code": "github",
#   "click_count": 1,
#   "last_clicked": "2025-11-22T05:45:00.000Z",
#   ...
# }

# 5. Delete the link
curl -X DELETE https://tiny-link-clone.vercel.app/api/links/github

# Response:
# {
#   "message": "Link deleted successfully"
# }
```

---

## Support

For issues, questions, or contributions:
- **GitHub:** https://github.com/SathyaSeelanG/TinyUrl
- **Issues:** https://github.com/SathyaSeelanG/TinyUrl/issues

---

**Last Updated:** November 22, 2025  
**Version:** 1.0
