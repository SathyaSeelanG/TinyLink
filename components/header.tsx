import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Link2, Home, BookOpen, Activity } from "lucide-react"

export function Header() {
    return (
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                            <Link2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                TinyLink
                            </h1>
                            <p className="text-xs text-muted-foreground hidden sm:block">URL Shortener</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-2">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Home className="h-4 w-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Button>
                        </Link>
                        <Link href="/docs">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <BookOpen className="h-4 w-4" />
                                <span className="hidden sm:inline">Docs</span>
                            </Button>
                        </Link>
                        <Link href="/healthz" target="_blank">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Activity className="h-4 w-4" />
                                <span className="hidden sm:inline">Health</span>
                            </Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
