import { PrismaClient } from "@prisma/client";
import duckdb from "duckdb";

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const duckDb = globalForPrisma.duckDb || new duckdb.Database(":memory:");
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.duckDb = duckDb;
}

export { prisma, duckDb };
