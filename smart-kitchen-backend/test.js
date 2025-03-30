const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

/**
 * Test function for the object detection endpoint
 * @param {string} imagePath - Path to the image file
 * @param {string} url - API endpoint URL
 * @returns {Promise<Object>} - Detection results
 */
async function testObjectDetection(
  imagePath,
  url = "http://localhost:8000/detect/"
) {
  try {
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found at path: ${imagePath}`);
    }

    // Create form data
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));

    console.log(`Sending image ${path.basename(imagePath)} to ${url}...`);

    // Send request to the API
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      // Increase timeout for large images or slow processing
      timeout: 30000,
    });

    console.log("Detection completed successfully!");
    console.log("Detected objects:");

    const detectedObjects = response.data.detected_objects;

    // Display results in a table format
    if (Object.keys(detectedObjects).length === 0) {
      console.log("No objects detected");
    } else {
      console.table(detectedObjects);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        `Error: ${error.response.status} - ${error.response.statusText}`
      );
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error: No response received from server");
      console.error("Is the server running at the specified URL?");
    } else {
      // Something happened in setting up the request
      console.error("Error:", error.message);
    }
    throw error;
  }
}

// Example usage
async function runTest() {
  try {
    // Replace with the actual path to your image file
    const imagePath = path.join(__dirname, "test-images", "test-image.jpg");

    // You can change the URL if your API is running on a different host/port
    const result = await testObjectDetection(imagePath);

    // You can use the result for further processing if needed
    console.log("Raw API response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Test failed");
  }
}

// Run the test when this file is executed directly
if (require.main === module) {
  // Install missing dependencies if needed
  try {
    require("form-data");
  } catch (e) {
    console.log("Installing required dependencies...");
    require("child_process").execSync("npm install form-data --save", {
      stdio: "inherit",
    });
    console.log("Dependencies installed successfully!");
  }

  runTest();
}

// Export the function for use in other files
module.exports = {
  testObjectDetection,
};
