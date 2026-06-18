const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company_name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: [2, 'Company name must be at least 2 characters'],
    },
    job_title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    job_type: {
      type: String,
      required: [true, 'Job type is required'],
      enum: ['Internship', 'Full-time', 'Part-time'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['Applied', 'Interviewing', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    applied_date: {
      type: String,
      required: [true, 'Applied date is required'],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Format schema to JSON output that matches the frontend fields
ApplicationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    if (ret.createdAt) {
      ret.created_at = ret.createdAt.toISOString();
      delete ret.createdAt;
    }
    if (ret.updatedAt) {
      ret.updated_at = ret.updatedAt.toISOString();
      delete ret.updatedAt;
    }
    return ret;
  },
});

module.exports = mongoose.model('Application', ApplicationSchema);
