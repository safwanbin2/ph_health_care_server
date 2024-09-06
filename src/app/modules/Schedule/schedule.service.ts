import { Schedule } from "@prisma/client";

const createSchedule = async (payload: Schedule) => {
  return payload;
};

export const ScheduleService = {
  createSchedule,
};
