// src/models/User.ts
import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
//   role: 'student' | 'examiner'; //use if working on role based model
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email : {type: String, required : true},
//   role: { type: String, enum: ['student', 'examiner'], required: true },  //use if working on role based model
});

export default mongoose.model<IUser>('User', userSchema);