import axios from "axios";
import config from "../../config";
import prisma from "../../utils/prisma";
import { SSLService } from "../SSL/ssl.service";
import AppEror from "../../errors/AppError";
import httpStatus from "http-status";
import { PaymentStaus } from "@prisma/client";

const initiatePayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  const paymentInitData = {
    amount: paymentData?.amount,
    transactionId: paymentData?.transactionId,
    name: paymentData?.appointment?.patient?.name,
    email: paymentData?.appointment?.patient?.email,
    address: paymentData?.appointment?.patient?.address,
  };

  const result = await SSLService.initPayment(paymentInitData);

  return {
    payment_url: result?.data?.GatewayPageURL,
  };
};

const validatePayment = async (payload: any) => {
  if (!payload || !payload.status || payload.status !== "VALID") {
    throw new AppEror(httpStatus.BAD_REQUEST, "Invalid payment status");
  }

  const { data } = await axios({
    method: "GET",
    url: `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${payload?.val_id}&store_id=${config.store_id}&store_passwd=${config.store_password}&format=json`,
  });

  if (data?.status !== "VALIDATED") {
    throw new AppEror(httpStatus.BAD_REQUEST, "Payment is not valid");
  }

  await prisma.$transaction(async (tx) => {
    const updatePaymentData = await tx.payment.update({
      where: {
        transactionId: data?.tran_id,
      },
      data: {
        status: PaymentStaus.PAID,
        paymentGatewayData: data,
      },
    });

    await tx.appointment.update({
      where: {
        id: updatePaymentData.appointmentId,
      },
      data: {
        paymentStatus: PaymentStaus.PAID,
      },
    });
  });

  return {
    message: "Payment successfull!",
  };
};

export const PaymentService = {
  initiatePayment,
  validatePayment,
};
