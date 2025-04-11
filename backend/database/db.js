require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

module.exports = {
  sql,
  async executeQuery(query, params = []) {
    try {
      const result = await sql`${query}`;
      return result;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  },
  async testConnection() {
    const result = await sql`SELECT version()`;
    return result[0].version;
  },
};
