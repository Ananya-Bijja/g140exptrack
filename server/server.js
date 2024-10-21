const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://user1:shreya23@cluster0.9qczp.mongodb.net/projectschool', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Schema to store image path, upload date, and analysis result
const imageSchema = new mongoose.Schema({
  imagePath: String,
  uploadDate: { type: Date, default: Date.now },
  analysisResult: Object,
});

const ImageModel = mongoose.model('Image', imageSchema);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(uploadDir));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up multer for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, 'image_' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // Limit size to 1MB
});

// Helper function to analyze image using Hugging Face API
async function analyzeImage(imagePath) {
  const data = fs.readFileSync(imagePath);

  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(
      "https://api-inference.huggingface.co/models/trpakov/vit-face-expression",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ input: data }),
      }
    );

    const result = await response.json();
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    console.error("Error querying Hugging Face API:", error);
    throw new Error('Image analysis failed.');
  }
}

// Route to upload image, analyze it, and store results in MongoDB
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded.' });
  }

  try {
    const result = await analyzeImage(req.file.path);

    const newImage = new ImageModel({
      imagePath: req.file.filename,
      analysisResult: result,
    });

    await newImage.save();

    res.status(200).json({ message: 'Image uploaded, analyzed, and stored successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process and analyze the image.', error: error.message });
  }
});

// Route to fetch detailed analysis results from MongoDB
app.get('/api/detailed-analysis', async (req, res) => {
  try {
    const images = await ImageModel.find();
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching detailed analysis.', error: err.message });
  }
});

// Route to fetch summarized analysis results from MongoDB
app.get('/api/analysis-summary', async (req, res) => {
  try {
    const images = await ImageModel.find();

    const summary = images.reduce((acc, image) => {
      if (Array.isArray(image.analysisResult)) {
        image.analysisResult.forEach(result => {
          acc[result.label] = (acc[result.label] || 0) + result.score;
        });
      } else {
        console.error('Analysis result is not an array:', image.analysisResult);
      }
      return acc;
    }, {});

    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching analysis summary.', error: err.message });
  }
});

// Start the server on the specified PORT
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
}); 