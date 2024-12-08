// const { PrismaClient } = require("@prisma/client");
import prisma from "../src/Configs/connect.js";
import auth from "../src/Utils/auth.js";
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
import bcrypt from "bcrypt";

async function main() {
  // Generate authentication token
  const token = {
    username: "razeth",
    email: "seth.razeth@gmail.com",
  };
  // Hash password
  const hashedPassword = bcrypt.hashSync("Cocacola1!", 12);
  const razeth = await prisma.user.upsert({
    where: { email: "seth.razeth@gmail.com" },
    update: {},
    create: {
      username: "razeth",
      email: "seth.razeth@gmail.com",
      password: hashedPassword,
      avatar:
        "https://i.pinimg.com/736x/36/08/fe/3608fede746d1d6b429e58b945a90e1a.jpg",
      profile: {
        create: {
          first_name: "Piseth",
          last_name: "Mam",
          sex: "Male",
          dob: new Date("1993-07-20"),
          pob: "ព្រៃវែង",
          address: "ភ្នំពេញ",
          phone: "015 69 79 27",
          married: true,
          bio: "",
          createdBy: 1,
          lastUpdatedBy: 1,
        },
      },
      role: "SUPER_ADMIN",
      refreshTokens: {
        create: {
          token: auth.generateRefreshToken(token),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      createdBy: 1,
      lastUpdatedBy: 1,
      auditTrail: {
        create: {
          action: "REGISTER_SUPER_ADMIN",
          timestamp: new Date(),
          ipAddress: "LOCALHOST",
          description: "DEFAULT_ADMIN",
        },
      },
    },
  });

  console.log({ razeth });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
