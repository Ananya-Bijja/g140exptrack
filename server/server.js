let express = require('express');
let cors = require('cors');
let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let multer = require('multer');
let path = require('path');
let fs = require('fs');


let app = express();
let PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://ananya_ansh:Ananya%40123%24@cluster0.3p1q6.mongodb.net/g140?', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});


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


// Define schema for each game session
let gameSessionSchema = new mongoose.Schema({
  gameSessionId: { type: String, required: true },
  images: [imageSchema],
  screenshots: [screenshotSchema],
  flag:{type: Boolean,default:false,required: true}
  
});

// Define main User schema without images, uploadDate, and analysisResult fields
let userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role:{type:String,default:"child"},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emotionAnalysis: [gameSessionSchema],
});

let User = mongoose.model('User', userSchema);

let uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Set up storage for images
let storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, `image_${Date.now()}${path.extname(file.originalname)}`),
});

let upload = multer({ storage, limits: { fileSize: 1000000 } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Signup route
app.post('/api/signup', async (req, res) => {
  let { username, email, password } = req.body;

  let existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ message: 'Username or Email already exists' });
  }

  let hashedPassword = await bcrypt.hash(password, 10);

  let newUser = new User({
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
  let { username, password } = req.body;

  try {
    if (username.endsWith('@admin')) {
      return res.status(200).json({
        message: 'Admin login successful',
        isAdmin: true,
        user: { username, emotionAnalysis: [] },
      });
    }

    let user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    let isPasswordMatch = await bcrypt.compare(password, user.password);
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
    let users = await User.find({}, { password: 0 }); // Exclude password from results
    res.status(200).json(users);
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  
  }

});


// Fetch game sessions for a specific user
app.get('/api/game-sessions/:userId', async (req, res) => {
  let { userId } = req.params;
  try {
    // Find the user and populate the emotionAnalysis field to include game sessions
    let user = await User.findById(userId).select('emotionAnalysis'); // Assuming 'emotionAnalysis' contains the sessions
    if (!user) {
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
  let { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    // Generate a unique game session ID
    let gameSessionId =new mongoose.Types.ObjectId(); // Implement this function to create unique IDs

    // Update the user's document to add a new game session
    let user = await User.findOneAndUpdate(
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
  let { username, gameSessionId,type } = req.body;
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
    let user = await User.findOne({ username });

if (!user) {
  // Handle case where user is not found
  console.error('User not found');
  return; // or throw an error
}

// Check if the emotionAnalysis array contains the gameSessionId
let sessionIndex = user.emotionAnalysis.findIndex(session => session.gameSessionId === gameSessionId);

if (sessionIndex === -1) {
  // No session exists, so create a new session
  user.emotionAnalysis.push({ gameSessionId, images: [], screenshots: []  });
  await user.save(); // Save the user with the new session
  sessionIndex = user.emotionAnalysis.length - 1;
 
}
let fieldToUpdate = type === 'screenshot' ? 'screenshots' : 'images';

// Now you can push the new image to the existing or newly created session
let test =await User.findOneAndUpdate(
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
          { 
          
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
