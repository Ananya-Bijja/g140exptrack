let express = require('express');
let cors = require('cors');
let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let multer = require('multer');
let path = require('path');
let fs = require('fs');

let app = express();
let PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect('mongodb+srv://Vinuthna:Vinnu2005@cluster0.uyw64.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Schemas
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

// Directory Setup for Image Uploads
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
app.get('/api/users', async (req, res) => {
  try {
    let users = await User.find({}, { password: 0 }); // Exclude password from results
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

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
