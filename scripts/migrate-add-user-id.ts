import { neon } from "@neondatabase/serverless"
import * as fs from "fs"
import * as path from "path"

async function runMigration() {
    const dbUrl = process.env.DATABASE_URL

    if (!dbUrl) {
        console.error("DATABASE_URL environment variable is not set")
        process.exit(1)
    }

    const sql = neon(dbUrl)

    try {
        console.log("Running migration to add user_id column...")

        // Check if column exists
        const columnCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'links' AND column_name = 'user_id'
    `

        if (columnCheck.length === 0) {
            console.log("Adding user_id column...")
            await sql`ALTER TABLE links ADD COLUMN user_id VARCHAR(255)`
            console.log("✓ user_id column added")

            console.log("Creating index on user_id...")
            await sql`CREATE INDEX idx_links_user_id ON links(user_id)`
            console.log("✓ Index created")
        } else {
            console.log("user_id column already exists, skipping migration")
        }

        // Count existing links
        const existingLinks = await sql`SELECT COUNT(*) as count FROM links WHERE user_id IS NULL`
        const count = existingLinks[0].count

        if (count > 0) {
            console.log(`⚠ Warning: ${count} existing links found without user_id`)
            console.log("  These links will not appear in any user's dashboard")
            console.log("  They are still accessible via direct URL (/:code)")
        }

        console.log("\n✓ Migration completed successfully!")

    } catch (error) {
        console.error("Migration failed:", error)
        process.exit(1)
    }
}

runMigration()
