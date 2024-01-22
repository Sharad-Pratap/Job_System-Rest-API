// models/Category.js
import mongoose, {Document} from "mongoose";

export interface ICategory extends Document{
    name : string;

}
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  
  // Additional fields for category details
  // For example: description, color, icon, etc.
});

export default mongoose.model<ICategory>('Category', categorySchema);


