const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://ananya_ansh:Ananya%40123%24@cluster0.3p1q6.mongodb.net/g140?', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema to store images in MongoDB
const imageSchema = new mongoose.Schema({
  imagePath: String,
  uploadDate: { type: Date, default: Date.now },
  analysisResult: Object,
});
const ImageModel = mongoose.model('Image', imageSchema);

// Set up multer for uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, `image_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 1000000 } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));
app.use(express.static(path.join(__dirname, 'public')));

let allResults = [];

// Helper function for Hugging Face API
async function analyzeImage(imagePath) {
  try {
    const data = fs.createReadStream(imagePath); // Stream the image file
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(
      "https://api-inference.huggingface.co/models/trpakov/vit-face-expression",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/octet-stream", // Set correct content type for binary data
        },
        method: "POST",
        body: data, // Send the image stream directly
      }
    );

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const result = await response.json();
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error; // Rethrow the error to be caught in the route handler
  }
}

// Route for image upload, analysis, and storage
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded.' });

  try {
    const result = await analyzeImage(req.file.path);
    const newImage = new ImageModel({ imagePath: req.file.filename, analysisResult: result });
    await newImage.save();
    allResults.push({ filename: req.file.filename, result });
    res.status(200).json({ message: 'Image uploaded, analyzed, and stored successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing image', error: error.message });
  }
});

// Route to fetch detailed analysis
app.get('/api/detailed-analysis', async (req, res) => {
  try {
    const images = await ImageModel.find();
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching detailed analysis', error: err.message });
  }
});

// Route to fetch analysis summary
app.get('/api/analysis-summary', async (req, res) => {
  try {
    const summary = allResults.reduce((acc, entry) => {
      entry.result.forEach(result => {
        acc[result.label] = (acc[result.label] || 0) + result.score;
      });
      return acc;
    }, {});
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching analysis summary', error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
