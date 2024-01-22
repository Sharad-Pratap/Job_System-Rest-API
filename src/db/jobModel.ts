// models/Job.js
import mongoose, {Document} from "mongoose";

interface IApplication {
  userId: string;
  coverLetter : string;
  // Additional fields for the application
  // For example: coverLetter, applicationDate, etc.
}

export interface IJob extends Document {
  title: string;
  description: string;
  categories: string[];
  applications: IApplication[];
  creator:string;
}

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: String,
      ref: "Category",
    },
  ],
  applications: [
    {
      userId: {
        type: String,
        ref: "User",
      },
      coverLetter:{
        type : String,

      }
    },
    
  ],
  creator: {
    type: String,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model<IJob>("Job", jobSchema);
