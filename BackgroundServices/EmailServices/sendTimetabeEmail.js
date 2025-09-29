// EmailServices/sendTimetableEmail.js
import ejs from "ejs";
import dotenv from "dotenv";
import sendMail from "../helpers/sendMail.js";
import Timetable from "../models/timetable.model.js";
import { generateSkincareRoutine } from "./createTimetableEmail.js";
import { generateSkincarePDF } from "./createTimetableEmail.js";

dotenv.config();

const sendTimetableEmail = async () => {
  try {
    // Find pending timetable requests (status: 0)
    const timetableRequests = await Timetable.find({ status: 0 });
    
    if (timetableRequests.length > 0) {
      console.log(`Processing ${timetableRequests.length} timetable requests...`);
      
      for (let request of timetableRequests) {
        let emailSent = false;
        
        try {
          // Generate personalized skincare routine
          const routine = generateSkincareRoutine(
            request.skinType,
            request.concerns,
            request.morningTime,
            request.eveningTime
          );

          // Generate PDF
          const pdfBuffer = await generateSkincarePDF(request, routine);

          // Render email template
          const emailHtml = await ejs.renderFile(
            "templates/timetable.ejs",
            {
              name: request.name,
              skinType: request.skinType,
              concerns: request.concerns,
              morningTime: request.morningTime,
              eveningTime: request.eveningTime,
              products: routine.products,
              weeklySchedule: routine.weeklySchedule,
              instructions: routine.instructions
            }
          );

          // Prepare email with PDF attachment
          const messageOptions = {
            from: process.env.EMAIL,
            to: request.email,
            subject: `Your Personalized Skincare Timetable - ${request.name}`,
            html: emailHtml,
            attachments: [
              {
                filename: `Skincare-Timetable-${request.name.replace(/\s+/g, '-')}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf'
              }
            ]
          };

          // Send email and wait for result
          const result = await sendMail(messageOptions);
          
          if (result.success) {
            // Update request status to processed only if email was sent successfully
            await Timetable.findByIdAndUpdate(request._id, { 
              $set: { 
                status: 1,
                processedAt: new Date()
              } 
            });
            emailSent = true;
            console.log(`Timetable sent successfully to ${request.email}`);
          } else {
            console.error(`Failed to send email to ${request.email}:`, result.error);
            // Don't update status so it can be retried
          }
          
        } catch (error) {
          console.error(`Error processing timetable for ${request.email}:`, error.message);
          
          // If it's a temporary Gmail error, don't mark as processed
          if (error.code === 'EENVELOPE' || error.message.includes('Temporary System Problem')) {
            console.log(`Temporary Gmail error for ${request.email}. Will retry later.`);
          } else {
            // For other errors, you might want to mark as failed after a few attempts
            // Or implement a retry counter
            console.error(`Permanent error for ${request.email}. Marking as failed.`);
            await Timetable.findByIdAndUpdate(request._id, { 
              $set: { 
                status: 2, // 2 = failed
                processedAt: new Date(),
                error: error.message
              } 
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in sendTimetableEmail:", error);
  }
};

export default sendTimetableEmail;