import nodemailer from "nodemailer";

export function sendMail(name, respetion) {
  const emailRegex = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
  );
  console.log(emailRegex.test(respetion));
  if (!emailRegex.test(respetion)) throw Error("Not valid email");
  const transport = nodemailer.createTransport({
    service: "Outlook365",
    host: "smtp.office365.com",
    port: "587",
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    auth: {
      user: "rebar.shop@outlook.com",
      pass: process.env.PASSWORD,
    },
  });
  const mailOptions = {
    from: "rebar.shop@outlook.com",
    to: respetion,
    subject: "purchased",
    html: `
    <h1>${name}</h1>
    `,
  };
  transport.sendMail(mailOptions, (error, result) => {
    if (error) {
      console.error(error);
    } else {
      console.log("success", result);
    }
    transport.close();
  });
}
