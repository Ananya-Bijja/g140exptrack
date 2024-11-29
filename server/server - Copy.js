const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://ananya_ansh:Ananya%40123%24@cluster0.3p1q6.mongodb.net/g140?', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});


const imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  emotions: [{
    label: { type: String, required: true },
    score: { type: Number, required: true }
  }],
  capturedAt: { type: Date, default: Date.now },
  
});

const screenshotSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  capturedAt: { type: Date, default: Date.now },
});


// Define schema for each game session
const gameSessionSchema = new mongoose.Schema({
  gameSessionId: { type: String, required: true },
  images: [imageSchema],
  screenshots: [screenshotSchema],
  flag:{type: Boolean,default:false,required: true}
  
});

// Define main User schema without images, uploadDate, and analysisResult fields
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emotionAnalysis: [gameSessionSchema],
});

const User = mongoose.model('User', userSchema);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Set up storage for images
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, `image_${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage, limits: { fileSize: 1000000 } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Signup route
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ message: 'Username or Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username.endsWith('@admin')) {
      return res.status(200).json({
        message: 'Admin login successful',
        isAdmin: true,
        user: { username, emotionAnalysis: [] },
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Username or password is wrong' });
    }

    res.status(200).json({
      message: 'Login successful',
      isAdmin: false,
      user: { username: user.username, emotionAnalysis: user.emotionAnalysis },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});


app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password from results
    res.status(200).json(users);
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  
  }

});


// Fetch game sessions for a specific user
app.get('/api/game-sessions/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('Received request for userId:', userId);
  try {
    // Find the user and populate the emotionAnalysis field to include game sessions
    const user = await User.findById(userId).select('emotionAnalysis'); // Assuming 'emotionAnalysis' contains the sessions
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's emotion analysis (which includes game sessions)
    res.status(200).json({ sessions: user.emotionAnalysis });
  } catch (error) {
    console.error('Error fetching game sessions:', error);
    res.status(500).json({ message: 'Error fetching game sessions' });
  }
});
// Assuming you have a User model and Mongoose set up
app.post('/api/create-game-session', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    // Generate a unique game session ID
    const gameSessionId =new mongoose.Types.ObjectId(); // Implement this function to create unique IDs

    // Update the user's document to add a new game session
    const user = await User.findOneAndUpdate(
      { username },
      { $push: { gameSessions: { gameSessionId, images: [] } } }, // Assuming you have a gameSessions array in your User model
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ gameSessionId });
  } catch (error) {
    console.error('Error creating game session:', error);
    res.status(500).json({ message: 'Error creating game session' });
  }
});


app.post('/upload', upload.single('file'), async (req, res) => {
  console.log(" in upload");
  const { username, gameSessionId,type } = req.body;
  // Validate request body
  if (!username || !gameSessionId || !req.file || !type) {
    
    return res.status(400).json({ message: 'Username, gameSessionId, and image are required' });
  }

  let imagePath = req.file.filename;
console.log("imagePath"+imagePath);
  try {
    let newImage = {
      imageUrl: imagePath,
      capturedAt: new Date(),
    };

    // Update user document to push new image into the correct game session
    const user = await User.findOne({ username });

if (!user) {
  // Handle case where user is not found
  console.error('User not found');
  return; // or throw an error
}

// Check if the emotionAnalysis array contains the gameSessionId
const sessionIndex = user.emotionAnalysis.findIndex(session => session.gameSessionId === gameSessionId);

if (sessionIndex === -1) {
  // No session exists, so create a new session
  user.emotionAnalysis.push({ gameSessionId, images: [], screenshots: []  });
  await user.save(); // Save the user with the new session
  sessionIndex = user.emotionAnalysis.length - 1;
 
}
const fieldToUpdate = type === 'screenshot' ? 'screenshots' : 'images';

// Now you can push the new image to the existing or newly created session
const test =await User.findOneAndUpdate(
  { username, "emotionAnalysis.gameSessionId": gameSessionId },
  //{ $push: { "emotionAnalysis.$.images": newImage } },
  { $push: { [`emotionAnalysis.$.${fieldToUpdate}`]: newImage } },
  { new: true }
);

    console.log("added image details to db");
    if (!test) {
      return res.status(404).json({ message: 'User or game session not found' });
    }

    res.status(200).json({ message: 'Image uploaded successfully!', imagePath });
  } catch (error) {
    console.error('Error during image upload:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});


app.post('/api/analyze/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const { username } = req.body;

  if (!username || !sessionId) {
    return res.status(400).json({ message: 'Username and sessionId are required' });
  }

  try {
    const user = await User.findOne({ username, "emotionAnalysis.gameSessionId": sessionId });
    if (!user) {
      return res.status(404).json({ message: 'User or game session not found' });
    }

    const session = user.emotionAnalysis.find(session => session.gameSessionId === sessionId);

    const analysisResults = await Promise.all(session.images.map(async (image) => {
      const imagePath = path.join(uploadDir, image.imageUrl);
      

      try {
        const result = await analyzeImage(imagePath);
        
        image.emotions = result.emotions;
        return image; // Ensure "emotions" array is included
      } catch (error) {
        console.error(`Error analyzing image ${image.imageUrl}:`, error);
        image.emotions = []; // If error occurs, store empty emotions
        image.error = error.message;
        return image;
      }
    }));

    await User.updateOne(
      { username, "emotionAnalysis.gameSessionId": sessionId },
      { $set: { "emotionAnalysis.$.images": analysisResults } }
    );

    res.status(200).json({ result: analysisResults });
  } catch (error) {
    console.error('Error analyzing session:', error);
    res.status(500).json({ message: 'Error analyzing session', error: error.message });
  }
});

async function analyzeImage(imagePath) {
  try {
    const data = fs.createReadStream(imagePath);
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(
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
    
    const result = await response.json();

    // Convert the result into a format your code expects
    const emotions = result.map(emotion => ({
      label: emotion.label,
      score: emotion.score,
    }));

    return { emotions }; // Return an object with emotions as an array
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}


// Utility function to perform emotion analysis
async function showEmotionAnalysis(gameSessionId) {
  const user = await User.findOne({ "emotionAnalysis.gameSessionId": gameSessionId });
  if (!user) {
      throw new Error('User not found');
  }
  
  const gameSession = user.emotionAnalysis.find(session => session.gameSessionId === gameSessionId);
  if (!gameSession) {
      throw new Error('Game session not found');
  }

  if (!gameSession.flag) {  // If flag is false
      // Perform the analysis
      const analysisResult = await Promise.all(gameSession.images.map(async (image) => {
          const imagePath = path.join('uploads', image.imageUrl);
          try {
              const result = await analyzeImage(imagePath);
              image.emotions = result.emotions;
              console.log("analysis aithundhi")
              return image; 
          } catch (error) {
              image.emotions = [];
              return image;
          }
      }));

      // Update the flag to true
      gameSession.flag = true;
      gameSession.images = analysisResult;
      await user.save();  // Save the updated game session

      return analysisResult;
  } else {
      // If flag is true, return previously analyzed results
      console.log("unnadhi chupisthundhi");
      return gameSession.images;
  }
}


// Route to handle analysis summary
app.post('/api/analysis-summary/:sessionId', async (req, res) => {
  const { sessionId } = req.params;  // Extract sessionId from URL parameters
  const { username } = req.body;    // Extract username from the body of the request (if needed for validation)

  console.log(`Session ID: ${sessionId}, Username: ${username}`);

  if (!sessionId || !username) {
    return res.status(400).json({ message: 'Session ID and Username are required' });
  }

  try {
    // Step 1: Call the showEmotionAnalysis function to get analysis results (perform analysis if necessary)
    const analysisResults = await showEmotionAnalysis(sessionId);

    // Step 2: Initialize an object to store emotion score totals (for summary)
    const emotionSummary = {};

    // Step 3: Aggregate the emotion scores from the analyzed results
    analysisResults.forEach(image => {
      if (image.emotions) {
        image.emotions.forEach(emotion => {
          const emotionLabel = emotion.label;
          const emotionScore = emotion.score;

          // Accumulate the scores for each emotion label
          emotionSummary[emotionLabel] = (emotionSummary[emotionLabel] || 0) + emotionScore;
        });
      }
    });

    // Step 4: Send the aggregated emotion summary as the response
    res.status(200).json(emotionSummary);

  } catch (err) {
    console.error('Error fetching analysis summary:', err);
    res.status(500).json({ message: 'Error fetching analysis summary', error: err.message });
  }
});



app.get('/api/detailed-analysis/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const users = await User.find({}, 'username emotionAnalysis').lean();

    const detailedAnalysis = users.map(user => {
      const sessions = user.emotionAnalysis.filter(session => session.gameSessionId === sessionId);

      return sessions.map(session => ({
        username: user.username,
        gameSessionId: session.gameSessionId,
        imagesWithEmotions: session.images.map(image => {
          // Find the corresponding screenshot captured at the same timestamp (if any)
          const matchingScreenshot = session.screenshots.find(screenshot =>
          { console.log('Comparing Image Timestamp:', new Date(image.capturedAt).getTime());
            console.log('With Screenshot Timestamp:', new Date(screenshot.capturedAt).getTime());
          
            return Math.abs(new Date(screenshot.capturedAt).getTime() - new Date(image.capturedAt).getTime())<=1000;

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


// Serve the uploaded files
app.use('/uploads', express.static(uploadDir));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
