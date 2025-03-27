import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: [String],
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  duration: { type: Number },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Video', videoSchema);
