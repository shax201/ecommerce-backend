import { model, Schema, Document } from "mongoose";

export interface ICourierCredentials extends Document {
  courier: 'pathao' | 'steadfast';
  credentials: {
    // Pathao credentials
    client_id?: string;
    client_secret?: string;
    username?: string;
    password?: string;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    base_url?: string;
    
    // Steadfast credentials
    api_key?: string;
    secret_key?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courierCredentialsSchema = new Schema<ICourierCredentials>({
  courier: {
    type: String,
    required: true,
    enum: ['pathao', 'steadfast'],
    unique: true
  },
  credentials: {
    type: Schema.Types.Mixed,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better performance
courierCredentialsSchema.index({ courier: 1, isActive: 1 });

const CourierCredentialsModel = model<ICourierCredentials>('CourierCredentials', courierCredentialsSchema);
export default CourierCredentialsModel;
