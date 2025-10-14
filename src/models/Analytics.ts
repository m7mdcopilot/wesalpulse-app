import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  company: mongoose.Types.ObjectId;
  date: Date;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  callCenter: {
    totalCalls: number;
    answeredCalls: number;
    abandonedCalls: number;
    missedCalls: number;
    averageWaitTime: number;
    averageHandleTime: number;
    averageTalkTime: number;
    serviceLevel: number;
    occupancy: number;
    efficiency: number;
  };
  queues: Array<{
    queue: mongoose.Types.ObjectId;
    queueName: string;
    totalCalls: number;
    answeredCalls: number;
    abandonedCalls: number;
    averageWaitTime: number;
    averageHandleTime: number;
    serviceLevel: number;
    longestWaitTime: number;
  }>;
  agents: Array<{
    agent: mongoose.Types.ObjectId;
    agentName: string;
    totalCalls: number;
    answeredCalls: number;
    averageHandleTime: number;
    averageTalkTime: number;
    averageWrapTime: number;
    satisfaction: number;
    qualityScore: number;
    adherence: number;
  }>;
  performance: {
    callsPerHour: number;
    averageSpeedOfAnswer: number;
    abandonRate: number;
    firstCallResolution: number;
    customerSatisfaction: number;
    netPromoterScore?: number;
    costPerCall?: number;
    revenuePerCall?: number;
  };
  trends: {
    callVolume: number[];
    waitTimes: number[];
    handleTimes: number[];
    satisfaction: number[];
    serviceLevels: number[];
  };
  insights: {
    peakHours: number[];
    busyQueues: mongoose.Types.ObjectId[];
    topAgents: mongoose.Types.ObjectId[];
    issues: string[];
    recommendations: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const analyticsSchema = new Schema<IAnalytics>({
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  period: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly'],
    required: true
  },
  callCenter: {
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
    missedCalls: {
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
    averageTalkTime: {
      type: Number,
      default: 0
    },
    serviceLevel: {
      type: Number,
      default: 0
    },
    occupancy: {
      type: Number,
      default: 0
    },
    efficiency: {
      type: Number,
      default: 0
    }
  },
  queues: [{
    queue: {
      type: Schema.Types.ObjectId,
      ref: 'Queue'
    },
    queueName: {
      type: String,
      required: true
    },
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
    longestWaitTime: {
      type: Number,
      default: 0
    }
  }],
  agents: [{
    agent: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    agentName: {
      type: String,
      required: true
    },
    totalCalls: {
      type: Number,
      default: 0
    },
    answeredCalls: {
      type: Number,
      default: 0
    },
    averageHandleTime: {
      type: Number,
      default: 0
    },
    averageTalkTime: {
      type: Number,
      default: 0
    },
    averageWrapTime: {
      type: Number,
      default: 0
    },
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
    adherence: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  performance: {
    callsPerHour: {
      type: Number,
      default: 0
    },
    averageSpeedOfAnswer: {
      type: Number,
      default: 0
    },
    abandonRate: {
      type: Number,
      default: 0
    },
    firstCallResolution: {
      type: Number,
      default: 0
    },
    customerSatisfaction: {
      type: Number,
      default: 0
    },
    netPromoterScore: {
      type: Number
    },
    costPerCall: {
      type: Number
    },
    revenuePerCall: {
      type: Number
    }
  },
  trends: {
    callVolume: [{
      type: Number
    }],
    waitTimes: [{
      type: Number
    }],
    handleTimes: [{
      type: Number
    }],
    satisfaction: [{
      type: Number
    }],
    serviceLevels: [{
      type: Number
    }]
  },
  insights: {
    peakHours: [{
      type: Number
    }],
    busyQueues: [{
      type: Schema.Types.ObjectId,
      ref: 'Queue'
    }],
    topAgents: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    issues: [{
      type: String,
      trim: true
    }],
    recommendations: [{
      type: String,
      trim: true
    }]
  }
}, {
  timestamps: true
});

// Index for faster queries
analyticsSchema.index({ company: 1, date: -1 });
analyticsSchema.index({ company: 1, period: 1 });
analyticsSchema.index({ date: 1, period: 1 });

// Compound index for date range queries
analyticsSchema.index({ company: 1, date: 1, period: 1 });

// Export only the schema and interface, not the model
export { analyticsSchema, IAnalytics };