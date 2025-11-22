// import { neon } from "@neondatabase/serverless"

// const sql = neon(process.env.DATABASE_URL || "")

// export { sql }
import { neon } from "@neondatabase/serverless"

let sql: any = null;

// This ensures this code only runs on the server
if (typeof window === 'undefined') {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    throw new Error(`
      DATABASE_URL is not set in environment variables.
      Make sure you have a .env.local file in your project root with:
      DATABASE_URL=your_connection_string
    `);
  }

  const cleanDbUrl = dbUrl.replace(/^"|"$/g, '');
  console.log('Using database URL:', cleanDbUrl.substring(0, 20) + '...');
  sql = neon(cleanDbUrl);
}

export { sql }