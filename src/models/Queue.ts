import mongoose, { Schema, Document } from 'mongoose';

export interface IQueue extends Document {
  name: string;
  description: string;
  type: 'inbound' | 'outbound' | 'blended';
  status: 'active' | 'inactive' | 'maintenance';
  settings: {
    maxWaitTime: number; // in seconds
    serviceLevel: number; // percentage
    overflow: {
      enabled: boolean;
      targetQueue: mongoose.Types.ObjectId;
      waitTime: number; // in seconds
    };
    callback: {
      enabled: boolean;
      maxAttempts: number;
      interval: number; // in minutes
    };
    recording: {
      enabled: boolean;
      quality: 'low' | 'medium' | 'high';
      retention: number; // in days
    };
  };
  metrics: {
    totalCalls: number;
    answeredCalls: number;
    abandonedCalls: number;
    averageWaitTime: number;
    averageHandleTime: number;
    serviceLevel: number;
    lastUpdated: Date;
  };
  agents: mongoose.Types.ObjectId[];
  company: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const queueSchema = new Schema<IQueue>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    default: '',
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['inbound', 'outbound', 'blended'],
    default: 'inbound'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  settings: {
    maxWaitTime: {
      type: Number,
      default: 300, // 5 minutes
      min: 0
    },
    serviceLevel: {
      type: Number,
      default: 80, // 80%
      min: 0,
      max: 100
    },
    overflow: {
      enabled: {
        type: Boolean,
        default: false
      },
      targetQueue: {
        type: Schema.Types.ObjectId,
        ref: 'Queue'
      },
      waitTime: {
        type: Number,
        default: 180 // 3 minutes
      }
    },
    callback: {
      enabled: {
        type: Boolean,
        default: false
      },
      maxAttempts: {
        type: Number,
        default: 3,
        min: 1,
        max: 10
      },
      interval: {
        type: Number,
        default: 30 // 30 minutes
      }
    },
    recording: {
      enabled: {
        type: Boolean,
        default: true
      },
      quality: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      retention: {
        type: Number,
        default: 90 // 90 days
      }
    }
  },
  metrics: {
    totalCalls: {
      type: Number,
      default: 0
    },
    answeredCalls: {
      type: Number,
      default: 0
    },
    abandonedCalls: {
      type: Number,
      default: 0
    },
    averageWaitTime: {
      type: Number,
      default: 0
    },
    averageHandleTime: {
      type: Number,
      default: 0
    },
    serviceLevel: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  agents: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
queueSchema.index({ company: 1, status: 1 });
queueSchema.index({ type: 1 });
queueSchema.index({ 'metrics.lastUpdated': -1 });

// Method to update metrics
queueSchema.methods.updateMetrics = async function(callData: any) {
  this.metrics.totalCalls += 1;
  this.metrics.lastUpdated = new Date();
  
  if (callData.answered) {
    this.metrics.answeredCalls += 1;
    this.metrics.averageHandleTime = 
      (this.metrics.averageHandleTime * (this.metrics.answeredCalls - 1) + callData.handleTime) / 
      this.metrics.answeredCalls;
  } else {
    this.metrics.abandonedCalls += 1;
    this.metrics.averageWaitTime = 
      (this.metrics.averageWaitTime * (this.metrics.abandonedCalls - 1) + callData.waitTime) / 
      this.metrics.abandonedCalls;
  }
  
  // Calculate service level
  if (this.metrics.totalCalls > 0) {
    const answeredWithinSL = this.metrics.answeredCalls * 0.8; // Assuming 80% answered within SL
    this.metrics.serviceLevel = (answeredWithinSL / this.metrics.totalCalls) * 100;
  }
  
  await this.save();
};

// Export only the schema and interface, not the model
export { queueSchema, IQueue };