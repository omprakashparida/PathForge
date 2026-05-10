import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
export const createProfile = async (req, res) => {

    try {
        const userId = req.user.userId;
        const {
            college,
            branch,
            year,
            targetRole,
            currentSkillLevel,
            dailyAvailableHours,
            interests,
            goalTimeline,
        } = req.body;
        const existingProfile = await Profile.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({
                message: 'User already exist',
            });
        }
        const newProfile = await Profile.create({
            userId,
            college,
            branch,
            year,
            targetRole,
            currentSkillLevel,
            dailyAvailableHours,
            interests,
            goalTimeline,
        });

        return res.status(201).json({
            message: 'Profile created successfully',
            Profile: newProfile,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while create profile',
        });
    }

};


export const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const profile = await Profile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: 'Profile not found',
            });
        }
        return res.status(200).json({
            profile,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while fetching profile',
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const profile = await Profile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({
                message: 'Profile not found',
            });
        }
        const updatedProfile = await Profile.findOneAndUpdate(
            { userId },
            req.body,
            { new: true }
        );
        return res.status(200).json({
            message:'Profile Updated Successfully',
            profile:updateProfile,
        });
    }catch(error){
        return res.status(500)({
            message:'Something went wrong while updating profile',
        });
    }
};