import mongoose, { Schema, Document } from 'mongoose';

export interface IDashboard extends Document {
  name: string;
  description: string;
  type: 'main' | 'call-center' | 'queue-performance' | 'agent-performance' | 'custom';
  isDefault: boolean;
  isPublic: boolean;
  company: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  layout: {
    version: string;
    widgets: Array<{
      id: string;
      type: string;
      title: string;
      position: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      config: {
        dataSource: string;
        filters: Record<string, any>;
        refreshInterval: number;
        chartType?: string;
        showLegend?: boolean;
        showGrid?: boolean;
        colorScheme?: string;
      };
      isVisible: boolean;
      isMinimized: boolean;
    }>;
  };
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
  settings: {
    refreshInterval: number;
    autoRefresh: boolean;
    theme: 'light' | 'dark' | 'auto';
    density: 'compact' | 'normal' | 'comfortable';
    showTooltips: boolean;
    enableAnimations: boolean;
  };
  permissions: {
    viewers: mongoose.Types.ObjectId[];
    editors: mongoose.Types.ObjectId[];
    admins: mongoose.Types.ObjectId[];
  };
  lastAccessed: Date;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const dashboardSchema = new Schema<IDashboard>({
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
    enum: ['main', 'call-center', 'queue-performance', 'agent-performance', 'custom'],
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  layout: {
    version: {
      type: String,
      default: '1.0'
    },
    widgets: [{
      id: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      position: {
        x: {
          type: Number,
          required: true
        },
        y: {
          type: Number,
          required: true
        },
        width: {
          type: Number,
          required: true
        },
        height: {
          type: Number,
          required: true
        }
      },
      config: {
        dataSource: {
          type: String,
          required: true
        },
        filters: {
          type: Schema.Types.Mixed,
          default: {}
        },
        refreshInterval: {
          type: Number,
          default: 30
        },
        chartType: {
          type: String
        },
        showLegend: {
          type: Boolean,
          default: true
        },
        showGrid: {
          type: Boolean,
          default: true
        },
        colorScheme: {
          type: String,
          default: 'default'
        }
      },
      isVisible: {
        type: Boolean,
        default: true
      },
      isMinimized: {
        type: Boolean,
        default: false
      }
    }]
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
      type: Schema.Types.ObjectId,
      ref: 'Queue'
    }],
    agents: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
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
  settings: {
    refreshInterval: {
      type: Number,
      default: 30,
      min: 5,
      max: 300
    },
    autoRefresh: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    density: {
      type: String,
      enum: ['compact', 'normal', 'comfortable'],
      default: 'normal'
    },
    showTooltips: {
      type: Boolean,
      default: true
    },
    enableAnimations: {
      type: Boolean,
      default: true
    }
  },
  permissions: {
    viewers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    editors: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    admins: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  accessCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
dashboardSchema.index({ company: 1, type: 1 });
dashboardSchema.index({ createdBy: 1 });
dashboardSchema.index({ isDefault: 1 });
dashboardSchema.index({ lastAccessed: -1 });

// Method to update access statistics
dashboardSchema.methods.updateAccess = async function() {
  this.lastAccessed = new Date();
  this.accessCount += 1;
  await this.save();
};

// Method to add widget
dashboardSchema.methods.addWidget = function(widget: any) {
  this.layout.widgets.push(widget);
  return this.save();
};

// Method to remove widget
dashboardSchema.methods.removeWidget = function(widgetId: string) {
  this.layout.widgets = this.layout.widgets.filter((w: any) => w.id !== widgetId);
  return this.save();
};

// Method to update widget position
dashboardSchema.methods.updateWidgetPosition = function(widgetId: string, position: any) {
  const widget = this.layout.widgets.find((w: any) => w.id === widgetId);
  if (widget) {
    widget.position = position;
    return this.save();
  }
  throw new Error('Widget not found');
};

// Export only the schema and interface, not the model
export { dashboardSchema, IDashboard };