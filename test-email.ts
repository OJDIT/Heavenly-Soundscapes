import nodemailer from "nodemailer";

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: "benamobeda@heavenlysoundscape.com", // your full Hostinger email
      pass: "Lebronjames2335?", // the email password or app password
    },
  });

  try {
    await transporter.verify();
    console.log("✅ Verified successfully!");
  } catch (error) {
    console.error("❌ Verification failed:", error);
  }
}

testEmail();
