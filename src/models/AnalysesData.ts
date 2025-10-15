import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysesData extends Document {
  companyId: mongoose.Types.ObjectId;
  refreshDate: Date;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  analysisType: 'performance' | 'trends' | 'quality' | 'efficiency' | 'customer_experience';
  metrics: {
    overall: {
      score: number;
      trend: 'up' | 'down' | 'stable';
      change: number;
      description: string;
    };
    detailed: Array<{
      name: string;
      value: number;
      target?: number;
      unit: string;
      trend: 'up' | 'down' | 'stable';
      change: number;
      description: string;
    }>;
  };
  comparisons: {
    previousPeriod: {
      value: number;
      change: number;
      changePercent: number;
    };
    target: {
      value: number;
      achieved: boolean;
      variance: number;
    };
    industry: {
      value: number;
      benchmark: string;
      position: 'above' | 'below' | 'at';
    };
  };
  insights: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    recommendations: string[];
  };
  trends: {
    labels: string[];
    data: number[];
    comparisons?: {
      previousPeriod: number[];
      targets: number[];
    };
  };
  breakdowns: {
    byQueue: Array<{
      queueId: mongoose.Types.ObjectId;
      queueName: string;
      value: number;
      trend: 'up' | 'down' | 'stable';
      change: number;
    }>;
    byAgent: Array<{
      agentId: mongoose.Types.ObjectId;
      agentName: string;
      value: number;
      trend: 'up' | 'down' | 'stable';
      change: number;
    }>;
    byTime: Array<{
      hour: number;
      value: number;
      trend: 'up' | 'down' | 'stable';
    }>;
  };
  quality: {
    scores: Array<{
      category: string;
      score: number;
      maxScore: number;
      trend: 'up' | 'down' | 'stable';
      change: number;
    }>;
    issues: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      count: number;
      trend: 'up' | 'down' | 'stable';
    }>;
    improvements: Array<{
      area: string;
      potential: number;
      priority: 'low' | 'medium' | 'high';
      timeline: string;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const analysesDataSchema = new Schema<IAnalysesData>({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  refreshDate: {
    type: Date,
    required: true
  },
  period: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly'],
    required: true
  },
  analysisType: {
    type: String,
    enum: ['performance', 'trends', 'quality', 'efficiency', 'customer_experience'],
    required: true
  },
  metrics: {
    overall: {
      score: {
        type: Number,
        required: true
      },
      trend: {
        type: String,
        enum: ['up', 'down', 'stable'],
        required: true
      },
      change: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    },
    detailed: [{
      name: {
        type: String,
        required: true
      },
      value: {
        type: Number,
        required: true
      },
      target: {
        type: Number
      },
      unit: {
        type: String,
        required: true
      },
      trend: {
        type: String,
        enum: ['up', 'down', 'stable'],
        required: true
      },
      change: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }]
  },
  comparisons: {
    previousPeriod: {
      value: {
        type: Number,
        required: true
      },
      change: {
        type: Number,
        required: true
      },
      changePercent: {
        type: Number,
        required: true
      }
    },
    target: {
      value: {
        type: Number,
        required: true
      },
      achieved: {
        type: Boolean,
        required: true
      },
      variance: {
        type: Number,
        required: true
      }
    },
    industry: {
      value: {
        type: Number,
        required: true
      },
      benchmark: {
        type: String,
        required: true
      },
      position: {
        type: String,
        enum: ['above', 'below', 'at'],
        required: true
      }
    }
  },
  insights: {
    strengths: [{
      type: String,
      trim: true
    }],
    weaknesses: [{
      type: String,
      trim: true
    }],
    opportunities: [{
      type: String,
      trim: true
    }],
    threats: [{
      type: String,
      trim: true
    }],
    recommendations: [{
      type: String,
      trim: true
    }]
  },
  trends: {
    labels: [{
      type: String,
      required: true
    }],
    data: [{
      type: Number,
      required: true
    }],
    comparisons: {
      previousPeriod: [{
        type: Number
      }],
      targets: [{
        type: Number
      }]
    }
  },
  breakdowns: {
    byQueue: [{
      queueId: {
        type: Schema.Types.ObjectId,
        required: true
      },
      queueName: {
        type: String,
        required: true
      },
      value: {
        type: Number,
        required: true
      },
      trend: {
        type: String,
        enum: ['up', 'down', 'stable'],
        required: true
      },
      change: {
        type: Number,
        required: true
      }
    }],
    byAgent: [{
      agentId: {
        type: Schema.Types.ObjectId,
        required: true
      },
      agentName: {
        type: String,
        required: true
      },
      value: {
        type: Number,
        required: true
      },
      trend: {
        type: String,
        enum: ['up', 'down', 'stable'],
        required: true
      },
      change: {
        type: Number,
        required: true
      }
    }],
    byTime: [{
      hour: {
        type: Number,
        required: true
      },
      value: {
        type: Number,
        required: true
      },
      trend: {
        type: String,
        enum: ['up', 'down', 'stable'],
        required: true
      }
    }]
  },
  quality: {
    scores: [{
      category: {
        type: String,
        required: true
      },
      score: {
        type: Number,
        required: true
      },
      maxScore: {
        type: Number,
        required: true
      },
      trend: {
        type: String,
        enum: ['up', 'down', 'stable'],
        required: true
      },
      change: {
        type: Number,
        required: true
      }
    }],
    issues: [{
      type: {
        type: String,
        required: true
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
      },
      count: {
        type: Number,
        required: true
      },
      trend: {
        type: String,
        enum: ['up', 'down', 'stable'],
        required: true
      }
    }],
    improvements: [{
      area: {
        type: String,
        required: true
      },
      potential: {
        type: Number,
        required: true
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
      },
      timeline: {
        type: String,
        required: true
      }
    }]
  }
}, { 
  timestamps: true,
  collection: 'analysesdatas' // Explicit collection name
});

// Index for faster queries
analysesDataSchema.index({ companyId: 1, refreshDate: -1 });
analysesDataSchema.index({ companyId: 1, period: 1 });
analysesDataSchema.index({ companyId: 1, analysisType: 1 });
analysesDataSchema.index({ refreshDate: 1, period: 1 });

// Compound index for date range and type queries
analysesDataSchema.index({ companyId: 1, refreshDate: 1, period: 1, analysisType: 1 });

// Export only the schema and interface, not the model
export { analysesDataSchema, IAnalysesData };