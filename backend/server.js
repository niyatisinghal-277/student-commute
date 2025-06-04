const express = require('express');
const vision = require('@google-cloud/vision');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse JSON requests and enable CORS
app.use(express.json());
app.use(cors());

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Initialize Google Cloud Vision client with the JSON credentials
const client = new vision.ImageAnnotatorClient({
  keyFilename: './config/google-ocr.json',
});

// Function to perform OCR on an image (URL or Buffer)
const performOCR = async (imageSource) => {
  try {
    console.log("Performing OCR on image..."); // Debug log
    const [result] = await client.textDetection(imageSource);
    const text = result.textAnnotations[0]?.description || 'No text found';
    console.log("OCR Result:", text); // Debug log
    return text;
  } catch (error) {
    throw new Error(`OCR Error: ${error.message}`);
  }
};

// Basic route for testing the server
app.get('/', (req, res) => {
  console.log("Received GET request to /"); // Debug log
  res.send('Carpooling Backend (at CARPOOLING_PROJECT/backend/) is running!');
});

// OCR endpoint for image URLs
app.post('/api/ocr', async (req, res) => {
  console.log("Received POST request to /api/ocr", req.body); // Debug log
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const text = await performOCR(imageUrl);
    res.json({ text });
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// OCR endpoint for file uploads
app.post('/api/ocr/upload', upload.single('image'), async (req, res) => {
  console.log("Received POST request to /api/ocr/upload");
  try {
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ error: 'Image file is required' });
    }

    console.log("File received:", req.file.originalname, req.file.size, "bytes");
    const base64Image = req.file.buffer.toString('base64');
    console.log("Base64 Image Length:", base64Image.length);
    console.log("Base64 Image Snippet:", base64Image.substring(0, 100));
    const image = {
      content: base64Image,
    };

    const text = await performOCR(image);
    res.json({ text });
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Standalone OCR test (runs when script is called with "test" argument)
const runOCRTest = async () => {
  const testImagePath = './test-id-card.jpg';

  console.log('Running standalone OCR test...');
  console.log('Test Image Path:', testImagePath);

  try {
    const imageBuffer = fs.readFileSync(testImagePath);
    const base64Image = imageBuffer.toString('base64');
    const image = {
      content: base64Image,
    };

    const text = await performOCR(image);
    console.log('Extracted Text:', text);
  } catch (error) {
    console.error(error.message);
  }
};


// Check if the script is run with the "test" argument
if (process.argv[2] === 'test') {
  runOCRTest();
}