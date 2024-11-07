const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Import uuid for unique ID generation

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

// Define schema for image emotion analysis data within a game session
/*const imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  emotions: {
    happy: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    angry: { type: Number, default: 0 },
    surprised: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
  },
  capturedAt: { type: Date, default: Date.now },
});*/

const imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  emotions: [{
    label: { type: String, required: true },
    score: { type: Number, required: true }
  }],
  capturedAt: { type: Date, default: Date.now },
});


// Define schema for each game session
const gameSessionSchema = new mongoose.Schema({
  gameSessionId: { type: String, required: true },
  images: [imageSchema],
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

// Helper function to generate a unique game session ID
function generateGameSessionId() {
  return uuidv4(); // Generate a unique ID using uuid
}

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
    console.log('Fetched user:', user);
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

// Example function to generate a unique game session ID
const generateUniqueGameSessionId = () => {
  return 'game-' + Date.now(); // Simple example; consider a better strategy for uniqueness
};
app.post('/upload', upload.single('file'), async (req, res) => {
  const { username, gameSessionId } = req.body;
  // Validate request body
  if (!username || !gameSessionId || !req.file) {
    return res.status(400).json({ message: 'Username, gameSessionId, and image are required' });
  }

  const imagePath = req.file.filename;

  try {
    const newImage = {
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
  user.emotionAnalysis.push({ gameSessionId, images: [] });
  await user.save(); // Save the user with the new session

  console.log('New game session created:', gameSessionId);
}

// Now you can push the new image to the existing or newly created session
const test =await User.findOneAndUpdate(
  { username, "emotionAnalysis.gameSessionId": gameSessionId },
  { $push: { "emotionAnalysis.$.images": newImage } },
  { new: true }
);

    
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
      console.log(`Analyzing image: ${imagePath}`);

      try {
        const result = await analyzeImage(imagePath);
        console.log(`Analysis result for image ${image.imageUrl}:`, result);
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
/*
// Analyze images in a game session
app.post('/api/analyze/:sessionId', async (req, res) => {

  const { sessionId } = req.params;
  const { username } = req.body; // Assuming you send username in the request body

  if (!username || !sessionId) {
    return res.status(400).json({ message: 'Username and sessionId are required' });
  }

  try {
    const user = await User.findOne({ username, "emotionAnalysis.gameSessionId": sessionId });

    if (!user) {
      return res.status(404).json({ message: 'User or game session not found' });
    }

    // Find the images associated with the specified session
    const session = user.emotionAnalysis.find(session => session.gameSessionId === sessionId);
    const analysisResults = await Promise.all(session.images.map(async (image) => {
      const imagePath = path.join(uploadDir, image.imageUrl);
      const result = await analyzeImage(imagePath);
      return { ...image, analysisResult: result }; // Include analysis result in the response
    }));

    res.status(200).json({ result: analysisResults });
  } catch (error) {
    console.error('Error analyzing session:', error);
    res.status(500).json({ message: 'Error analyzing session', error: error.message });
  }
});
*/

/*
// Helper function to analyze image using Hugging Face API
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

// Log the status and full response for debugging
console.log(`Hugging Face API response status: ${response.status}`);
if (!response.ok) {
  const errorText = await response.text();
  console.error(`Hugging Face API error: ${errorText}`);
  throw new Error(`API error: ${response.statusText}`);
}

const result = await response.json();
console.log('Hugging Face API result:', result);

    // Map API response to fit your schema
    const emotions = {
      happy: result.happy || 0,
      sad: result.sad || 0,
      angry: result.angry || 0,
      surprised: result.surprised || 0,
      neutral: result.neutral || 0,
    };

    return emotions; // Return the emotions object directly
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}*/

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
app.post('/analyze/:id', async (req, res) => {
  try {
    // Find the user by their image ID
    const user = await User.findOne({ "emotionAnalysis.images._id": req.params.id });
    
    // Check if the user and image entry exist
    if (!user) return res.status(404).json({ message: 'Image not found.' });

    // Locate the specific image entry in the user's emotionAnalysis
    const imageEntry = user.emotionAnalysis
      .flatMap(session => session.images)
      .find(image => image._id.toString() === req.params.id);

    if (!imageEntry) return res.status(404).json({ message: 'Image not found.' });

    // Analyze the image using the provided path
    const result = await analyzeImage(path.join(uploadDir, imageEntry.imageUrl)); // Assuming imageUrl has the correct path

    // Update analysis result in the image entry
    imageEntry.analysisResult = result;
    await user.save(); // Save the updated user document

    res.status(200).json({ message: 'Analysis complete', result });
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ message: 'Error analyzing image', error: error.message });
  }
});
/*
app.get('/api/analysis-summary', async (req, res) => {
  try {
    const users = await User.find({}, 'emotionAnalysis').lean();
    
    // Aggregate emotions counts across all users and sessions
    const emotionCounts = {};

    users.forEach(user => {
      user.emotionAnalysis.forEach(session => {
        session.images.forEach(image => {
          if (image.emotions) {
            image.emotions.forEach(emotion => {
              if (emotionCounts[emotion]) {
                emotionCounts[emotion] += 1;
              } else {
                emotionCounts[emotion] = 1;
              }
            });
          }
        });
      });
    });

    res.status(200).json(emotionCounts);
  } catch (err) {
    console.error('Error fetching analysis summary:', err);
    res.status(500).json({ message: 'Error fetching analysis summary', error: err.message });
  }
});
*/

/*

app.get('/api/analysis-summary', async (req, res) => {
  try {
    // Fetch users and extract their emotionAnalysis data
    const users = await User.find({}, 'emotionAnalysis').lean();
    
    // Initialize an object to store emotion counts
    const emotionCounts = {};

    // Loop through users and their emotion analysis sessions
    users.forEach(user => {
      user.emotionAnalysis.forEach(session => {
        session.images.forEach(image => {
          if (image.emotions) {
            image.emotions.forEach(emotion => {
              const emotionLabel = emotion.label;
              if (emotionCounts[emotionLabel]) {
                emotionCounts[emotionLabel] += 1; // Increment count if the emotion is already present
              } else {
                emotionCounts[emotionLabel] = 1; // Initialize count if the emotion is encountered for the first time
              }
            });
          }
        });
      });
    });
    console.log(emotionCounts); // Log the counts for debugging
    // Send the aggregated emotion counts as the response
    res.status(200).json(emotionCounts);
  } catch (err) {
    console.error('Error fetching analysis summary:', err);
    res.status(500).json({ message: 'Error fetching analysis summary', error: err.message });
  }
});*/

/*
app.get('/api/analysis-summary', async (req, res) => {
  try {
    // Fetch users and extract their emotionAnalysis data
    const users = await User.find({}, 'emotionAnalysis').lean();
    
    // Initialize an object to store emotion counts
    const emotionCounts = {};

    // Loop through users and their emotion analysis sessions
    users.forEach(user => {
      user.emotionAnalysis.forEach(session => {
        session.images.forEach(image => {
          if (image.emotions) {
            image.emotions.forEach(emotion => {
              const emotionLabel = emotion.label;
              if (emotionCounts[emotionLabel]) {
                emotionCounts[emotionLabel] += 1; // Increment count if the emotion is already present
              } else {
                emotionCounts[emotionLabel] = 1; // Initialize count if the emotion is encountered for the first time
              }
            });
          }
        });
      });
    });

    console.log(emotionCounts); // Log the counts for debugging

    // Send the aggregated emotion counts as the response
    res.status(200).json(emotionCounts);
  } catch (err) {
    console.error('Error fetching analysis summary:', err);
    res.status(500).json({ message: 'Error fetching analysis summary', error: err.message });
  }
});
*/

/*
app.get('/api/analysis-summary', async (req, res) => {
  try {
    // Fetch users and extract their emotionAnalysis data
    const users = await User.find({}, 'emotionAnalysis').lean();
    
    // Initialize an object to store emotion counts
    const emotionCounts = {};

    // Loop through users and their emotion analysis sessions
    users.forEach(user => {
      user.emotionAnalysis.forEach(session => {
        session.images.forEach(image => {
          if (image.emotions) {
            image.emotions.forEach(emotion => {
              const emotionLabel = emotion.label;
              // Increment the count for each emotion found in the image
              if (emotionCounts[emotionLabel]) {
                emotionCounts[emotionLabel] += 1; // Increment count if the emotion is already present
              } else {
                emotionCounts[emotionLabel] = 1; // Initialize count if the emotion is encountered for the first time
              }
            });
          }
        });
      });
    });
    
    console.log(emotionCounts); // Log the counts for debugging
    // Send the aggregated emotion counts as the response
    res.status(200).json(emotionCounts);
  } catch (err) {
    console.error('Error fetching analysis summary:', err);
    res.status(500).json({ message: 'Error fetching analysis summary', error: err.message });
  }
});
*/
/*
app.get('/api/analysis-summary', async (req, res) => {
  try {
    // Fetch users and extract their emotionAnalysis data
    const users = await User.find({}, 'emotionAnalysis').lean();
    
    // Initialize an object to store emotion counts
    const emotionCounts = {};

    // Loop through users and their emotion analysis sessions
    users.forEach(user => {
      user.emotionAnalysis.forEach(session => {
        session.images.forEach(image => {
          if (image.emotions) {
            image.emotions.forEach(emotion => {
              const emotionLabel = emotion.label;
              
              // Log emotion data to verify what you're getting
              console.log(`Processing emotion: ${emotionLabel} with score: ${emotion.score}`);
              
              // Increment the emotion count
              if (emotionCounts[emotionLabel]) {
                emotionCounts[emotionLabel] += 1;
              } else {
                emotionCounts[emotionLabel] = 1;
              }
            });
          }
        });
      });
    });

    // Log the emotion counts object to see if it's accumulating properly
    console.log('Final emotion counts:', emotionCounts);

    // Send the aggregated emotion counts as the response
    res.status(200).json(emotionCounts);
  } catch (err) {
    console.error('Error fetching analysis summary:', err);
    res.status(500).json({ message: 'Error fetching analysis summary', error: err.message });
  }
});

*/
/*
app.get('/api/analysis-summary:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const { username } = req.body;

  if (!username || !sessionId) {
    return res.status(400).json({ message: 'Username and sessionId are required' });
  }


  try {
    // Fetch users and extract their emotionAnalysis data
    const users = await User.find({}, 'emotionAnalysis').lean();
    
    // Initialize an object to store emotion score totals (for summary)
    const emotionSummary = {};

    // Loop through users and their emotion analysis sessions
    users.forEach(user => {
      user.emotionAnalysis.forEach(session => {
        session.images.forEach(image => {
          if (image.emotions) {
            image.emotions.forEach(emotion => {
              const emotionLabel = emotion.label;
              const emotionScore = emotion.score;

              // Log emotion data to verify what's being processed
              console.log(`Processing emotion: ${emotionLabel} with score: ${emotionScore}`);
              
              // Accumulate the scores for each emotion label
              emotionSummary[emotionLabel] = (emotionSummary[emotionLabel] || 0) + emotionScore;
            });
          }
        });
      });
    });

    // Log the emotion summary to check the accumulated scores
    console.log('Final emotion summary:', emotionSummary);

    // Send the aggregated emotion summary as the response
    res.status(200).json(emotionSummary);
  } catch (err) {
    console.error('Error fetching analysis summary:', err);
    res.status(500).json({ message: 'Error fetching analysis summary', error: err.message });
  }
});
*/




/*
app.get('/api/analysis-summary/:sessionId', async (req, res) => {
  const { sessionId } = req.params;  // Get sessionId from the route params
  const { username } = req.body;    // Get username from the request body


  console.log(sessionId)
  if (!username || !sessionId) {
    return res.status(400).json({ message: 'Username and sessionId are required' });
  }

  try {
    // Fetch users and extract their emotionAnalysis data
    const users = await User.find({}, 'emotionAnalysis').lean();
    
    // Initialize an object to store emotion score totals (for summary)
    const emotionSummary = {};

    // Loop through users and their emotion analysis sessions
    users.forEach(user => {
      user.emotionAnalysis.forEach(session => {
        // Check if the sessionId matches the requested sessionId
        if (session.gameSessionId === sessionId) {
          session.images.forEach(image => {
            if (image.emotions) {
              image.emotions.forEach(emotion => {
                const emotionLabel = emotion.label;
                const emotionScore = emotion.score;

                // Accumulate the scores for each emotion label
                emotionSummary[emotionLabel] = (emotionSummary[emotionLabel] || 0) + emotionScore;
              });
            }
          });
        }
      });
    });

    // Send the aggregated emotion summary as the response
    res.status(200).json(emotionSummary);
  } catch (err) {
    console.error('Error fetching analysis summary:', err);
    res.status(500).json({ message: 'Error fetching analysis summary', error: err.message });
  }
});*/




app.post('/api/analysis-summary/:sessionId', async (req, res) => {
  const { sessionId } = req.params;  // Extract sessionId from URL parameters
  const { username } = req.body;    // Extract username from the body of the request (if needed for validation)

  console.log(`Session ID: ${sessionId}, Username: ${username}`);

  if (!sessionId||!username) {
    return res.status(400).json({ message: 'Session ID is required' });
  }

  try {
    // Fetch all users and their emotion analysis data
    const users = await User.find({}, 'emotionAnalysis').lean();

    // Initialize an object to store emotion score totals (for summary)
    const emotionSummary = {};

    // Loop through each user and their emotion analysis sessions
    users.forEach(user => {
      user.emotionAnalysis.forEach(session => {
        // Check if the sessionId matches the requested sessionId
        if (session.gameSessionId === sessionId) {
          session.images.forEach(image => {
            if (image.emotions) {
              image.emotions.forEach(emotion => {
                const emotionLabel = emotion.label;
                const emotionScore = emotion.score;

                // Accumulate the scores for each emotion label
                emotionSummary[emotionLabel] = (emotionSummary[emotionLabel] || 0) + emotionScore;
              });
            }
          });
        }
      });
    });

    // Send the aggregated emotion summary as the response
    res.status(200).json(emotionSummary);
  } catch (err) {
    console.error('Error fetching analysis summary:', err);
    res.status(500).json({ message: 'Error fetching analysis summary', error: err.message });
  }
});



/*
app.get('/api/detailed-analysis', async (req, res) => {
  try {
    const users = await User.find({}, 'username emotionAnalysis').lean();

    const detailedAnalysis = await Promise.all(
      users.map(async (user) => {
        const sessions = await Promise.all(
          user.emotionAnalysis.map(async (session) => {
            const totalEmotions = {
              happy: 0,
              sad: 0,
              angry: 0,
              surprised: 0,
              neutral: 0,
            };
            let imageCount = 0;

            for (const image of session.images) {
              const imagePath = image.filePath; // Adjust if your image data is stored differently

              // Call the analyzeImage function for each image
              const emotions = await analyzeImage(imagePath);

              // Aggregate emotions for each image
              totalEmotions.happy += emotions.happy;
              totalEmotions.sad += emotions.sad;
              totalEmotions.angry += emotions.angry;
              totalEmotions.surprised += emotions.surprised;
              totalEmotions.neutral += emotions.neutral;
              imageCount++;
            }

            return {
              gameSessionId: session.gameSessionId,
              totalEmotions,
              imageCount,
              capturedAt: session.images[0]?.capturedAt || null,
            };
          })
        );

        return { username: user.username, sessions };
      })
    );

    res.status(200).json(detailedAnalysis);
  } catch (error) {
    console.error('Error in detailed analysis:', error);
    res.status(500).json({ message: 'Error in detailed analysis', error: error.message });
  }
});

*/
/*
app.get('/api/detailed-analysis', async (req, res) => {
  try {
    const users = await User.find({}, 'username emotionAnalysis').lean();
    
    const detailedAnalysis = await Promise.all(
      users.map(async (user) => {
        const sessions = await Promise.all(
          user.emotionAnalysis.map(async (session) => {
            let imageCount = 0;
            
            // Process each image and its emotions dynamically
            const imagesWithEmotions = await Promise.all(
              session.images.map(async (image) => {
                const imagePath = image.filePath; // Adjust if your image data is stored differently

                // Assuming analyzeImage function returns an object with emotion labels as keys and scores as values
                const emotions = await analyzeImage(imagePath);

                // Return the image data and the dynamic emotion scores
                imageCount++;

                return {
                  imagePath,
                  emotions, // Use the dynamic emotions from analyzeImage
                  capturedAt: image.capturedAt || null, // Use capturedAt timestamp if available
                };
              })
            );
            
            
            return {
              gameSessionId: session.gameSessionId,
              imagesWithEmotions,
              imageCount,
              capturedAt: session.images[0]?.capturedAt || null,
            };
          })
        );

        return { username: user.username, sessions };
      })
    );
    console.log('Sending response:', detailedAnalysis);
    res.status(200).json(detailedAnalysis);
  } catch (error) {
    console.error('Error in detailed analysis:', error);
    res.status(500).json({ message: 'Error in detailed analysis', error: error.message });
  }
});

*/
/*
app.get('/api/detailed-analysis/:sessionId', async (req, res) => {
  try {
    // Fetch all users with their emotion analysis data
    const{sessionId}=req.params;
    const users = await User.find({}, 'username emotionAnalysis').lean();
    
    // Process each user's emotion analysis data
    const detailedAnalysis = await Promise.all(
      users.map(async (user) => {
        const sessions = await Promise.all(
          user.emotionAnalysis.map(async (session) => {
            if (session.gameSessionId === sessionId) {

            // Process each image from the session and use existing emotion data
            const imagesWithEmotions = session.images.map((image) => {
              const imagePath = image.imageUrl; // Assuming the file path is stored in 'filePath'
              const emotions = image.emotions || {}; // Use stored emotions from MongoDB

              

              return {
                imagePath,
                emotions, // Using the stored emotion data
                capturedAt: image.capturedAt || null, // If 'capturedAt' exists, use it
              };
            });

            return {
              gameSessionId: session.gameSessionId,
              imagesWithEmotions,
              
            };
          }
          })
        );

        return { username: user.username, sessions:sessions.filter(Boolean) };
      })
    );

    console.log('Sending response:', detailedAnalysis);
    res.status(200).json(detailedAnalysis);
  } catch (error) {
    console.error('Error in detailed analysis:', error);
    res.status(500).json({ message: 'Error in detailed analysis', error: error.message });
  }
});
*/


app.get('/api/detailed-analysis/:sessionId', async (req, res) => {
  const { sessionId } = req.params;  // Extract sessionId from URL

  try {
    // Fetch all users with their emotion analysis data
    const users = await User.find({}, 'username emotionAnalysis').lean();

    // Filter sessions based on the requested sessionId
    const detailedAnalysis = await Promise.all(
      users.map(async (user) => {
        const sessions = user.emotionAnalysis.filter(session => session.gameSessionId === sessionId);

        // Process each session's images and emotions
        const sessionsWithImages = await Promise.all(
          sessions.map(async (session) => {
            const imagesWithEmotions = session.images.map((image) => {
              const imagePath = image.imageUrl;
              const emotions = image.emotions || {};  // Use stored emotions

              return {
                imagePath,
                emotions,
                capturedAt: image.capturedAt || null,
              };
            });

            return {
              gameSessionId: session.gameSessionId,
              imagesWithEmotions,
            };
          })
        );

        return { username: user.username, sessions: sessionsWithImages };
      })
    );

    res.status(200).json(detailedAnalysis);
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
