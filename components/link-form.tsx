"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Copy, Share2, Check, ExternalLink } from "lucide-react"

interface LinkFormProps {
  onSuccess: () => void
}

export function LinkForm({ onSuccess }: LinkFormProps) {
  const [url, setUrl] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [createdLink, setCreatedLink] = useState<{ code: string; shortUrl: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCreatedLink(null)
    setLoading(true)

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          code: code.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create link")
        return
      }

      // Create the full short URL
      const shortUrl = `${window.location.origin}/${data.code}`
      setCreatedLink({ code: data.code, shortUrl })
      setUrl("")
      setCode("")

      // Refresh the links table after a short delay
      setTimeout(() => {
        onSuccess()
      }, 500)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!createdLink) return

    try {
      await navigator.clipboard.writeText(createdLink.shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleShare = async () => {
    if (!createdLink) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Short Link",
          text: `Check out this link: ${createdLink.shortUrl}`,
          url: createdLink.shortUrl,
        })
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } catch (err) {
        // User cancelled or share failed
        console.log("Share cancelled or failed:", err)
      }
    } else {
      // Fallback: copy to clipboard
      handleCopy()
    }
  }

  const handleCreateAnother = () => {
    setCreatedLink(null)
    setCopied(false)
    setShared(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Short Link</CardTitle>
        <CardDescription>Enter a URL to shorten and optionally customize the code</CardDescription>
      </CardHeader>
      <CardContent>
        {createdLink ? (
          <div className="space-y-4">
            {/* Success message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <Check className="h-5 w-5" />
                <span className="font-semibold">Link created successfully!</span>
              </div>
              <p className="text-sm text-green-600">Your short link is ready to share</p>
            </div>

            {/* Short URL display with copy and share */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">Your Short URL</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    value={createdLink.shortUrl}
                    readOnly
                    className="pr-10 font-mono text-sm bg-muted/50"
                  />
                  <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1"
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={handleShare}
                  variant="outline"
                  className="flex-1"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Create another link button */}
            <Button
              type="button"
              onClick={handleCreateAnother}
              className="w-full"
              variant="default"
            >
              Create Another Link
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <Input
                type="url"
                placeholder="https://example.com/very/long/url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Custom Code (optional)</label>
              <Input
                type="text"
                placeholder="abc123 (6-8 lowercase letters or digits)"
                value={code}
                onChange={(e) => setCode(e.target.value.toLowerCase())}
                maxLength={8}
                disabled={loading}
                pattern="[a-z0-9]{6,8}"
                title="Enter 6-8 lowercase letters or digits"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Creating...
                </>
              ) : (
                "Create Link"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
