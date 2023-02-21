const express = require("express");
const router = express.Router();
const SSLCommerzPayment = require("sslcommerz-lts");
const is_live = false; //true for live, false for sandbox
const sslcz = new SSLCommerzPayment(
  process.env.SSL_STORE_ID,
  process.env.SSL_STORE_PASS,
  is_live
);

router.get("/init", (req, res) => {
  const data = {
    total_amount: 100,
    currency: "BDT",
    tran_id: "REF123", // use unique tran_id for each api call
    success_url: `${process.env.URL}/api/v1/ssl/success`,
    fail_url: `${process.env.URL}/api/v1/ssl/fail`,
    cancel_url: `${process.env.URL}/api/v1/ssl/cancel`,
    ipn_url: `${process.env.URL}/api/v1/ssl/ipn`,
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
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

  sslcz.init(data).then((apiResponse) => {
    let GatewayPageURL = apiResponse.GatewayPageURL;
    // res.redirect(GatewayPageURL);
    if (GatewayPageURL) {
      res.status(200).json({
        message: "success",
        URL: GatewayPageURL,
      });
    } else {
      res.status(400).json({
        status: "Failed",
        message: "SSL session was not successful.",
      });
    }

    console.log("Redirecting to: ", GatewayPageURL);
  });
});


router.post("/success", async (req, res, next) => {
  // return res.status(200).json({
  //   status: "success",
  //   message: "Payment success",
  //   data: req.body,
  // });
  if (req.body?.val_id) {
    sslcz.validate({ val_id: req?.body?.val_id }).then((data) => {
      const {
        status,
        val_id,
        tran_id,
        amount,
        card_type,
        validated_on,
        currency,
      } = data;
      if (status === "VALID") {
        //step-1 <<<<<<<<<<<<<<<<<<save in databse  >>>>>>>>>>>>>>>>>>>

        const data = {
          title: "Payment Completed.",
          heading: "Congratulations! Your payment successfully completed.",
          message: `
          Transantion_Id = ${tran_id}, 
          Total_Amount = ${amount}, 
          Method = ${card_type.split("-")[0]}
          `,
        };
        res.render("../assets/index", data);
      }
    });
  }
    

  
});

router.post("/fail", async (req, res, next) => {
  return res.status(400).json({
    status: "Failed",
    message: "Payment Failed",
    data: req.body,
  });
});

router.post("/cancel", async (req, res, next) => {
  return res.status(401).json({
    status: "cancel",
    message: "Payment cancel",
    data: req.body,
  });
});

router.post("/ipn", async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    message: "Payment success",
    data: req.body,
  });
});

module.exports = router;
