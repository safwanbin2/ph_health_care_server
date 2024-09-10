import { Prisma, Schedule } from "@prisma/client";
import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../utils/prisma";
import calculatePagination from "../../utils/calculatePagination";

const createSchedule = async (
  payload: Schedule & { startTime: string; endTime: string }
) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const interval = 30;
  const schedules = [];

  const startDateRaw = new Date(startDate);
  const endDateRaw = new Date(endDate);

  while (startDateRaw <= endDateRaw) {
    const currentStartDateTimeRaw = new Date(
      addMinutes(
        addHours(
          `${format(startDateRaw, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const currentEndDateTimeRaw = new Date(
      addMinutes(
        addHours(
          `${format(startDateRaw, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (currentStartDateTimeRaw < currentEndDateTimeRaw) {
      const scheduleData = {
        startDate: currentStartDateTimeRaw,
        endDate: addMinutes(currentStartDateTimeRaw, interval),
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

      currentStartDateTimeRaw.setMinutes(
        currentStartDateTimeRaw.getMinutes() + interval
      );
    }

    startDateRaw.setDate(startDateRaw.getDate() + 1);
  }

  return schedules;
};

const getAllSchedules = async (filters: any, options: any) => {
  const { startDate, endDate } = filters;
  const andCondition: Prisma.ScheduleWhereInput[] = [];

  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          startDate: {
            gte: startDate,
          },
        },
        {
          endDate: {
            lte: endDate,
          },
        },
      ],
    });
  }

  const { page, limit, sortBy, sortOrder, skip } = calculatePagination(options);

  const whereCondition: Prisma.ScheduleWhereInput = { AND: andCondition };
  const result = await prisma.schedule.findMany({
    where: whereCondition,
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return result;
};

export const ScheduleService = {
  createSchedule,
  getAllSchedules,
};
