import prisma from "../../utils/prisma";

const createDoctorSchedule = async (user: any, payload: any) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const scheduleData = payload?.scheduleIds.map((id) => ({
    doctorId: doctorData?.id,
    scheduleId: id,
  }));

  console.log(scheduleData);

  const result = await prisma.doctorSchedules.createMany({
    data: scheduleData,
  });

  return result;
};

export const DoctorScheduleService = {
  createDoctorSchedule,
};
