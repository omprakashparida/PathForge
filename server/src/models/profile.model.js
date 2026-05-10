import mongoose from "mongoose";
import User from './user.model.js'; // Added the extensionimport User from "./user.model";

const profileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
          },
          college :{
            type : String,
            required:true,
          },
          branch:{
            type: String,
            required:true,
          },
          year: {
            type: String,
            required: true,
          },
      
          targetRole: {
            type: String,
            required: true,
          },
      
          currentSkillLevel: {
            type: String,
            required: true,
          },
      
          dailyAvailableHours: {
            type: Number,
            required: true,
          },
      
          interests: {
            type: [String],
            required: true,
          },
      
          goalTimeline: {
            type: String,
            required: true,
          },

    },
    {
        timestamps:true,
    }
);

const Profile = mongoose.model('Profile',profileSchema);
export default Profile;