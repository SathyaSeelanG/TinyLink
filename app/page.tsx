"use client"

import { useState } from "react"
import { LinkForm } from "@/components/link-form"
import { LinksTable } from "@/components/links-table"

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Main content */}
        <div className="space-y-8">
          {/* Link creation form */}
          <div className="lg:max-w-2xl mx-auto w-full">
            <LinkForm onSuccess={() => setRefreshTrigger((prev) => prev + 1)} />
          </div>

          {/* Links table */}
          <LinksTable refresh={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}
