import Profile from '../models/profile.model.js';
import Roadmap from '../models/roadmap.model.js';

export const generateRoadmap = async (req, res) => {
  try {
    const userId = req.user.userId;

    const existingRoadmap = await Roadmap.findOne({ userId });

    if (existingRoadmap) {
      return res.status(400).json({
        message: 'Roadmap already exists',
      });
    }

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        message: 'Please create profile first',
      });
    }

    let roadmapData;

    if (profile.targetRole === 'Full Stack Developer') {
      roadmapData = {
        userId,
        title: 'Full Stack Developer Roadmap',
        duration: profile.goalTimeline,
        progress: 0,
        status: 'Not Started',
        phases: [
          {
            phase: 1,
            title: 'Frontend Basics',
            tasks: [
              {
                task: 'Learn HTML',
                resources: ['MDN HTML Docs'],
              },
              {
                task: 'Learn CSS',
                resources: ['MDN CSS Docs'],
              },
              {
                task: 'Learn JavaScript',
                resources: ['JavaScript.info'],
              },
            ],
          },
          {
            phase: 2,
            title: 'React',
            tasks: [
              {
                task: 'Components & Props',
                resources: ['React Docs'],
              },
              {
                task: 'Hooks',
                resources: ['React Hooks Guide'],
              },
            ],
          },
          {
            phase: 3,
            title: 'Backend',
            tasks: [
              {
                task: 'Node.js',
                resources: ['Node Docs'],
              },
              {
                task: 'Express.js',
                resources: ['Express Docs'],
              },
              {
                task: 'MongoDB',
                resources: ['MongoDB University'],
              },
            ],
          },
        ],
      };
    } else {
      return res.status(400).json({
        message: 'Target role roadmap not available yet',
      });
    }

    const roadmap = await Roadmap.create(roadmapData);

    return res.status(201).json({
      message: 'Roadmap generated successfully',
      roadmap,
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong while generating roadmap',
    });
  }
};


export const getRoadmap = async (req, res) => {
  try {
    const userId = req.user.userId;
    const roadmap = await Roadmap.findOne({ userId });
    if (!roadmap) {
      return res.status(404).json({
        message: 'Roadmap Not found',
      });
    }
    return res.status(200).json({
      roadmap,
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong while fetching roadmap',
    });
  }

};


export const markTaskComplete = async (req, res) => {

  try {
    const userId = req.user.userId;
    const { phase, task } = req.body;

    const roadmap = await Roadmap.findOne({ userId });

    if (!roadmap) {
      return res.status(404).json({
        message: 'Roadmap not found',
      });
    }

    const selectedPhase = roadmap.phases.find(
      (p) => p.phase === phase
    );

    if (!selectedPhase) {
      return res.status(404).json({
        message: 'Phase not found',
      });
    }

    const selectedTask = selectedPhase.tasks.find(
      (t) => t.task === task
    );

    if (!selectedTask) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }


    if (selectedTask.completed) {
      return res.status(400).json({
        message: 'Task already completed',
      });
    }


    selectedTask.completed = true;


    const profile = await Profile.findOne({ userId });

    const today = new Date();

    const lastDate = profile.lastCompletedDate
      ? new Date(profile.lastCompletedDate)
      : null;

    if (!lastDate) {
      profile.streak = 1;
    } else {
      const todayDateOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const lastDateOnly = new Date(
        lastDate.getFullYear(),
        lastDate.getMonth(),
        lastDate.getDate()
      );

      const diffTime = todayDateOnly - lastDateOnly;

      const diffDays = Math.floor(
        diffTime / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        profile.streak += 1;
      } else if (diffDays > 1) {
        profile.streak = 1;
      }
    }

    profile.lastCompletedDate = today;

    await profile.save();

    let totalTasks = 0;
    let completedTasks = 0;

    roadmap.phases.forEach((phase) => {
      phase.tasks.forEach((task) => {
        totalTasks++;

        if (task.completed) {
          completedTasks++;
        }
      });
    });

    roadmap.progress = Math.round(
      (completedTasks / totalTasks) * 100
    );

    if (roadmap.progress === 100) {
      roadmap.status = 'Completed';
    } else if (roadmap.progress > 0) {
      roadmap.status = 'In Progress';
    }

    await roadmap.save();

    return res.status(200).json({
      message: 'Task marked as completed',
      progress: roadmap.progress,
      roadmap,
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong while updating task',
    });
  }

};
