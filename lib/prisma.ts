import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismaClientSingleton = () => {
  return new PrismaClient()
}

const prismaGlobal = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prismaGlobal