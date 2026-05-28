const nodemailer = require("nodemailer");

/* --------------------------------------------------
   EMAIL TRANSPORTER
-------------------------------------------------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* --------------------------------------------------
   VERIFY EMAIL CONFIG
-------------------------------------------------- */
transporter.verify((error, success) => {

  if (error) {

    console.log("❌ EMAIL CONFIG ERROR");
    console.log(error);

  } else {

    console.log("✅ EMAIL SERVER READY");

  }

});

/* --------------------------------------------------
   WELCOME EMAIL (ENHANCED)
-------------------------------------------------- */
const sendWelcomeEmail = async ({
  name,
  email,
  password,
  phoneNo
}) => {

  try {

    console.log("📧 SENDING WELCOME EMAIL TO:", email);

    const mailOptions = {

      from: `"CDS Premier League" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: "Welcome to CDS Premier League - Captain Account Created",

      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to CDS Premier League</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7fa;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header Section -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px 16px 0 0; padding: 40px 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🏏 Welcome to CDS Premier League!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Your Captain Account is Ready</p>
            </div>
            
            <!-- Content Section -->
            <div style="background: white; border-radius: 0 0 16px 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hello <strong style="color: #667eea;">${name}</strong>,
              </p>
              
              <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                Your captain account has been successfully created. You're now ready to lead your team in the 
                most exciting cricket tournament of the season!
              </p>
              
              <!-- Credentials Card -->
              <div style="background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #4CAF50;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">🔑 Login Credentials</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e0e0e0;">
                  <span style="color: #666;">Email Address:</span>
                  <span style="color: #333; font-weight: 600;">${email}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e0e0e0;">
                  <span style="color: #666;">Password:</span>
                  <span style="color: #333; font-weight: 600; font-family: monospace; font-size: 14px;">${password}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Phone Number:</span>
                  <span style="color: #333; font-weight: 500;">${phoneNo}</span>
                </div>
              </div>
              
              <!-- Important Security Note -->
              <div style="background: #fff3e0; border-radius: 12px; padding: 15px; margin-bottom: 25px; border-left: 4px solid #ff9800;">
                <p style="margin: 0; color: #e65100; font-size: 13px;">
                  <strong>🔒 Security Tip:</strong> Please change your password after first login for security purposes.
                  Never share your credentials with anyone.
                </p>
              </div>
              
              <!-- Quick Actions -->
              <div style="background: #e8f5e9; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px 0; color: #2e7d32; font-size: 15px;">⚡ Quick Actions</h3>
                <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
                  <li>Create your team squad</li>
                  <li>Book practice slots</li>
                  <li>View match schedule</li>
                  <li>Upload player documents</li>
                </ul>
              </div>
              
              <!-- Action Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/login" 
                   style="background: #4CAF50; color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  Login to Dashboard →
                </a>
              </div>
              
              <!-- Need Help -->
              <div style="border-top: 1px solid #e0e0e0; margin-top: 25px; padding-top: 20px; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">
                  Need assistance? Contact us:
                </p>
                <p style="color: #666; font-size: 13px; margin: 0;">
                  📞 +91 98765 43210 | ✉️ captainsupport@cdspl.com
                </p>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #aaa; font-size: 11px;">
                © 2025 CDS Premier League. All rights reserved.
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ WELCOME EMAIL SENT");
    console.log(info.messageId);

    return info;

  } catch (error) {

    console.log("❌ WELCOME EMAIL FAILED");
    console.log(error);
    throw error;
  }
};

/* --------------------------------------------------
   SLOT BOOKING EMAIL (ENHANCED)
-------------------------------------------------- */
const sendBookingEmail = async ({
  to,
  teamName,
  slotDate,
  startTime,
  endTime,
  groundName,
  bookingId,
  amount
}) => {

  try {

    console.log("📧 SENDING BOOKING EMAIL:", to);

    const subject = `Slot Booking Confirmed | ${slotDate} | ${groundName}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7fa;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <!-- Header Section -->
          <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); border-radius: 16px 16px 0 0; padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">✅ Booking Confirmed!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Your slot has been successfully booked</p>
          </div>
          
          <!-- Content Section -->
          <div style="background: white; border-radius: 0 0 16px 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <div style="text-align: center; margin-bottom: 25px;">
              <div style="background: #e8f5e9; border-radius: 50px; padding: 8px 20px; display: inline-block;">
                <span style="color: #2e7d32; font-weight: 600;">🎫 Booking ID: ${bookingId || 'N/A'}</span>
              </div>
            </div>
            
            <!-- Booking Details Card -->
            <div style="background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px; text-align: center;">📋 Booking Details</h3>
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
                <span style="color: #666;">🏏 Team Name:</span>
                <span style="color: #333; font-weight: 600;">${teamName}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
                <span style="color: #666;">📅 Date:</span>
                <span style="color: #333; font-weight: 600;">${slotDate}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
                <span style="color: #666;">⏰ Time:</span>
                <span style="color: #333; font-weight: 600;">${startTime} - ${endTime}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
                <span style="color: #666;">🏟️ Ground:</span>
                <span style="color: #333; font-weight: 600;">${groundName}</span>
              </div>
              
              ${amount ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">💰 Amount Paid:</span>
                <span style="color: #2e7d32; font-weight: 700; font-size: 18px;">₹${amount}</span>
              </div>
              ` : ''}
            </div>
            
            <!-- Important Information -->
            <div style="background: #e3f2fd; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
              <h3 style="margin: 0 0 10px 0; color: #1976d2; font-size: 15px;">📌 Important Instructions</h3>
              <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
                <li>Please arrive 30 minutes before your scheduled time</li>
                <li>Carry a printed copy of this booking confirmation</li>
                <li>Bring your own equipment (bat, ball, pads, gloves)</li>
                <li>Follow ground rules and maintain sportsmanship</li>
              </ul>
            </div>
            
            <!-- Action Buttons -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/my-bookings" 
                 style="background: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin: 0 5px;">
                View My Bookings
              </a>
              <a href="${process.env.FRONTEND_URL}/grounds/${groundName.toLowerCase().replace(/\s/g, '-')}" 
                 style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin: 0 5px;">
                Ground Details
              </a>
            </div>
            
            <!-- Contact Support -->
            <div style="border-top: 1px solid #e0e0e0; margin-top: 25px; padding-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                For rescheduling or cancellations, please contact support at least 24 hours in advance.
              </p>
              <p style="color: #666; font-size: 13px; margin: 10px 0 0;">
                📞 Support: +91 98765 43210 | ✉️ bookings@cdspl.com
              </p>
            </div>
            
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #aaa; font-size: 11px;">
              © 2025 CDS Premier League. All rights reserved.
            </p>
          </div>
          
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({

      from: `"CDS Premier League" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html

    });

    console.log("✅ BOOKING EMAIL SENT");
    console.log(info.messageId);

    return info;

  } catch (error) {

    console.log("❌ BOOKING EMAIL FAILED");
    console.log(error);
    throw error;
  }
};

/* --------------------------------------------------
   PLAYER VERIFICATION EMAIL (ENHANCED)
-------------------------------------------------- */
const sendPlayerVerificationEmail = async ({
  name,
  email,
  paymentStatus,
  utrNumber,
  amount,
  paymentDate,
  reason,
  playerId
}) => {

  try {

    console.log("📧 PLAYER EMAIL FUNCTION START");
    console.log("EMAIL:", email);
    console.log("STATUS:", paymentStatus);

    let subject = "";
    let html = "";
    let buttonColor = "";
    let statusBadgeColor = "";
    let statusText = "";
    let statusIcon = "";

    /* =========================
       VERIFIED
    ========================= */
    if (paymentStatus === "verified") {
      subject = "🎉 JPL Registration Verified! - Payment Confirmed";
      buttonColor = "#4CAF50";
      statusBadgeColor = "#4CAF50";
      statusText = "VERIFIED";
      statusIcon = "✅";
      
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration Verified - JPL</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7fa;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header Section -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px 16px 0 0; padding: 40px 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🎉 Registration Verified!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Junior Premier League 2025</p>
            </div>
            
            <!-- Content Section -->
            <div style="background: white; border-radius: 0 0 16px 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Status Badge -->
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="background: ${statusBadgeColor}; color: white; padding: 8px 20px; border-radius: 50px; font-size: 14px; font-weight: 600; display: inline-block;">
                  ${statusIcon} ${statusText}
                </span>
              </div>
              
              ${playerId ? `
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="background: #f0f2f5; color: #667eea; padding: 5px 15px; border-radius: 50px; font-size: 12px; font-weight: 600;">
                  Player ID: ${playerId}
                </span>
              </div>
              ` : ''}
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hello <strong style="color: #667eea;">${name}</strong>,
              </p>
              
              <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                Thank you for registering for the Junior Premier League! 🏏
                We're excited to inform you that your registration has been <strong style="color: #4CAF50;">VERIFIED</strong>
                and your payment has been confirmed successfully.
              </p>
              
              <!-- Payment Details Card -->
              <div style="background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; border-left: 4px solid ${buttonColor};">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">💰 Payment Details</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">UTR Number:</span>
                  <span style="color: #333; font-weight: 600; font-family: monospace; font-size: 14px;">${utrNumber || 'N/A'}</span>
                </div>
                ${amount ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">Amount Paid:</span>
                  <span style="color: #2e7d32; font-weight: 700; font-size: 18px;">₹${amount}</span>
                </div>
                ` : ''}
                ${paymentDate ? `
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Payment Date:</span>
                  <span style="color: #333; font-weight: 500;">${new Date(paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                ` : ''}
              </div>
              
              <!-- Next Steps -->
              <div style="background: #e8f5e9; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px 0; color: #2e7d32; font-size: 16px;">📋 Next Steps</h3>
                <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
                  <li>You will receive the match schedule within 48 hours</li>
                  <li>Keep your ID proof ready for verification at the venue</li>
                  <li>Join our WhatsApp group for team updates (link below)</li>
                  <li>Check your email for tournament guidelines</li>
                </ul>
              </div>
              
              <!-- Tournament Schedule Preview -->
              <div style="background: #fff9c4; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px 0; color: #f57f17; font-size: 15px;">🏆 Tournament Schedule</h3>
                <p style="margin: 0; color: #555; font-size: 13px;">
                  <strong>Start Date:</strong> March 15, 2025<br>
                  <strong>Venue:</strong> CDS Sports Complex, Mumbai<br>
                  <strong>Opening Ceremony:</strong> March 14, 2025 at 6:00 PM
                </p>
              </div>
              
              <!-- Important Info -->
              <div style="background: #fff3e0; border-radius: 12px; padding: 15px; margin-bottom: 25px; border-left: 4px solid #ff9800;">
                <p style="margin: 0; color: #e65100; font-size: 13px;">
                  <strong>⚠️ Important:</strong> Please carry a printed copy of this email along with a valid ID proof on match day.
                  Digital copies are also accepted.
                </p>
              </div>
              
              <!-- Action Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'https://yourwebsite.com'}/player/dashboard" 
                   style="background: ${buttonColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  Go to Dashboard →
                </a>
              </div>
              
              <!-- Social Links -->
              <div style="text-align: center; margin: 20px 0;">
                <a href="#" style="display: inline-block; margin: 0 10px; color: #25D366; text-decoration: none; font-size: 14px;">📱 Join WhatsApp Group</a>
                <a href="#" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-size: 14px;">📄 Rules & Regulations</a>
              </div>
              
              <!-- Contact Info -->
              <div style="border-top: 1px solid #e0e0e0; margin-top: 25px; padding-top: 20px; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">
                  For any queries, contact us at:
                </p>
                <p style="color: #666; font-size: 13px; margin: 0;">
                  📞 +91 98765 43210 | ✉️ support@jpl.com
                </p>
                <p style="color: #666; font-size: 13px; margin: 5px 0 0;">
                  🕐 Mon-Sat: 10 AM - 7 PM | Sun: 10 AM - 2 PM
                </p>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #aaa; font-size: 11px; margin: 5px 0;">
                © 2025 Junior Premier League. All rights reserved.
              </p>
              <p style="color: #aaa; font-size: 10px;">
                This is a system generated email, please do not reply.
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `;
    }

    /* =========================
       REJECTED (ENHANCED)
    ========================= */
    if (paymentStatus === "rejected") {
      subject = "⚠️ JPL Registration Update - Action Required";
      buttonColor = "#dc3545";
      statusBadgeColor = "#dc3545";
      statusText = "REJECTED";
      statusIcon = "⚠️";
      
      const rejectionReason = reason || "Payment verification failed. Please check the payment details and try again.";
      
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration Status - JPL</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7fa;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header Section -->
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #c92a2a 100%); border-radius: 16px 16px 0 0; padding: 40px 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">⚠️ Registration Status</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Junior Premier League 2025</p>
            </div>
            
            <!-- Content Section -->
            <div style="background: white; border-radius: 0 0 16px 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Status Badge -->
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="background: ${statusBadgeColor}; color: white; padding: 8px 20px; border-radius: 50px; font-size: 14px; font-weight: 600; display: inline-block;">
                  ${statusIcon} ${statusText}
                </span>
              </div>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hello <strong style="color: #667eea;">${name}</strong>,
              </p>
              
              <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                We regret to inform you that your registration for the Junior Premier League has been 
                <strong style="color: #dc3545;">REJECTED</strong> due to the following reason(s):
              </p>
              
              <!-- Rejection Reason Card -->
              <div style="background: #fff5f5; border-radius: 12px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #dc3545;">
                <h3 style="margin: 0 0 10px 0; color: #c92a2a; font-size: 16px;">❌ Rejection Reason</h3>
                <p style="margin: 0; color: #555; line-height: 1.6;">${rejectionReason}</p>
              </div>
              
              ${utrNumber ? `
              <div style="background: #f8f9fa; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  <strong>UTR Number provided:</strong> ${utrNumber}
                </p>
              </div>
              ` : ''}
              
              <!-- Action Steps -->
              <div style="background: #fff3cd; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px 0; color: #856404; font-size: 16px;">📌 What you can do next:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
                  <li>Verify your payment details and UTR number</li>
                  <li>Make a fresh payment with correct details</li>
                  <li>Contact our support team for assistance</li>
                  <li>Re-submit your registration form</li>
                </ul>
              </div>
              
              <!-- Bank Details for Payment -->
              <div style="background: #e3f2fd; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px 0; color: #1976d2; font-size: 15px;">🏦 Payment Details (for fresh payment)</h3>
                <p style="margin: 5px 0; color: #555; font-size: 13px;">
                  <strong>Bank:</strong> HDFC Bank<br>
                  <strong>Account Name:</strong> Junior Premier League<br>
                  <strong>Account Number:</strong> 50200012345678<br>
                  <strong>IFSC Code:</strong> HDFC0001234<br>
                  <strong>Amount:</strong> ₹999
                </p>
              </div>
              
              <!-- Support Info -->
              <div style="background: linear-gradient(135deg, #e8f0fe 0%, #d4e4fc 100%); border-radius: 12px; padding: 15px; margin-bottom: 25px; text-align: center;">
                <p style="margin: 0 0 5px 0; color: #1976d2; font-size: 14px;">
                  <strong>💬 Need Help?</strong>
                </p>
                <p style="margin: 0; color: #555; font-size: 13px;">
                  Our support team is available 10 AM - 7 PM<br>
                  Average response time: &lt; 2 hours
                </p>
              </div>
              
              <!-- Action Buttons -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'https://yourwebsite.com'}/player/register" 
                   style="background: ${buttonColor}; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin: 0 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  Re-register Now →
                </a>
                <a href="${process.env.FRONTEND_URL || 'https://yourwebsite.com'}/support" 
                   style="background: #6c757d; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin: 0 5px;">
                  Contact Support
                </a>
              </div>
              
              <!-- Contact Info -->
              <div style="border-top: 1px solid #e0e0e0; margin-top: 25px; padding-top: 20px; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">
                  For immediate assistance:
                </p>
                <p style="color: #666; font-size: 13px; margin: 0;">
                  📞 +91 98765 43210 | ✉️ support@jpl.com
                </p>
                <p style="color: #666; font-size: 13px; margin: 5px 0 0;">
                  💬 WhatsApp: +91 98765 43211
                </p>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #aaa; font-size: 11px; margin: 5px 0;">
                © 2025 Junior Premier League. All rights reserved.
              </p>
              <p style="color: #aaa; font-size: 10px;">
                This is an automated message, please do not reply directly.
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `;
    }

    console.log("📧 SENDING EMAIL NOW...");

    const info = await transporter.sendMail({

      from: `"JPL League" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html

    });

    console.log("✅ PLAYER EMAIL SENT SUCCESS");
    console.log(info.messageId);

    return info;

  } catch (error) {

    console.log("❌ PLAYER EMAIL FAILED");
    console.log(error);
    throw error;
  }
};

/* --------------------------------------------------
   EXPORTS
-------------------------------------------------- */
module.exports = {
  transporter,
  sendWelcomeEmail,
  sendBookingEmail,
  sendPlayerVerificationEmail
};