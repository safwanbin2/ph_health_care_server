import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdmin = async (query: any) => {
  console.log(query);
  const result = await prisma.admin.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query?.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query?.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  return result;
};

export const AdminService = {
  getAllAdmin,
};
