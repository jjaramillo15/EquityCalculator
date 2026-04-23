import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

function ensureDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return;
  }

  const envFiles = [".env.local", ".env"];

  for (const file of envFiles) {
    const filePath = path.join(process.cwd(), file);

    if (!existsSync(filePath)) {
      continue;
    }

    const match = readFileSync(filePath, "utf8").match(
      /^DATABASE_URL=(["']?)(.+)\1$/m,
    );

    if (!match) {
      continue;
    }

    process.env.DATABASE_URL = match[2];
    return;
  }
}

ensureDatabaseUrl();

const globalForPrisma = globalThis as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
