// const fs = require("fs");
// const path = require("path");
// const axios = require("axios");
// const FormData = require("form-data");

// /**
//  * Test function for the object detection endpoint
//  * @param {string} imagePath - Path to the image file
//  * @param {string} url - API endpoint URL
//  * @returns {Promise<Object>} - Detection results
//  */
// async function testObjectDetection(
//   imagePath,
//   url = "http://localhost:8000/detect/"
// ) {
//   try {
//     // Check if file exists
//     if (!fs.existsSync(imagePath)) {
//       throw new Error(`Image file not found at path: ${imagePath}`);
//     }

//     // Create form data
//     const formData = new FormData();
//     formData.append("file", fs.createReadStream(imagePath));

//     console.log(`Sending image ${path.basename(imagePath)} to ${url}...`);

//     // Send request to the API
//     const response = await axios.post(url, formData, {
//       headers: {
//         ...formData.getHeaders(),
//       },
//       // Increase timeout for large images or slow processing
//       timeout: 30000,
//     });

//     console.log("Detection completed successfully!");
//     console.log("Detected objects:");

//     const detectedObjects = response.data.detected_objects;

//     // Display results in a table format
//     if (Object.keys(detectedObjects).length === 0) {
//       console.log("No objects detected");
//     } else {
//       console.table(detectedObjects);
//     }

//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.error(
//         `Error: ${error.response.status} - ${error.response.statusText}`
//       );
//       console.error("Response data:", error.response.data);
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error("Error: No response received from server");
//       console.error("Is the server running at the specified URL?");
//     } else {
//       // Something happened in setting up the request
//       console.error("Error:", error.message);
//     }
//     throw error;
//   }
// }

// // Example usage
// async function runTest() {
//   try {
//     // Replace with the actual path to your image file
//     const imagePath = path.join(__dirname, "test-images", "test-image.jpg");

//     // You can change the URL if your API is running on a different host/port
//     const result = await testObjectDetection(imagePath);

//     // You can use the result for further processing if needed
//     console.log("Raw API response:", JSON.stringify(result, null, 2));
//   } catch (error) {
//     console.error("Test failed");
//   }
// }

// // Run the test when this file is executed directly
// if (require.main === module) {
//   // Install missing dependencies if needed
//   try {
//     require("form-data");
//   } catch (e) {
//     console.log("Installing required dependencies...");
//     require("child_process").execSync("npm install form-data --save", {
//       stdio: "inherit",
//     });
//     console.log("Dependencies installed successfully!");
//   }

//   runTest();
// }

// // Export the function for use in other files
// module.exports = {
//   testObjectDetection,
// };
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const { exec, spawn } = require("child_process");
const os = require("os");

/**
 * Test function for the object detection endpoint with an image
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

      // Count objects
      const objectCounts = countObjects(detectedObjects);
      console.log("\nObject counts:");
      console.table(objectCounts);
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

/**
 * Process a video for object detection
 * @param {string} videoPath - Path to the video file
 * @param {string} url - API endpoint URL
 * @param {number} frameInterval - Interval between frames in milliseconds
 * @param {string} outputDir - Directory to save processed frames and results
 * @returns {Promise<Object>} - Aggregated detection results
 */
async function processVideoForObjectDetection(
  videoPath,
  url = "http://localhost:8000/detect/",
  frameInterval = 1000, // Process one frame per second by default
  outputDir = path.join(os.tmpdir(), "video-detection")
) {
  try {
    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Video file not found at path: ${videoPath}`);
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const framesDir = path.join(outputDir, "frames");
    if (!fs.existsSync(framesDir)) {
      fs.mkdirSync(framesDir, { recursive: true });
    }

    console.log(`Extracting frames from video ${path.basename(videoPath)}...`);

    // Extract frames from video using ffmpeg
    await extractFramesFromVideo(videoPath, framesDir, frameInterval);

    // Get all frame files
    const frameFiles = fs
      .readdirSync(framesDir)
      .filter((file) => file.endsWith(".jpg") || file.endsWith(".png"))
      .map((file) => path.join(framesDir, file));

    console.log(
      `Extracted ${frameFiles.length} frames. Processing frames for object detection...`
    );

    // Process each frame
    const allResults = [];
    for (let i = 0; i < frameFiles.length; i++) {
      const framePath = frameFiles[i];
      console.log(
        `Processing frame ${i + 1}/${frameFiles.length}: ${path.basename(
          framePath
        )}`
      );

      try {
        const result = await testObjectDetection(framePath, url);
        result.frame = i + 1;
        result.timestamp = (i * frameInterval) / 1000; // Convert to seconds
        allResults.push(result);
      } catch (error) {
        console.error(`Error processing frame ${i + 1}: ${error.message}`);
      }
    }

    // Aggregate results across all frames
    const aggregatedResults = aggregateVideoResults(allResults);

    // Save results to a JSON file
    const resultsPath = path.join(outputDir, "detection_results.json");
    fs.writeFileSync(resultsPath, JSON.stringify(aggregatedResults, null, 2));

    console.log(`\nVideo processing complete. Results saved to ${resultsPath}`);
    console.log("\nSummary of detected objects across all frames:");

    // Display aggregated results
    if (Object.keys(aggregatedResults.counts).length === 0) {
      console.log("No objects detected in any frame");
    } else {
      console.table(aggregatedResults.counts);

      // Show peak detection frames
      console.log("\nPeak detection frames:");
      console.table(aggregatedResults.peakFrames);
    }

    // Generate a summary video with annotations if ffmpeg is available
    console.log("\nGenerating annotated video...");
    const annotatedVideoPath = path.join(outputDir, "annotated_video.mp4");
    await generateAnnotatedVideo(videoPath, allResults, annotatedVideoPath);
    console.log(`Annotated video saved to: ${annotatedVideoPath}`);

    return aggregatedResults;
  } catch (error) {
    console.error("Error processing video:", error.message);
    throw error;
  }
}

/**
 * Extract frames from a video using ffmpeg
 * @param {string} videoPath - Path to the video file
 * @param {string} outputDir - Directory to save extracted frames
 * @param {number} frameInterval - Interval between frames in milliseconds
 * @returns {Promise<void>}
 */
function extractFramesFromVideo(videoPath, outputDir, frameInterval) {
  return new Promise((resolve, reject) => {
    // Calculate frame rate (1000 ms / interval in ms)
    const frameRate = 1000 / frameInterval;

    // ffmpeg command to extract frames
    const ffmpegCmd = `ffmpeg -i "${videoPath}" -vf "fps=${frameRate}" -q:v 1 "${path.join(
      outputDir,
      "frame%04d.jpg"
    )}"`;

    exec(ffmpegCmd, (error, stdout, stderr) => {
      if (error) {
        console.error("Error extracting frames:", stderr);
        reject(error);
        return;
      }
      resolve();
    });
  });
}

/**
 * Generate an annotated video with detection results
 * @param {string} videoPath - Path to the original video
 * @param {Array} detectionResults - Array of detection results per frame
 * @param {string} outputPath - Path to save the annotated video
 * @returns {Promise<void>}
 */
function generateAnnotatedVideo(videoPath, detectionResults, outputPath) {
  // This is a placeholder for video annotation functionality
  // In a real implementation, you would draw bounding boxes and labels
  // This requires more complex processing with ffmpeg or a Python script

  return new Promise((resolve, reject) => {
    // For now, just create a copy of the original video
    fs.copyFileSync(videoPath, outputPath);
    resolve();

    // TODO: Implement actual video annotation using ffmpeg or by
    // calling a separate Python script that uses OpenCV
  });
}

/**
 * Count objects from detection results
 * @param {Object} detectedObjects - Object with detection results
 * @returns {Object} - Object counts by category
 */
function countObjects(detectedObjects) {
  const counts = {};

  // Count objects by class
  Object.keys(detectedObjects).forEach((id) => {
    const object = detectedObjects[id];
    const className = object.class;

    if (!counts[className]) {
      counts[className] = 0;
    }

    counts[className]++;
  });

  return counts;
}

/**
 * Aggregate results from all video frames
 * @param {Array} allResults - Results from all processed frames
 * @returns {Object} - Aggregated results
 */
function aggregateVideoResults(allResults) {
  const allCounts = {};
  const maxCountsByClass = {}; // Track max count per class
  const peakFrames = {}; // Track which frame had the peak detection

  // Process each frame's results
  allResults.forEach((result) => {
    const detectedObjects = result.detected_objects || {};
    const frameNumber = result.frame;
    const timestamp = result.timestamp;

    // Count objects in this frame
    const frameCounts = countObjects(detectedObjects);

    // Update overall counts and track peaks
    Object.keys(frameCounts).forEach((className) => {
      // Ensure class exists in tracking objects
      if (!allCounts[className]) {
        allCounts[className] = 0;
        maxCountsByClass[className] = 0;
      }

      // Add to total count across all frames
      allCounts[className] += frameCounts[className];

      // Check if this frame has more of this class than previous max
      if (frameCounts[className] > maxCountsByClass[className]) {
        maxCountsByClass[className] = frameCounts[className];
        peakFrames[className] = {
          frame: frameNumber,
          timestamp: timestamp,
          count: frameCounts[className],
        };
      }
    });
  });

  // Create tracking frequency - how often each object appears in different frames
  const frequency = {};
  Object.keys(allCounts).forEach((className) => {
    frequency[className] = (allCounts[className] / allResults.length).toFixed(
      2
    );
  });

  return {
    totalFrames: allResults.length,
    counts: allCounts,
    frequency: frequency,
    peakFrames: peakFrames,
  };
}

// Example usage for video processing
async function runVideoTest() {
  try {
    // Replace with the actual path to your video file
    const videoPath = path.join(__dirname, "test-videos", "test-video.mp4");

    // Process video with default settings
    const result = await processVideoForObjectDetection(videoPath);

    // You can use the result for further processing if needed
    console.log("\nVideo processing complete!");
  } catch (error) {
    console.error("Video test failed:", error.message);
  }
}

// Example usage for image
async function runImageTest() {
  try {
    // Replace with the actual path to your image file
    const imagePath = path.join(__dirname, "test-images", "test-image.jpg");

    // You can change the URL if your API is running on a different host/port
    const result = await testObjectDetection(imagePath);

    // You can use the result for further processing if needed
    console.log("Raw API response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Image test failed:", error.message);
  }
}

// Run the test when this file is executed directly
if (require.main === module) {
  // Check command line arguments
  const args = process.argv.slice(2);
  const testType = args[0] || "image"; // default to image if not specified
  const filePath = args[1]; // optional file path

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

  // Check for ffmpeg installation for video processing
  if (testType === "video") {
    exec("ffmpeg -version", (error) => {
      if (error) {
        console.error(
          "FFmpeg is not installed or not in PATH. It's required for video processing."
        );
        console.error(
          "Please install FFmpeg: https://ffmpeg.org/download.html"
        );
        process.exit(1);
      } else {
        if (filePath) {
          processVideoForObjectDetection(filePath);
        } else {
          runVideoTest();
        }
      }
    });
  } else {
    // Run image test
    if (filePath) {
      testObjectDetection(filePath);
    } else {
      runImageTest();
    }
  }
}

// Export functions for use in other files
module.exports = {
  testObjectDetection,
  processVideoForObjectDetection,
  countObjects,
};
