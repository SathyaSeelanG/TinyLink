import Link from "next/link"
import { Github, Heart, ExternalLink } from "lucide-react"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t bg-white/50 backdrop-blur-sm mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-3">TinyLink</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            A simple, fast, and free URL shortener with click tracking.
                            Shorten your links and share them easily.
                        </p>
                        {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Made with</span>
                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                            <span>using Next.js</span>
                        </div> */}
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/api" className="text-muted-foreground hover:text-foreground transition-colors">
                                    API Reference
                                </Link>
                            </li>
                            <li>
                                <Link href="/healthz" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                                    Health Check
                                    <ExternalLink className="h-3 w-3" />
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/SathyaSeelanG/TinyUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                                >
                                    GitHub Repository
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Technology Stack */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-3">Technology</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Next.js 16 (App Router)</li>
                            <li>• PostgreSQL (Neon)</li>
                            <li>• TypeScript</li>
                            <li>• Tailwind CSS</li>
                            <li>• shadcn/ui</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} TinyLink. All rights reserved.
                    </p>
                    <a
                        href="https://github.com/SathyaSeelanG/TinyUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Github className="h-4 w-4" />
                        <span>View on GitHub</span>
                    </a>
                </div>
            </div>
        </footer>
    )
}
