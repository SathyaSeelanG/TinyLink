    "use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Copy, Check, ExternalLink } from "lucide-react"
import { formatToIST } from "@/lib/time-utils"

interface LinkType {
    id: string
    code: string
    original_url: string
    click_count: number
    created_at: string
    last_clicked: string | null
}

export function StatsContent({ code }: { code: string }) {
    const [link, setLink] = useState<LinkType | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [copiedUrl, setCopiedUrl] = useState(false)
    const [copiedShortLink, setCopiedShortLink] = useState(false)

    useEffect(() => {
        const fetchLink = async () => {
            try {
                const response = await fetch(`/api/links/${code}`)
                if (!response.ok) {
                    if (response.status === 404) {
                        setError("Link not found")
                    } else {
                        setError("Failed to load link details")
                    }
                    return
                }
                const data = await response.json()
                setLink(data)
            } catch (err) {
                setError("Failed to load link details")
            } finally {
                setLoading(false)
            }
        }

        fetchLink()
    }, [code])

    const copyToClipboard = async (text: string, type: 'url' | 'short') => {
        try {
            await navigator.clipboard.writeText(text)
            if (type === 'url') {
                setCopiedUrl(true)
                setTimeout(() => setCopiedUrl(false), 2000)
            } else {
                setCopiedShortLink(true)
                setTimeout(() => setCopiedShortLink(false), 2000)
            }
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner className="h-8 w-8 mr-3" />
                <span className="text-lg">Loading link details...</span>
            </div>
        )
    }

    if (error || !link) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error || "Link not found"}</AlertDescription>
            </Alert>
        )
    }

    const shortUrl = `${window.location.origin}/${link.code}`

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-lg font-mono">{link.code}</code>
                    <span className="text-base font-normal text-muted-foreground">Short Code</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Original URL */}
                <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Original URL</h3>
                    <div className="bg-muted p-4 rounded-lg break-words">
                        <a
                            href={link.original_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground font-mono text-sm hover:underline flex items-center gap-2"
                        >
                            {link.original_url}
                            <ExternalLink className="h-4 w-4 opacity-50 flex-shrink-0" />
                        </a>
                    </div>
                    <Button
                        onClick={() => copyToClipboard(link.original_url, 'url')}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                    >
                        {copiedUrl ? (
                            <>
                                <Check className="mr-2 h-4 w-4 text-green-600" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy URL
                            </>
                        )}
                    </Button>
                </div>

                {/* Short Link */}
                <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Short Link</h3>
                    <div className="bg-muted p-4 rounded-lg">
                        <p className="text-foreground font-mono text-sm break-all">
                            {shortUrl}
                        </p>
                    </div>
                    <Button
                        onClick={() => copyToClipboard(shortUrl, 'short')}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                    >
                        {copiedShortLink ? (
                            <>
                                <Check className="mr-2 h-4 w-4 text-green-600" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Short Link
                            </>
                        )}
                    </Button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Clicks</p>
                        <p className="text-3xl font-bold text-primary">{link.click_count}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Created (IST)</p>
                        <p className="text-sm font-medium">
                            {formatToIST(link.created_at)}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">Last Clicked (IST)</p>
                        <p className="text-sm font-medium">
                            {formatToIST(link.last_clicked)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
