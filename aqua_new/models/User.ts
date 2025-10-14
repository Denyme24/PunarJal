import mongoose, { Model, Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  organizationName: string;
  organizationEmail: string;
  organizationType: string;
  location: string;
  role: 'Plant Operator' | 'Environmental Officer';
  password: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    organizationName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    organizationEmail: {
      type: String,
      required: [true, 'Organization email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    organizationType: {
      type: String,
      required: [true, 'Organization type is required'],
      enum: [
        'Hospital',
        'Hotel',
        'Restaurant',
        'Manufacturing Industry',
        'IT/Tech Company',
        'Educational Institution',
        'Shopping Mall',
        'Residential Complex',
        'Commercial Complex',
        'Food Processing Unit',
        'Pharmaceutical Company',
        'Textile Industry',
        'Other',
      ],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      enum: [
        'Whitefield',
        'Electronic City',
        'Koramangala',
        'Indiranagar',
        'JP Nagar',
        'Jayanagar',
        'BTM Layout',
        'HSR Layout',
        'Marathahalli',
        'Sarjapur Road',
        'Hebbal',
        'Yelahanka',
        'Banashankari',
        'Rajajinagar',
        'Malleshwaram',
        'Yeshwanthpur',
        'Peenya',
        'Bommanahalli',
        'Mahadevapura',
        'Dasarahalli',
        'RR Nagar',
        'Kengeri',
        'Hennur',
        'Bellandur',
        'MG Road',
      ],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: ['Plant Operator', 'Environmental Officer'],
      default: 'Plant Operator',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
