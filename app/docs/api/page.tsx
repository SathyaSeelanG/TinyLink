"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Home,
    ChevronRight,
    Book,
    Copy,
    Check,
    ExternalLink
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface Endpoint {
    method: "GET" | "POST" | "DELETE"
    path: string
    title: string
    description: string
    requestBody?: {
        fields: Array<{
            name: string
            type: string
            required: boolean
            description: string
        }>
        example: string
    }
    responses: Array<{
        status: number
        description: string
        example: string
    }>
    curlExample: string
}

const endpoints: Endpoint[] = [
    {
        method: "GET",
        path: "/healthz",
        title: "Health Check",
        description: "Check the health and status of the API",
        responses: [
            {
                status: 200,
                description: "Success",
                example: `{
  "ok": true,
  "version": "1.0"
}`
            }
        ],
        curlExample: `curl https://tiny-link-clone.vercel.app/healthz`
    },
    {
        method: "POST",
        path: "/api/links",
        title: "Create Link",
        description: "Create a new shortened URL",
        requestBody: {
            fields: [
                {
                    name: "url",
                    type: "string",
                    required: true,
                    description: "The original URL to shorten (must be valid HTTP/HTTPS)"
                },
                {
                    name: "code",
                    type: "string",
                    required: false,
                    description: "Custom short code (6-8 alphanumeric). Auto-generated if not provided."
                }
            ],
            example: `{
  "url": "https://example.com/very/long/url",
  "code": "custom123"
}`
        },
        responses: [
            {
                status: 201,
                description: "Link created successfully",
                example: `{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "custom123",
  "original_url": "https://example.com/very/long/url",
  "click_count": 0,
  "created_at": "2025-11-22T03:30:00.000Z",
  "last_clicked": null,
  "user_id": "c31c4629-af58-48a1-8f35-f13fbf35817a"
}`
            },
            {
                status: 400,
                description: "Invalid URL or code format",
                example: `{
  "error": "Invalid URL format"
}`
            },
            {
                status: 409,
                description: "Code already exists",
                example: `{
  "error": "Code already exists"
}`
            }
        ],
        curlExample: `curl -X POST https://tiny-link-clone.vercel.app/api/links \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://github.com/SathyaSeelanG/TinyUrl",
    "code": "github"
  }'`
    },
    {
        method: "GET",
        path: "/api/links",
        title: "List Links",
        description: "Get all links created by the current user",
        responses: [
            {
                status: 200,
                description: "Success",
                example: `[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "abc123",
    "original_url": "https://example.com",
    "click_count": 42,
    "created_at": "2025-11-22T03:30:00.000Z",
    "last_clicked": "2025-11-22T05:45:00.000Z",
    "user_id": "c31c4629-af58-48a1-8f35-f13fbf35817a"
  }
]`
            }
        ],
        curlExample: `curl https://tiny-link-clone.vercel.app/api/links`
    },
    {
        method: "GET",
        path: "/api/links/:code",
        title: "Get Link Details",
        description: "Get detailed information about a specific link",
        responses: [
            {
                status: 200,
                description: "Success",
                example: `{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "abc123",
  "original_url": "https://example.com",
  "click_count": 42,
  "created_at": "2025-11-22T03:30:00.000Z",
  "last_clicked": "2025-11-22T05:45:00.000Z",
  "user_id": "c31c4629-af58-48a1-8f35-f13fbf35817a"
}`
            },
            {
                status: 404,
                description: "Link not found",
                example: `{
  "error": "Link not found"
}`
            }
        ],
        curlExample: `curl https://tiny-link-clone.vercel.app/api/links/abc123`
    },
    {
        method: "DELETE",
        path: "/api/links/:code",
        title: "Delete Link",
        description: "Delete a specific link (only owner can delete)",
        responses: [
            {
                status: 200,
                description: "Link deleted successfully",
                example: `{
  "message": "Link deleted successfully"
}`
            },
            {
                status: 404,
                description: "Link not found or no permission",
                example: `{
  "error": "Link not found or you don't have permission to delete it"
}`
            }
        ],
        curlExample: `curl -X DELETE https://tiny-link-clone.vercel.app/api/links/abc123`
    },
    {
        method: "GET",
        path: "/:code",
        title: "Redirect",
        description: "Redirect to original URL and track click",
        responses: [
            {
                status: 302,
                description: "Redirect to original URL (increments click count)",
                example: "Redirects to the original URL"
            },
            {
                status: 404,
                description: "Link not found",
                example: `{
  "error": "Link not found"
}`
            }
        ],
        curlExample: `curl -L https://tiny-link-clone.vercel.app/abc123`
    }
]

const methodColors = {
    GET: "bg-blue-500",
    POST: "bg-green-500",
    DELETE: "bg-red-500"
}

export default function ApiDocsPage() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedCode(id)
            setTimeout(() => setCopiedCode(null), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    const filteredEndpoints = endpoints.filter(endpoint =>
        endpoint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-foreground transition-colors">
                            <Home className="h-4 w-4" />
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/docs" className="hover:text-foreground transition-colors">
                            Documentation
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span>API</span>
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">API Documentation</h1>
                    <p className="text-muted-foreground mb-6">
                        Complete reference for the TinyLink REST API
                    </p>

                    {/* Quick Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground mb-1">Base URL (Local)</p>
                                <code className="text-sm font-mono">https://tiny-link-clone.vercel.app</code>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground mb-1">Version</p>
                                <code className="text-sm font-mono">1.0</code>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground mb-1">Authentication</p>
                                <code className="text-sm font-mono">Cookie-based</code>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Links */}
                    <div className="flex gap-3 mb-6">
                        <Link href="/docs">
                            <Button variant="outline" className="gap-2">
                                <Book className="h-4 w-4" />
                                App Documentation
                            </Button>
                        </Link>
                        <a href="https://github.com/SathyaSeelanG/TinyUrl" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="gap-2">
                                <ExternalLink className="h-4 w-4" />
                                GitHub
                            </Button>
                        </a>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-md">
                        <Input
                            type="text"
                            placeholder="Search endpoints..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Endpoints */}
                <div className="space-y-6">
                    {filteredEndpoints.map((endpoint, idx) => (
                        <Card key={idx} id={endpoint.path}>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge className={`${methodColors[endpoint.method]} text-white`}>
                                                {endpoint.method}
                                            </Badge>
                                            <code className="text-lg font-mono">{endpoint.path}</code>
                                        </div>
                                        <CardTitle className="text-2xl mb-2">{endpoint.title}</CardTitle>
                                        <p className="text-muted-foreground">{endpoint.description}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Request Body */}
                                {endpoint.requestBody && (
                                    <div>
                                        <h4 className="font-semibold mb-3">Request Body</h4>
                                        <div className="space-y-4">
                                            <div className="border rounded-lg overflow-hidden">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-muted">
                                                        <tr>
                                                            <th className="text-left p-3">Field</th>
                                                            <th className="text-left p-3">Type</th>
                                                            <th className="text-left p-3">Required</th>
                                                            <th className="text-left p-3">Description</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {endpoint.requestBody.fields.map((field, fieldIdx) => (
                                                            <tr key={fieldIdx} className="border-t">
                                                                <td className="p-3 font-mono">{field.name}</td>
                                                                <td className="p-3 font-mono text-muted-foreground">{field.type}</td>
                                                                <td className="p-3">
                                                                    <Badge variant={field.required ? "default" : "secondary"}>
                                                                        {field.required ? "Yes" : "No"}
                                                                    </Badge>
                                                                </td>
                                                                <td className="p-3 text-muted-foreground">{field.description}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute top-3 right-3">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => copyToClipboard(endpoint.requestBody!.example, `req-${idx}`)}
                                                    >
                                                        {copiedCode === `req-${idx}` ? (
                                                            <Check className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                                <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto">
                                                    <code>{endpoint.requestBody.example}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Responses */}
                                <div>
                                    <h4 className="font-semibold mb-3">Responses</h4>
                                    <div className="space-y-4">
                                        {endpoint.responses.map((response, resIdx) => (
                                            <div key={resIdx}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge
                                                        variant={response.status === 200 || response.status === 201 || response.status === 302 ? "default" : "destructive"}
                                                    >
                                                        {response.status}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">{response.description}</span>
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute top-3 right-3">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => copyToClipboard(response.example, `res-${idx}-${resIdx}`)}
                                                        >
                                                            {copiedCode === `res-${idx}-${resIdx}` ? (
                                                                <Check className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <Copy className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                    <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                                                        <code>{response.example}</code>
                                                    </pre>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* cURL Example */}
                                <div>
                                    <h4 className="font-semibold mb-3">Example Request</h4>
                                    <div className="relative">
                                        <div className="absolute top-3 right-3">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => copyToClipboard(endpoint.curlExample, `curl-${idx}`)}
                                            >
                                                {copiedCode === `curl-${idx}` ? (
                                                    <Check className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                                            <code>{endpoint.curlExample}</code>
                                        </pre>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredEndpoints.length === 0 && (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <p className="text-muted-foreground">
                                    No endpoints found for "{searchQuery}"
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Footer Info */}
                <Card className="mt-8">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Authentication</h3>
                        <p className="text-muted-foreground mb-4">
                            TinyLink uses <strong>cookie-based user identification</strong>. No API keys or OAuth tokens are required.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• A unique <code>user_id</code> cookie is automatically created on first visit</li>
                            <li>• All links are associated with this user ID</li>
                            <li>• Users can only view and delete their own links</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
