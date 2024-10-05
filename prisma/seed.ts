import { UserRole } from "@prisma/client";
import prisma from "../src/app/utils/prisma";
import bcrypt from "bcrypt";

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });

    if (isExistSuperAdmin) {
      throw new Error("Super Admin Already Exist!");
    }

    const hashedPassword = await bcrypt.hash("superadmin", 10);

    const superAdminResult = await prisma.user.create({
      data: {
        email: "super@admin.com",
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: "Super Admin",
            contactNumber: "0123456789",
          },
        },
      },
    });

    console.log("Super Admin Created!", superAdminResult);
  } catch (error: any) {
    console.log(error?.message || "Something went wrong");
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
