import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MetaService } from "./meta.service";

const getMetaData = catchAsync(async (req, res) => {
  const result = await MetaService.getMetaData(req?.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Meta data retrieved!",
    data: result,
  });
});

export const MetaController = {
  getMetaData,
};
