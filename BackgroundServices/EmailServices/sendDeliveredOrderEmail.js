import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMail.js";
import Order from "../models/order.model.js";
dotenv.config();

const sendDeliveredOrderEmail = async () => {
  const orders = await Order.find({ status: 2 });
  if (orders.length > 0) {
    for (let order of orders) {
      ejs.renderFile(
        "templates/deliveredorder.ejs",
        {
          name: order.name,
          products: order.products,
        },
        async (err, data) => {
          let messageoptions = {
            from: process.env.EMAIL,
            to: order.email,
            subject: "Your order has been delivered.",
            html: data,
          };

          try {
            await sendMail(messageoptions);
            await Order.findByIdAndUpdate(order._id, { $set: { status: 3 } });
          } catch (error) {
            console.log(error);
          }
        }
      );
    }
  }
};

export default sendDeliveredOrderEmail;
