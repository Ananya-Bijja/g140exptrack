
let express = require('express');
let cors = require('cors');
let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let multer = require('multer');
let path = require('path');
let fs = require('fs');

const User = require('./models/user'); // Import User model
const Feedback = require('./models/feedback'); // Feedback model

let app = express();
let PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect('mongodb+srv://ananya_ansh:Ananya%40123%24@cluster0.3p1q6.mongodb.net/g140?', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

let uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

let storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, `image_${Date.now()}${path.extname(file.originalname)}`),
});

let upload = multer({ storage, limits: { fileSize: 1000000 } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Signup
app.post('/api/signup', async (req, res) => {
  let { username, email, password } = req.body;
  let existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) return res.status(400).json({ message: 'Username or Email already exists' });
  let hashedPassword = await bcrypt.hash(password, 10);
  let role = username.endsWith('@admin') ? 'admin' : 'child';
  let newUser = new User({ username, email, password: hashedPassword, role });
  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  let { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User doesn't exist" });
    let isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(400).json({ message: 'Username or password is wrong' });
    // Update role to admin if username ends with @admin
    if (username.endsWith('@admin') && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }
    res.status(200).json({
      message: 'Login successful',
      isAdmin: user.role === 'admin',
      user: { username: user.username, gameSessions: user.gameSessions }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Create game session
app.post('/api/create-game-session', async (req, res) => {
  let { username } = req.body;
  if (!username) return res.status(400).json({ message: 'Username is required' });

  let gameSessionId = new mongoose.Types.ObjectId();
  try {
    let user = await User.findOneAndUpdate({ username }, { $push: { gameSessions: { gameSessionId, images: [] } } }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ gameSessionId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating game session', error: error.message });
  }
});

// File Upload
app.post('/upload', upload.single('file'), async (req, res) => {
  let { username, gameSessionId, type } = req.body;
  if (!username || !gameSessionId || !req.file || !type) return res.status(400).json({ message: 'Required fields are missing' });

  let imagePath = req.file.filename;
  try {
    let newImage = { imageUrl: imagePath, capturedAt: new Date() };
    let fieldToUpdate = type === 'screenshot' ? 'screenshots' : 'images';
    let user = await User.findOneAndUpdate({ username, "gameSessions.gameSessionId": gameSessionId }, { $push: { [`gameSessions.$.${fieldToUpdate}`]: newImage } }, { new: true });

    if (!user) return res.status(404).json({ message: 'User or game session not found' });
    res.status(200).json({ message: 'Image uploaded successfully!', imagePath });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});


//fetch users
app.get('/api/users', async (req, res) => {
  try {
    let users = await User.find({ role: 'child' }, { password: 0 }); // Only fetch users with role 'child'
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Fetch game sessions for a user
app.get('/api/game-sessions/:userId', async (req, res) => {
  let { userId } = req.params;
  try {
    let user = await User.findById(userId).select('gameSessions');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ sessions: user.gameSessions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game sessions', error: error.message });
  }
});

app.post('/api/analyze/:sessionId', async (req, res) => {
  let { sessionId } = req.params;
  let { username } = req.body;

  if (!username || !sessionId) {
    return res.status(400).json({ message: 'Username and sessionId are required' });
  }

  try {
    // Fetch the user and session
    let user = await User.findOne({ username, "gameSessions.gameSessionId": sessionId });
    if (!user) {
      return res.status(404).json({ message: 'User or game session not found' });
    }

    let session = user.gameSessions.find(session => session.gameSessionId === sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    if (!session.flag) {
      // Perform image analysis
      let analysisResults = await Promise.all(session.images.map(async (image) => {
        let imagePath = path.join(uploadDir, image.imageUrl);
        try {
          if (fs.existsSync(imagePath)) {
            let result = await analyzeImage(imagePath);
            image.emotions = result.emotions; // Store the emotions
          } else {
            console.warn(`Image not found: ${image.imageUrl}`);
            image.emotions = []; // Store empty emotions if image not found
          }// Store the emotions
         
          return image;
        } catch (error) {
          console.error(`Error analyzing image ${image.imageUrl}:`, error);
          image.emotions = []; // Store empty emotions in case of error
          return image;
        }
      }));


      let hasEmptyEmotions = analysisResults.some(image => image.emotions.length === 0);
      if (!hasEmptyEmotions) {
      // Update session with analyzed results and set the flag
      session.images = analysisResults;
      session.flag = true;
      await user.save(); // Save changes to the database
    }
    else{        
      console.warn('Some images have no emotions detected. Flag not set to true.');
      return res.status(500).json({ message: 'Some images have no emotions detected' });
    }
  }
    res.status(200).json({ result: session.images });
  } catch (error) {
    console.error('Error analyzing session:', error);
    res.status(500).json({ message: 'Error analyzing session', error: error.message });
  }
});


async function analyzeImage(imagePath) {
  try {
    let data = fs.createReadStream(imagePath);
    let { default: fetch } = await import('node-fetch');
    let response = await fetch(
      "https://api-inference.huggingface.co/models/trpakov/vit-face-expression",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/octet-stream",
        },
        method: "POST",
        body: data,
      }
    );

    if (!response.ok) throw new Error(`Hugging Face API error: ${response.statusText}`);
    
    let result = await response.json();

    // Convert the result into a format your code expects
    let emotions = result.map(emotion => ({
      label: emotion.label,
      score: emotion.score,
    }));

    return { emotions }; // Return an object with emotions as an array
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}

//analysis summary
app.post('/api/analysis-summary/:sessionId', async (req, res) => {
  let { sessionId } = req.params;
  let { username } = req.body;

  if (!username || !sessionId) {
    return res.status(400).json({ message: 'Session ID and Username are required' });
  }

  try {
    // Fetch the user and session
    let user = await User.findOne({ username, "gameSessions.gameSessionId": sessionId });
    if (!user) {
      return res.status(404).json({ message: 'User or game session not found' });
    }

    let session = user.gameSessions.find(session => session.gameSessionId === sessionId);
    if (!session || session.images.length === 0) {
      return res.status(404).json({ message: 'No images found in the game session' });
    }

    // Calculate emotion summary
    let emotionSummary = {};
    session.images.forEach(image => {
      if (image.emotions) {
        image.emotions.forEach(emotion => {
          let emotionLabel = emotion.label;
          let emotionScore = emotion.score;
          emotionSummary[emotionLabel] = (emotionSummary[emotionLabel] || 0) + emotionScore;
        });
      }
    });

    res.status(200).json(emotionSummary);
  } catch (error) {
    console.error('Error fetching analysis summary:', error);
    res.status(500).json({ message: 'Error fetching analysis summary', error: error.message });
  }
});

//detailed analysis
app.get('/api/detailed-analysis/:sessionId', async (req, res) => {
  let { sessionId } = req.params;

  try {
    let users = await User.find({}, 'username gameSessions').lean();

    let detailedAnalysis = users.map(user => {
      let sessions = user.gameSessions.filter(session => session.gameSessionId === sessionId);

      return sessions.map(session => ({
        username: user.username,
        gameSessionId: session.gameSessionId,
        imagesWithEmotions: session.images.map(image => {
          // Find the corresponding screenshot captured at the same timestamp (if any)
          let matchingScreenshot = session.screenshots.find(screenshot =>
          { 
            return Math.abs(new Date(screenshot.capturedAt).getTime() - new Date(image.capturedAt).getTime())<=3000;

        });
          return {
            imagePath: image.imageUrl,
            emotions: image.emotions || [],
            capturedAt: image.capturedAt,
            screenshotPath: matchingScreenshot ? matchingScreenshot.imageUrl : null
          };
        })
      }));
    });

    res.status(200).json(detailedAnalysis.flat());
  } catch (error) {
    console.error('Error fetching detailed analysis:', error);
    res.status(500).json({ message: 'Error in detailed analysis', error: error.message });
  }
});


// Submit Feedback
app.post('/api/submit-feedback', async (req, res) => {
  const { feedbackText, rating } = req.body;
  if (!feedbackText || !rating)
    return res.status(400).json({ message: 'Feedback text and rating are required' });

  try {
    const feedback = new Feedback({ feedbackText, rating });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
});

// Serve the uploaded files
app.use('/uploads', express.static(uploadDir));

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));