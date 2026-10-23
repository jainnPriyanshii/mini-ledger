import { Pool } from "pg";
import { config } from "../config";

let pool: Pool | null = null;
let isConnectedToPostgres = false;

if (config.databaseUrl && config.databaseUrl.trim() !== "") {
  try {
    const isLocalhost =
      config.databaseUrl.includes("localhost") ||
      config.databaseUrl.includes("127.0.0.1");

    pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
    });

    pool.on("error", (err) => {
      console.error("[PostgreSQL Pool Error]:", err.message);
    });
  } catch (error) {
    console.warn(
      "[Database Warning] Could not initialize PostgreSQL Pool:",
      error
    );
    pool = null;
  }
}

export async function testDbConnection(): Promise<boolean> {
  if (!pool) {
    console.log(
      "[MiniLedger DB] No DATABASE_URL provided. Operating in in-memory mode for development."
    );
    return false;
  }

  try {
    const client = await pool.connect();
    try {
      await client.query("SELECT 1");
      isConnectedToPostgres = true;
      console.log("[MiniLedger DB] Successfully connected to PostgreSQL / Supabase!");
      return true;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.warn(
      `[MiniLedger DB] Warning: Failed to connect to PostgreSQL (${error?.message || error}). Falling back to in-memory mode.`
    );
    isConnectedToPostgres = false;
    return false;
  }
}

export function isUsingPostgres(): boolean {
  return isConnectedToPostgres && pool !== null;
}

export { pool };
