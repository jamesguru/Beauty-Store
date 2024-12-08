import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMail.js";
import User from "../models/user.model.js";
dotenv.config();

const sendWelcomeEmail = async () => {
  const users = await User.find({ status: 0 });
  if (users.length > 0) {
    for (let user of users) {
      ejs.renderFile(
        "templates/welcome.ejs",
        { name: user.name },
        async (err, data) => {
          let messageoptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Welcome to Beauty Bliss",
            html: data,
          };

          try {
            await sendMail(messageoptions);
            await User.findByIdAndUpdate(user._id, { $set: { status: 1 } });
          } catch (error) {
            console.log(error);
          }
        }
      );
    }
  }
};

export default sendWelcomeEmail;
