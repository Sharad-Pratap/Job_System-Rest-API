// models/Interest.js
import mongoose from "mongoose";

export interface IInterest extends Document{
    email: string;
    userId : string;
    categories :string;
}

const interestSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  categories: [
    {
      type: String,
      ref: 'Category',
    },
  ],
  email:{
    type: String,
    required :true
  },
});

export default mongoose.model<IInterest>('Interest', interestSchema);


