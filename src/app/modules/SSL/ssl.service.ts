import axios from "axios";
import config from "../../config";

const initPayment = async (paymentData: any) => {
  const data = {
    store_id: config.store_id,
    store_passwd: config.store_password,
    total_amount: paymentData?.amount,
    currency: "BDT",
    tran_id: paymentData?.transactionId, // use unique tran_id for each api call
    success_url: "http://localhost:3030/success",
    fail_url: "http://localhost:3030/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Service",
    product_category: "Service",
    product_profile: "general",
    cus_name: paymentData?.name,
    cus_email: paymentData?.email,
    cus_add1: paymentData?.address,
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const response = await axios({
    method: "post",
    url: "https://sandbox.sslcommerz.com/gwprocess/v3/api.php",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data,
  });

  return response;
};

export const SSLService = {
  initPayment,
};
