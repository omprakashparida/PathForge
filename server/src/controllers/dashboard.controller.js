import User from "../models/user.model";
import Profile from "../models/profile.model";
import Roadmap from "../models/roadmap.model";

export const getDashboardSumaary = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        const profile = await Profile.findOne({ userId });
        const roadmap = await Roadmap.findOne({ userId });

        if (!user || !profile || !roadmap) {
            return res.status(404).json({
                message: 'Dashboard Data not found',
            });
        }
        let currentTask = 0;
        let completedTask = 0;
        let currentPhase = null;
        let nextTask = null;

        for (const phases of Roadmap.phases) {
            for (const task of phases.task) {
                totalTasks++;
                if (task.completed) {
                    completedTasks++;
                } else {
                    if (!currentPhase) {
                        currentPhase = phases.title;
                    }
                    if (!nextTask) {
                        nextTask = task.task;
                    }
                }
            }
        }

        return res.status(200).json({
            name: user.name,
            targetRole: profile.targetRole,
            progress: roadmap.progress,
            status: roadmap.status,
            completedTasks,
            totalTasks,
            currentPhase,
            nextTask,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while getting dashboard',
        });
    }


};