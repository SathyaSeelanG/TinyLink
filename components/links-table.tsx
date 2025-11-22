"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Copy, Check, ExternalLink, Search, X } from "lucide-react"
import { formatDateToIST } from "@/lib/time-utils"

interface LinkData {
  id: string
  code: string
  original_url: string
  click_count: number
  created_at: string
  last_clicked: string | null
}

export function LinksTable({ refresh }: { refresh: number }) {
  const [links, setLinks] = useState<LinkData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [copiedShortLink, setCopiedShortLink] = useState<string | null>(null)
  const [copiedTargetUrl, setCopiedTargetUrl] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true)
      setError("")
      try {
        const response = await fetch("/api/links")
        if (!response.ok) {
          throw new Error("Failed to fetch links")
        }
        const data = await response.json()
        setLinks(data)
      } catch (err) {
        setError("Failed to load links")
      } finally {
        setLoading(false)
      }
    }

    fetchLinks()
  }, [refresh])

  const handleDelete = async (code: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return

    setDeleting(code)
    try {
      const response = await fetch(`/api/links/${code}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Failed to delete link")
      }
      setLinks(links.filter((l) => l.code !== code))
    } catch (err) {
      setError("Failed to delete link")
    } finally {
      setDeleting(null)
    }
  }

  const copyShortLink = async (code: string) => {
    const shortUrl = `${window.location.origin}/${code}`
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopiedShortLink(code)
      setTimeout(() => setCopiedShortLink(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const copyTargetUrl = async (code: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedTargetUrl(code)
      setTimeout(() => setCopiedTargetUrl(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Filter links based on search query
  const filteredLinks = links.filter((link) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      link.code.toLowerCase().includes(query) ||
      link.original_url.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner className="h-6 w-6 mr-2" />
          <span>Loading links...</span>
        </CardContent>
      </Card>
    )
  }

  if (links.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No links created yet. Create your first link using the form above!
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Links</CardTitle>
        <CardDescription>Manage and track your shortened links</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search/Filter */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by code or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredLinks.length} result{filteredLinks.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {filteredLinks.length === 0 && searchQuery ? (
          <div className="py-8 text-center text-muted-foreground">
            No links found matching "{searchQuery}"
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Short Link</TableHead>
                  <TableHead>Target URL</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{link.code}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-muted-foreground">
                          /{link.code}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyShortLink(link.code)}
                          title="Copy short link"
                          className="h-8 px-2"
                        >
                          {copiedShortLink === link.code ? (
                            <>
                              <Check className="h-4 w-4 mr-1 text-green-600" />
                              <span className="text-green-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <a
                          href={link.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate max-w-xs text-sm hover:underline flex items-center gap-1"
                          title={link.original_url}
                        >
                          {link.original_url.length > 40 ? link.original_url.slice(0, 40) + "..." : link.original_url}
                          <ExternalLink className="h-3 w-3 opacity-50" />
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyTargetUrl(link.code, link.original_url)}
                          title="Copy target URL"
                          className="h-8 px-2"
                        >
                          {copiedTargetUrl === link.code ? (
                            <>
                              <Check className="h-4 w-4 mr-1 text-green-600" />
                              <span className="text-green-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{link.click_count}</TableCell>
                    <TableCell className="text-sm">{formatDateToIST(link.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/code/${link.code}`}>
                          <Button variant="outline" size="sm">
                            View Stats
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(link.code)}
                          disabled={deleting === link.code}
                        >
                          {deleting === link.code ? <Spinner className="h-4 w-4" /> : "Delete"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
