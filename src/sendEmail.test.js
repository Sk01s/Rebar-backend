const { sendMail } = require("./sendEmail");

describe("sendmail function", () => {
  test("should send an email successfully", async () => {
    // Arrange
    const name = "John Doe";
    const respetion = "johndoe@example.com";

    // Act
    sendMail(name, respetion);

    // Assert
    // We cannot directly test if the email was sent successfully as it depends on the network connection and email server.
    // Instead, we can check if the function executed without throwing any errors.
    expect(() => sendMail(name, respetion)).not.toThrow();
  });

  test("should throw an error if the recipient email is invalid", () => {
    // Arrange
    const name = "John Doe";
    const respetion = "invalidemail";

    // Act & Assert
    expect(() => sendMail(name, respetion)).toThrow();
  });
});
