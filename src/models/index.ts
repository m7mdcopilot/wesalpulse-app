import mongoose from 'mongoose';
import { connectDB } from '@/lib/database';

// Import schemas and interfaces
import { companySchema, ICompany } from './Company';
import { userSchema, IUser } from './User';
import { queueSchema, IQueue } from './Queue';
import { callDataSchema, ICallData } from './CallData';
import { analyticsSchema, IAnalytics } from './Analytics';
import { dashboardSchema, IDashboard } from './Dashboard';
import { dashboardsDataSchema, IDashboardsData } from './DashboardsData';
import { analysesDataSchema, IAnalysesData } from './AnalysesData';
import { dataviewDataSchema, IDataviewData } from './DataviewData';

// Create and export models (only once) - check if model already exists
export const Company = mongoose.models.Company ? mongoose.models.Company as mongoose.Model<ICompany> : mongoose.model<ICompany>('Company', companySchema);
export const User = mongoose.models.User ? mongoose.models.User as mongoose.Model<IUser> : mongoose.model<IUser>('User', userSchema);
export const Queue = mongoose.models.Queue ? mongoose.models.Queue as mongoose.Model<IQueue> : mongoose.model<IQueue>('Queue', queueSchema);
export const CallData = mongoose.models.CallData ? mongoose.models.CallData as mongoose.Model<ICallData> : mongoose.model<ICallData>('CallData', callDataSchema);
export const Analytics = mongoose.models.Analytics ? mongoose.models.Analytics as mongoose.Model<IAnalytics> : mongoose.model<IAnalytics>('Analytics', analyticsSchema);
export const Dashboard = mongoose.models.Dashboard ? mongoose.models.Dashboard as mongoose.Model<IDashboard> : mongoose.model<IDashboard>('Dashboard', dashboardSchema);
export const DashboardsData = mongoose.models.DashboardsData ? mongoose.models.DashboardsData as mongoose.Model<IDashboardsData> : mongoose.model<IDashboardsData>('DashboardsData', dashboardsDataSchema);
export const AnalysesData = mongoose.models.AnalysesData ? mongoose.models.AnalysesData as mongoose.Model<IAnalysesData> : mongoose.model<IAnalysesData>('AnalysesData', analysesDataSchema);
export const DataviewData = mongoose.models.DataviewData ? mongoose.models.DataviewData as mongoose.Model<IDataviewData> : mongoose.model<IDataviewData>('DataviewData', dataviewDataSchema);

// Re-export connectDB for backward compatibility
export { connectDB };