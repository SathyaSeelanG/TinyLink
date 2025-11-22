import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StatsContent } from "@/components/stats-content"

export default async function StatsPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back button and title */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              ← Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Link Statistics</h1>
          <p className="text-muted-foreground">Track and manage your shortened link</p>
        </div>

        {/* Stats content - client component */}
        <StatsContent code={code} />
      </div>
    </div>
  )
}
