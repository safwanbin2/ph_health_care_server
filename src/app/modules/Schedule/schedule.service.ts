import { Schedule } from "@prisma/client";
import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../utils/prisma";

const createSchedule = async (
  payload: Schedule & { startTime: string; endTime: string }
) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const interval = 30;
  const schedules = [];

  const startDateRaw = new Date(startDate);
  const endDateRaw = new Date(endDate);

  while (startDateRaw <= endDateRaw) {
    const startDateTimeRaw = new Date(
      addMinutes(
        addHours(
          `${format(startDateRaw, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTimeRaw = new Date(
      addMinutes(
        addHours(
          `${format(startDateRaw, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTimeRaw < endDateTimeRaw) {
      const scheduleData = {
        startDate: startDateTimeRaw,
        endDate: addMinutes(startDateTimeRaw, interval),
      };

      const isExist = await prisma.schedule.findFirst({
        where: {
          startDate: scheduleData.startDate,
          endDate: scheduleData.endDate,
        },
      });
      if (!isExist) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      startDateTimeRaw.setMinutes(startDateTimeRaw.getMinutes() + interval);
    }

    startDateRaw.setDate(startDateRaw.getDate() + 1);
  }

  return schedules;
};

export const ScheduleService = {
  createSchedule,
};
