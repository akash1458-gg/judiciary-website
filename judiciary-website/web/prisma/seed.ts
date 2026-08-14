import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const users: {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}[] = [
  {
    email: "staff@court.gov",
    name: "Court Registrar",
    password: "staff123",
    role: "COURT_STAFF",
  },
  {
    email: "admin@court.gov",
    name: "System Admin",
    password: "admin123",
    role: "ADMIN",
  },
  {
    email: "advocate@email.com",
    name: "Adv. Meera Patel",
    password: "advocate123",
    role: "ADVOCATE",
  },
  {
    email: "litigant@email.com",
    name: "Rajesh Kumar",
    password: "litigant123",
    role: "LITIGANT",
  },
];

async function main() {
  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 12);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        passwordHash,
        role: u.role,
        isVerified: true,
      },
      create: {
        email: u.email,
        name: u.name,
        passwordHash,
        role: u.role,
        isVerified: true,
      },
    });
    console.log(`✓ ${u.role}: ${user.email}`);

    if (u.role === "ADVOCATE") {
      await prisma.advocate.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          enrollmentNo: "D/1234/2015",
          barCouncil: "Delhi",
          isActive: true,
        },
      });
    }
  }
}

main()
  .then(() => {
    console.log("Seed complete.");
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
