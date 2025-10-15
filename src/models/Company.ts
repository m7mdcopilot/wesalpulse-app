import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  domain: string;
  settings: {
    general: {
      timezone: string;
      businessHours: {
        start: string;
        end: string;
        days: number[];
      };
      language: string;
      currency: string;
    };
    users: {
      maxUsers: number;
      defaultRole: string;
      requireTwoFactor: boolean;
    };
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      webhook: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  domain: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  settings: {
    general: {
      timezone: {
        type: String,
        default: 'UTC'
      },
      businessHours: {
        start: {
          type: String,
          default: '09:00'
        },
        end: {
          type: String,
          default: '17:00'
        },
        days: {
          type: [Number],
          default: [1, 2, 3, 4, 5] // Monday to Friday
        }
      },
      language: {
        type: String,
        default: 'en'
      },
      currency: {
        type: String,
        default: 'USD'
      }
    },
    users: {
      maxUsers: {
        type: Number,
        default: 10
      },
      defaultRole: {
        type: String,
        default: 'agent'
      },
      requireTwoFactor: {
        type: Boolean,
        default: false
      }
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      webhook: {
        type: String,
        default: ''
      }
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
companySchema.index({ 'settings.general.timezone': 1 });

// Export only the schema and interface, not the model
export { companySchema, ICompany };