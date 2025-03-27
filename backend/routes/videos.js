import express from 'express';
import multer from 'multer';
import Video from '../models/Video.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Upload video
router.post('/upload', auth, upload.single('video'), async (req, res) => {
  try {
    // Generate some metadata; you can add your logic here for duration etc.
    const { title, description, tags } = req.body;
    const video = new Video({
      user: req.user.id,
      title,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      fileName: req.file.filename,
      fileSize: req.file.size,
      duration: Math.floor(Math.random() * 300) + 60, // random duration between 1-6 mins
    });
    await video.save();
    res.status(201).json({ message: 'Video uploaded successfully', video });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get videos with filtering and pagination
router.get('/', auth, async (req, res) => {
  try {
    const { title, page = 1, limit = 10 } = req.query;
    const filter = { user: req.user.id };
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    const videos = await Video.find(filter)
      .sort({ uploadedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single video details
router.get('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findOne({ _id: req.params.id, user: req.user.id });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
