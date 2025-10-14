import mongoose, { Schema, Document } from 'mongoose';

export interface IDataviewData extends Document {
  companyId: mongoose.Types.ObjectId;
  refreshDate: Date;
  viewName: string;
  viewType: 'table' | 'chart' | 'metric' | 'timeline' | 'comparison';
  filters: {
    dateRange: {
      start: Date;
      end: Date;
      preset?: string;
    };
    queues: mongoose.Types.ObjectId[];
    agents: mongoose.Types.ObjectId[];
    callTypes: string[];
    statuses: string[];
    customFilters: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  data: {
    headers: string[];
    rows: Array<{
      [key: string]: any;
    }>;
    summary: {
      totalRecords: number;
      totalPages?: number;
      currentPage?: number;
      aggregations?: {
        [key: string]: {
          sum?: number;
          avg?: number;
          min?: number;
          max?: number;
          count?: number;
        };
      };
    };
  };
  visualization: {
    type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'heatmap' | 'table' | 'metric';
    config: {
      xAxis?: string;
      yAxis?: string | string[];
      groupBy?: string;
      aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
      colors?: string[];
      showLegend?: boolean;
      showGrid?: boolean;
      stacked?: boolean;
      percentage?: boolean;
    };
    options: {
      title?: string;
      subtitle?: string;
      height?: number;
      width?: number;
      responsive?: boolean;
      animations?: boolean;
    };
  };
  metadata: {
    dataSource: string;
    lastUpdated: Date;
    updateFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    dataQuality: {
      completeness: number;
      accuracy: number;
      consistency: number;
      timeliness: number;
      overall: number;
    };
    accessLevel: 'public' | 'restricted' | 'confidential';
    tags: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const dataviewDataSchema = new Schema<IDataviewData>({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  refreshDate: {
    type: Date,
    required: true
  },
  viewName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  viewType: {
    type: String,
    enum: ['table', 'chart', 'metric', 'timeline', 'comparison'],
    required: true
  },
  filters: {
    dateRange: {
      start: {
        type: Date,
        required: true
      },
      end: {
        type: Date,
        required: true
      },
      preset: {
        type: String
      }
    },
    queues: [{
      type: Schema.Types.ObjectId
    }],
    agents: [{
      type: Schema.Types.ObjectId
    }],
    callTypes: [{
      type: String
    }],
    statuses: [{
      type: String
    }],
    customFilters: [{
      field: {
        type: String,
        required: true
      },
      operator: {
        type: String,
        required: true
      },
      value: {
        type: Schema.Types.Mixed,
        required: true
      }
    }]
  },
  data: {
    headers: [{
      type: String,
      required: true
    }],
    rows: [{
      type: Schema.Types.Mixed,
      required: true
    }],
    summary: {
      totalRecords: {
        type: Number,
        required: true
      },
      totalPages: {
        type: Number
      },
      currentPage: {
        type: Number
      },
      aggregations: {
        type: Schema.Types.Mixed,
        default: {}
      }
    }
  },
  visualization: {
    type: {
      type: String,
      enum: ['bar', 'line', 'pie', 'area', 'scatter', 'heatmap', 'table', 'metric'],
      required: true
    },
    config: {
      xAxis: {
        type: String
      },
      yAxis: {
        type: Schema.Types.Mixed
      },
      groupBy: {
        type: String
      },
      aggregation: {
        type: String,
        enum: ['sum', 'avg', 'count', 'min', 'max']
      },
      colors: [{
        type: String
      }],
      showLegend: {
        type: Boolean,
        default: true
      },
      showGrid: {
        type: Boolean,
        default: true
      },
      stacked: {
        type: Boolean,
        default: false
      },
      percentage: {
        type: Boolean,
        default: false
      }
    },
    options: {
      title: {
        type: String
      },
      subtitle: {
        type: String
      },
      height: {
        type: Number
      },
      width: {
        type: Number
      },
      responsive: {
        type: Boolean,
        default: true
      },
      animations: {
        type: Boolean,
        default: true
      }
    }
  },
  metadata: {
    dataSource: {
      type: String,
      required: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    updateFrequency: {
      type: String,
      enum: ['realtime', 'hourly', 'daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    dataQuality: {
      completeness: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
      },
      accuracy: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
      },
      consistency: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
      },
      timeliness: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
      },
      overall: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
      }
    },
    accessLevel: {
      type: String,
      enum: ['public', 'restricted', 'confidential'],
      default: 'public'
    },
    tags: [{
      type: String,
      trim: true
    }]
  }
}, { 
  timestamps: true,
  collection: 'dataviewdatas' // Explicit collection name
});

// Index for faster queries
dataviewDataSchema.index({ companyId: 1, refreshDate: -1 });
dataviewDataSchema.index({ companyId: 1, viewType: 1 });
dataviewDataSchema.index({ companyId: 1, viewName: 1 });
dataviewDataSchema.index({ refreshDate: 1 });

// Compound index for company and view type queries
dataviewDataSchema.index({ companyId: 1, viewType: 1, refreshDate: -1 });

// Text index for search functionality
dataviewDataSchema.index({ viewName: 'text', 'metadata.tags': 'text' });

// Export only the schema and interface, not the model
export { dataviewDataSchema, IDataviewData };