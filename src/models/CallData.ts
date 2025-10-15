import mongoose, { Schema, Document } from 'mongoose';

export interface ICallData extends Document {
  callId: string;
  direction: 'inbound' | 'outbound';
  status: 'ringing' | 'answered' | 'abandoned' | 'completed' | 'failed';
  customer: {
    name: string;
    phone: string;
    email?: string;
    accountNumber?: string;
  };
  agent: mongoose.Types.ObjectId;
  queue: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  timing: {
    startTime: Date;
    answerTime?: Date;
    endTime?: Date;
    waitTime: number; // in seconds
    handleTime: number; // in seconds
    talkTime: number; // in seconds
    holdTime: number; // in seconds
  };
  outcome: {
    resolved: boolean;
    category: string;
    subcategory?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    notes?: string;
    tags: string[];
  };
  recording?: {
    url: string;
    duration: number;
    size: number;
    format: string;
  };
  quality: {
    satisfaction?: number; // 1-5 scale
    qualityScore?: number; // 0-100 scale
    sentiment?: 'positive' | 'neutral' | 'negative';
    issues?: string[];
  };
  metadata: {
    source: string;
    campaign?: string;
    disposition: string;
    transferred: boolean;
    conference: boolean;
    ivrPath?: string[];
    skills: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const callDataSchema = new Schema<ICallData>({
  callId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true
  },
  status: {
    type: String,
    enum: ['ringing', 'answered', 'abandoned', 'completed', 'failed'],
    required: true
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    accountNumber: {
      type: String,
      trim: true
    }
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  queue: {
    type: Schema.Types.ObjectId,
    ref: 'Queue',
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  timing: {
    startTime: {
      type: Date,
      required: true
    },
    answerTime: {
      type: Date
    },
    endTime: {
      type: Date
    },
    waitTime: {
      type: Number,
      default: 0,
      min: 0
    },
    handleTime: {
      type: Number,
      default: 0,
      min: 0
    },
    talkTime: {
      type: Number,
      default: 0,
      min: 0
    },
    holdTime: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  outcome: {
    resolved: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    subcategory: {
      type: String,
      trim: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  recording: {
    url: {
      type: String,
      trim: true
    },
    duration: {
      type: Number,
      min: 0
    },
    size: {
      type: Number,
      min: 0
    },
    format: {
      type: String,
      trim: true
    }
  },
  quality: {
    satisfaction: {
      type: Number,
      min: 1,
      max: 5
    },
    qualityScore: {
      type: Number,
      min: 0,
      max: 100
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative']
    },
    issues: [{
      type: String,
      trim: true
    }]
  },
  metadata: {
    source: {
      type: String,
      required: true,
      trim: true
    },
    campaign: {
      type: String,
      trim: true
    },
    disposition: {
      type: String,
      required: true,
      trim: true
    },
    transferred: {
      type: Boolean,
      default: false
    },
    conference: {
      type: Boolean,
      default: false
    },
    ivrPath: [{
      type: String,
      trim: true
    }],
    skills: [{
      type: String,
      trim: true
    }]
  }
}, {
  timestamps: true
});

// Index for faster queries
callDataSchema.index({ company: 1, timing: { startTime: -1 } });
callDataSchema.index({ agent: 1, timing: { startTime: -1 } });
callDataSchema.index({ queue: 1, timing: { startTime: -1 } });
callDataSchema.index({ status: 1 });
callDataSchema.index({ 'outcome.category': 1 });
callDataSchema.index({ 'customer.phone': 1 });

// Pre-save middleware to calculate times
callDataSchema.pre('save', function(next) {
  if (this.timing.answerTime && this.timing.startTime) {
    this.timing.waitTime = Math.floor((this.timing.answerTime.getTime() - this.timing.startTime.getTime()) / 1000);
  }
  
  if (this.timing.endTime && this.timing.answerTime) {
    this.timing.handleTime = Math.floor((this.timing.endTime.getTime() - this.timing.answerTime.getTime()) / 1000);
  }
  
  next();
});

// Export only the schema and interface, not the model
export { callDataSchema, ICallData };