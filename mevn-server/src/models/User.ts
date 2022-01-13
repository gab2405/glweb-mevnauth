import { Schema, model } from 'mongoose';
import {IUser} from '../types/IUser';

const userSchema = new Schema<IUser>({
  name: String,
  method: {
    type: String,
    enum: ['local'],
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: String
  },
  emailConfirmed: {
    type: Boolean,
    default: false
  },
  resetPW: {
    token: String,
    date: Date
  },
  userGroup: {
    type: String,
    default: 'Member'
  },
  status: {
    type: String,
    default: "active"
  },
  dates: {
    registered: Date,
    lastEdited: Date,
    lastPasswordReset: Date,
    deletedOn: Date
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

// Create a model
const User = model<IUser>('user', userSchema);

// Export the model
module.exports = User;
