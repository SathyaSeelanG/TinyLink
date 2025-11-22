"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Book,
    Code,
    Database,
    Layers,
    Settings,
    Users,
    Zap,
    ChevronRight,
    Home,
    FileCode,
    Layout,
    Search
} from "lucide-react"
import { Input } from "@/components/ui/input"

const sections = [
    {
        id: "overview",
        title: "Overview",
        icon: Book,
        content: `TinyLink is a modern, full-stack URL shortener built with Next.js 16. It allows users to create short, shareable links, track click analytics, and manage their links through an intuitive dashboard.`
    },
    {
        id: "features",
        title: "Features",
        icon: Zap,
        subsections: [
            {
                title: "Link Shortening",
                content: "Convert long URLs into short, memorable links with custom codes or auto-generated ones."
            },
            {
                title: "Click Analytics",
                content: "Track total clicks per link and view last clicked timestamps."
            },
            {
                title: "Link Management",
                content: "View, search, copy, and delete your links from an intuitive dashboard."
            },
            {
                title: "Stats Page",
                content: "Detailed analytics view for individual links with copy functionality."
            },
            {
                title: "Search & Filter",
                content: "Filter links by code or URL with real-time search results."
            }
        ]
    },
    {
        id: "architecture",
        title: "Architecture",
        icon: Layers,
        subsections: [
            {
                title: "Frontend",
                content: "Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and shadcn/ui components."
            },
            {
                title: "Backend",
                content: "Next.js API Routes with Node.js runtime and PostgreSQL database."
            },
            {
                title: "Database",
                content: "Neon Serverless PostgreSQL with optimized schema and indexes."
            }
        ]
    },
    {
        id: "pages",
        title: "Pages",
        icon: Layout,
        subsections: [
            {
                title: "Dashboard (/)",
                content: "Main page for creating and managing links with search and filter functionality."
            },
            {
                title: "Stats Page (/code/:code)",
                content: "Detailed analytics for a specific link including clicks and timestamps."
            },
            {
                title: "Health Check (/healthz)",
                content: "API health monitoring endpoint returning status and version."
            },
            {
                title: "Redirect (/:code)",
                content: "Redirects from short links to original URLs while tracking clicks."
            }
        ]
    },
    {
        id: "database",
        title: "Database Schema",
        icon: Database,
        content: `The links table stores all shortened URLs with the following columns:
    
• id (UUID) - Primary key
• code (VARCHAR) - Short code (6-8 chars)
• original_url (TEXT) - Original long URL
• click_count (INTEGER) - Number of clicks
• created_at (TIMESTAMP) - Creation time
• last_clicked (TIMESTAMP) - Last click time
• user_id (UUID) - Owner's user ID

Indexes are created on code, user_id, and created_at for optimal query performance.`
    },
    {
        id: "user-guide",
        title: "User Guide",
        icon: Users,
        subsections: [
            {
                title: "Creating a Short Link",
                content: "1. Enter your long URL\n2. Optionally enter a custom code (6-8 alphanumeric)\n3. Click 'Create Link'\n4. Copy or share your new short URL"
            },
            {
                title: "Copying Links",
                content: "Click the copy button next to any short link or target URL. The button will show 'Copied!' for confirmation."
            },
            {
                title: "Viewing Stats",
                content: "Click 'View Stats' on any link to see detailed analytics including total clicks and timestamps."
            },
            {
                title: "Searching Links",
                content: "Use the search box to filter links by code or URL. Results update in real-time."
            },
            {
                title: "Deleting Links",
                content: "Click the red 'Delete' button and confirm to permanently remove a link."
            }
        ]
    },
    {
        id: "developer",
        title: "Developer Guide",
        icon: Settings,
        subsections: [
            {
                title: "Setup",
                content: "1. Clone the repository\n2. Run 'npm install'\n3. Set up .env.local with DATABASE_URL\n4. Run 'npm run dev'"
            },
            {
                title: "Project Structure",
                content: "• app/ - Next.js App Router pages and API routes\n• components/ - React components\n• lib/ - Utility functions and helpers\n• public/ - Static assets"
            },
            {
                title: "Code Style",
                content: "• TypeScript strict mode\n• Functional components with hooks\n• PascalCase for components\n• camelCase for functions"
            }
        ]
    }
]

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("overview")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredSections = sections.filter(section =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.subsections?.some(sub =>
            sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )

    return (
        <div className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-foreground transition-colors">
                            <Home className="h-4 w-4" />
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span>Documentation</span>
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">Application Documentation</h1>
                    <p className="text-muted-foreground mb-6">
                        Complete guide to understanding and using TinyLink
                    </p>

                    {/* Quick Links */}
                    <div className="flex gap-3 mb-6">
                        <Link href="/docs/api">
                            <Button variant="outline" className="gap-2">
                                <FileCode className="h-4 w-4" />
                                API Documentation
                            </Button>
                        </Link>
                        <a href="https://github.com/SathyaSeelanG/TinyUrl" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="gap-2">
                                <Code className="h-4 w-4" />
                                View on GitHub
                            </Button>
                        </a>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search documentation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-1">
                        <Card className="sticky top-20">
                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-4">Contents</h3>
                                <nav className="space-y-1">
                                    {filteredSections.map((section) => {
                                        const Icon = section.icon
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => setActiveSection(section.id)}
                                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${activeSection === section.id
                                                        ? "bg-primary text-primary-foreground"
                                                        : "hover:bg-muted"
                                                    }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {section.title}
                                            </button>
                                        )
                                    })}
                                </nav>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        {filteredSections.map((section) => {
                            const Icon = section.icon
                            if (section.id !== activeSection) return null

                            return (
                                <Card key={section.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <h2 className="text-3xl font-bold">{section.title}</h2>
                                        </div>

                                        {section.content && (
                                            <div className="prose prose-slate max-w-none mb-6">
                                                <p className="text-muted-foreground whitespace-pre-line">
                                                    {section.content}
                                                </p>
                                            </div>
                                        )}

                                        {section.subsections && (
                                            <div className="space-y-6">
                                                {section.subsections.map((subsection, idx) => (
                                                    <div key={idx} className="border-l-4 border-primary/30 pl-4">
                                                        <h3 className="text-xl font-semibold mb-2">{subsection.title}</h3>
                                                        <p className="text-muted-foreground whitespace-pre-line">
                                                            {subsection.content}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}

                        {filteredSections.length === 0 && (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <p className="text-muted-foreground">
                                        No results found for "{searchQuery}"
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
