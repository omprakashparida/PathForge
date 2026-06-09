import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Roadmap from "../models/roadmap.model.js";

export const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        const profile = await Profile.findOne({ userId });
        const roadmap = await Roadmap.findOne({ userId });

        // If the core user account doesn't exist, exit early
        if (!user) {
            return res.status(404).json({
                message: 'User account not found',
            });
        }

        // Initialize our default layout metrics
        let totalTasks = 0;
        let completedTasks = 0;
        let currentPhase = null;
        let nextTask = null;

        // SAFE GUARD: Only iterate if roadmap is NOT null/undefined
        if (roadmap && roadmap.phases) {
            for (const phase of roadmap.phases) {
                if (phase.tasks) {
                    for (const task of phase.tasks) {
                        totalTasks++;

                        if (task.completed) {
                            completedTasks++;
                        } else {
                            if (!currentPhase) {
                                currentPhase = phase.phase;
                            }
                            if (!nextTask) {
                                nextTask = task.task;
                            }
                        }
                    }
                }
            }
        }

        // Return a beautifully safe JSON payload back to React
        return res.status(200).json({
            name: user.name,
            targetRole: profile ? profile.targetRole : "Set your target role!",
            progress: roadmap ? roadmap.progress : 0,
            status: roadmap ? roadmap.status : "Not Started",
            completedTasks: totalTasks > 0 ? completedTasks : 0,
            totalTasks: totalTasks > 0 ? totalTasks : 0,
            currentPhase: currentPhase || "Onboarding",
            nextTask: nextTask || "Create a roadmap to begin",
            streak: profile ? profile.streak : 0,

        });

    } catch (error) {
        
        console.error("Dashboard Controller Error:", error);
        
        return res.status(500).json({
            message: 'Something went wrong while getting dashboard',
            error: error.message 
        });
    }
}

