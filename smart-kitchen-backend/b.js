const { testObjectDetection } = require("./test.js");
testObjectDetection("images.jpg")
  .then((result) => {
    console.log("Test result:", result);
  })
  .catch((error) => {
    console.error("Error during test:", error);
  });
