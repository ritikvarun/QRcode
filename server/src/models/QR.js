import mongoose from 'mongoose';

const qrSchema = new mongoose.Schema(
  {
    qrId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'QR code title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    destinationUrl: {
      type: String,
      required: [true, 'Destination URL is required'],
      trim: true,
    },
    shortUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'disabled'],
      default: 'active',
      index: true,
    },
    scanCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    folder: {
      type: String,
      trim: true,
      default: 'No Folder',
    },
    qrDataUrl: {
      type: String,
      required: false,
    },
    lastScannedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast dashboard listing and search
qrSchema.index({ createdAt: -1 });
qrSchema.index({ title: 'text', folder: 'text' });

const QR = mongoose.model('QR', qrSchema);

export default QR;
