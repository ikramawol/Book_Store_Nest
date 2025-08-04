import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

export async function main() {
  const hash = await bcrypt.hash('123456', 10);
  const hashed = await bcrypt.hash('refresh_token', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {
      username: 'admin',
      hash: hash,
      role: 'ADMIN',
      hashedRt: hashed,
    },
    create: {
      email: 'admin@gmail.com',
      username: 'admin',
      hash: hash,
      role: 'ADMIN',
      hashedRt: hashed,
    },
  });
  console.log('User created:', admin);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
