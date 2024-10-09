/** @type { import("drizzle-kit").Config } */

const cfg = {
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  tablesFilter: ["weirdgee_*"],
  out: "./drizzle",
};

export default cfg;
