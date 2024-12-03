let express = require('express');
let cors = require('cors');
let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let multer = require('multer');
let path = require('path');
let fs = require('fs');

const User = require('./models/user'); // Import User model
const GameSession = require('./models/gameSession'); // Import GameSession model

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

/*
let imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  emotions: [{
    label: { type: String, required: true },
    score: { type: Number, required: true }
  }],
  capturedAt: { type: Date, default: Date.now },
});

let screenshotSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  capturedAt: { type: Date, default: Date.now },
});

let gameSessionSchema = new mongoose.Schema({
  gameSessionId: { type: String, required: true },
  images: [imageSchema],
  screenshots: [screenshotSchema],
  flag: { type: Boolean, default: false, required: true }
});

let userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, default: "child" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emotionAnalysis: [gameSessionSchema],
});

let User = mongoose.model('User', userSchema);
*/
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

// Routes
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
      user: { username: user.username, emotionAnalysis: user.emotionAnalysis }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Fetch all users
// app.get('/api/users', async (req, res) => {
//   try {
//     let users = await User.find({}, { password: 0 }); // Exclude password from results
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users', error: error.message });
//   }
// });
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
    let user = await User.findById(userId).select('emotionAnalysis');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ sessions: user.emotionAnalysis });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game sessions', error: error.message });
  }
});

// Create game session
app.post('/api/create-game-session', async (req, res) => {
  let { username } = req.body;
  if (!username) return res.status(400).json({ message: 'Username is required' });

  let gameSessionId = new mongoose.Types.ObjectId();
  try {
    let user = await User.findOneAndUpdate({ username }, { $push: { emotionAnalysis: { gameSessionId, images: [] } } }, { new: true });
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
    let user = await User.findOneAndUpdate({ username, "emotionAnalysis.gameSessionId": gameSessionId }, { $push: { [`emotionAnalysis.$.${fieldToUpdate}`]: newImage } }, { new: true });

    if (!user) return res.status(404).json({ message: 'User or game session not found' });
    res.status(200).json({ message: 'Image uploaded successfully!', imagePath });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

/*
app.post('/api/analyze/:sessionId', async (req, res) => {
  let { sessionId } = req.params;
  let { username } = req.body;
  if (!username || !sessionId) {
    return res.status(400).json({ message: 'Username and sessionId are required' });
  }
  try {
    let user = await User.findOne({ username, "emotionAnalysis.gameSessionId": sessionId });

    if (!user) {
      return res.status(404).json({ message: 'User or game session not found' });
    }
    let session = user.emotionAnalysis.find(session => session.gameSessionId === sessionId);
    let analysisResults = await Promise.all(session.images.map(async (image) => {
      let imagePath = path.join(uploadDir, image.imageUrl);
      try {
        let result = await analyzeImage(imagePath);
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
});*/

app.post('/api/analyze/:sessionId', async (req, res) => {
  let { sessionId } = req.params;
  let { username } = req.body;

  if (!username || !sessionId) {
    return res.status(400).json({ message: 'Username and sessionId are required' });
  }

  try {
    // Fetch the user and session
    let user = await User.findOne({ username, "emotionAnalysis.gameSessionId": sessionId });
    if (!user) {
      return res.status(404).json({ message: 'User or game session not found' });
    }

    let session = user.emotionAnalysis.find(session => session.gameSessionId === sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    if (!session.flag) {
      // Perform image analysis
      let analysisResults = await Promise.all(session.images.map(async (image) => {
        let imagePath = path.join(uploadDir, image.imageUrl);
        try {
          let result = await analyzeImage(imagePath);
          image.emotions = result.emotions; // Store the emotions
         
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
    else{        console.warn('Some images have no emotions detected. Flag not set to true.');
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

/*
// Utility function to perform emotion analysis
async function showEmotionAnalysis(gameSessionId) {
  let user = await User.findOne({ "emotionAnalysis.gameSessionId": gameSessionId });
  if (!user) {
      throw new Error('User not found');
  }
  
  let gameSession = user.emotionAnalysis.find(session => session.gameSessionId === gameSessionId);
  if (!gameSession) {
      throw new Error('Game session not found');
  }

  if (!gameSession.flag) {  // If flag is false
      // Perform the analysis
      let analysisResult = await Promise.all(gameSession.images.map(async (image) => {
          let imagePath = path.join('uploads', image.imageUrl);
          try {
              let result = await analyzeImage(imagePath);
              image.emotions = result.emotions;
              
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
      
      return gameSession.images;
  }
}*/

/*
const showEmotionAnalysis = async (gameSessionId) => {
  // Find the user with the specified game session ID
  let user = await User.findOne({ "emotionAnalysis.gameSessionId": gameSessionId });
  if (!user) {
      throw new Error('User not found');
  }

  // Find the specific game session
  let gameSession = user.emotionAnalysis.find(session => session.gameSessionId === gameSessionId);
  if (!gameSession) {
      throw new Error('Game session not found');
  }

  // Return stored analysis results, regardless of the flag status
  if (gameSession.images.length === 0) {
      throw new Error('No images found in the game session');
  }

  console.log("Returning stored analysis results");
  console.log(gameSession);
  return gameSession.images;
};
*/

app.post('/api/analysis-summary/:sessionId', async (req, res) => {
  let { sessionId } = req.params;
  let { username } = req.body;

  if (!username || !sessionId) {
    return res.status(400).json({ message: 'Session ID and Username are required' });
  }

  try {
    // Fetch the user and session
    let user = await User.findOne({ username, "emotionAnalysis.gameSessionId": sessionId });
    if (!user) {
      return res.status(404).json({ message: 'User or game session not found' });
    }

    let session = user.emotionAnalysis.find(session => session.gameSessionId === sessionId);
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


/*
// Route to handle analysis summary
app.post('/api/analysis-summary/:sessionId', async (req, res) => {
  let { sessionId } = req.params;  // Extract sessionId from URL parameters
  let { username } = req.body;    // Extract username from the body of the request (if needed for validation)

  console.log(`Session ID: ${sessionId}, Username: ${username}`);

  if (!sessionId || !username) {
    return res.status(400).json({ message: 'Session ID and Username are required' });
  }

  try {
    // Step 1: Call the showEmotionAnalysis function to get analysis results (perform analysis if necessary)
    let analysisResults = await showEmotionAnalysis(sessionId);

    // Step 2: Initialize an object to store emotion score totals (for summary)
    let emotionSummary = {};

    // Step 3: Aggregate the emotion scores from the analyzed results
    analysisResults.forEach(image => {
      if (image.emotions) {
        image.emotions.forEach(emotion => {
          let emotionLabel = emotion.label;
          let emotionScore = emotion.score;

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
*/


app.get('/api/detailed-analysis/:sessionId', async (req, res) => {
  let { sessionId } = req.params;

  try {
    let users = await User.find({}, 'username emotionAnalysis').lean();

    let detailedAnalysis = users.map(user => {
      let sessions = user.emotionAnalysis.filter(session => session.gameSessionId === sessionId);

      return sessions.map(session => ({
        username: user.username,
        gameSessionId: session.gameSessionId,
        imagesWithEmotions: session.images.map(image => {
          // Find the corresponding screenshot captured at the same timestamp (if any)
          let matchingScreenshot = session.screenshots.find(screenshot =>
          { console.log('Comparing Image Timestamp:', new Date(image.capturedAt).getTime());
            console.log('With Screenshot Timestamp:', new Date(screenshot.capturedAt).getTime());
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


// Serve the uploaded files
app.use('/uploads', express.static(uploadDir));

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
