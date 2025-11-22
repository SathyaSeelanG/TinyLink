import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Link not found</p>
        <p className="text-muted-foreground mb-8">
          The short link you're looking for doesn't exist or has been deleted.
        </p>
        <Link href="/">
          <Button size="lg">Return to Dashboard</Button>
        </Link>
      </div>
    </main>
  )
}
