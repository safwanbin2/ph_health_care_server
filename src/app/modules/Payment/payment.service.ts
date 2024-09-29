import axios from "axios";
import config from "../../config";
import prisma from "../../utils/prisma";
import { SSLService } from "../SSL/ssl.service";

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

export const PaymentService = {
  initiatePayment,
};
