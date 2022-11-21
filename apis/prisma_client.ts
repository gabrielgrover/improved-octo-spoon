import { PrismaClient } from "@prisma/client";

let prisma_client: PrismaClient | undefined;

export function get_prisma_client() {
  if (prisma_client === undefined && typeof window === "undefined") {
    prisma_client = new PrismaClient();

    return prisma_client;
  }

  return prisma_client;
}
