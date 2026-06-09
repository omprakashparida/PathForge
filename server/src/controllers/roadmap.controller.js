import Profile from '../models/profile.model.js';
import Roadmap from '../models/roadmap.model.js';
import User from '../models/user.model.js';
import groq from '../utils/groq.js';


// GENERATE AI ROADMAP


export const generateRoadmap = async (req, res) => {

  try {

    const userId = req.user.userId;

    // Check existing roadmap
    const existingRoadmap =
      await Roadmap.findOne({ userId });

    // Prevent abuse (14-day lock)

    if (existingRoadmap) {

      const diffDays = Math.floor(

        (new Date() -

          existingRoadmap.generatedAt)

        /

        (1000 * 60 * 60 * 24)

      );

      if (diffDays < 14) {

        return res.status(400).json({

          message:
            `You can generate a new roadmap after ${14 - diffDays} days`

        });

      }

    }


    // Get profile

    const profile =
      await Profile.findOne({ userId });

    if (!profile) {

      return res.status(404).json({

        message:
          "Please create profile first"

      });

    }


    // AI Prompt

    const prompt = `

Create a personalized learning roadmap.

Target Role:
${profile.targetRole}

Current Skill Level:
${profile.currentSkillLevel}

Daily Hours:
${profile.dailyAvailableHours}

Goal Timeline:
${profile.goalTimeline}

Interests:
${profile.interests}

Return ONLY VALID JSON.

Do NOT return markdown.

Format:

{
"title":"",
"duration":"",
"progress":0,
"status":"Not Started",

"phases":[

{

"phase":1,

"title":"",

"tasks":[

{

"task":"",

"completed":false,

"resources":[
""
]

}

]

}

]

}

`;



    // AI Call

    const completion =
      await groq.chat.completions.create({

        messages: [

          {
            role: "user",
            content: prompt
          }

        ],

        model: "llama-3.3-70b-versatile",

        temperature: 0.7

      });



    // Parse AI response

    const aiResponse =

      completion.choices[0]
        .message.content;

    const roadmapData =
      JSON.parse(aiResponse);



    // Save roadmap

    const roadmap =
      await Roadmap.create({

        userId,

        ...roadmapData,

        generatedAt: new Date()

      });



    return res.status(201).json({

      message:
        "Roadmap generated successfully 🚀",

      roadmap

    });

  }

  catch (error) {

    console.log(
      "ROADMAP ERROR:",
      error
    );

    return res.status(500).json({

      message:
        "Something went wrong while generating roadmap"

    });

  }

};



// GET ROADMAP


export const getRoadmap = async (req, res) => {

  try {

    const userId = req.user.userId;

    const user =
      await User.findById(userId);

    const roadmap =
      await Roadmap.findOne({
        userId
      });

    if (!roadmap) {

      return res.status(404).json({

        message:
          'Roadmap not found',

      });

    }

    return res.status(200).json({

      roadmap,

      name: user.name,

    });

  }

  catch (error) {

    return res.status(500).json({

      message:
        'Something went wrong while fetching roadmap',

    });

  }

};



// MARK TASK COMPLETE


export const markTaskComplete = async (req, res) => {

  try {

    const userId = req.user.userId;

    const { phase, task } = req.body;

    const roadmap =
      await Roadmap.findOne({ userId });

    if (!roadmap) {

      return res.status(404).json({

        message: "Roadmap not found"

      });

    }

    const selectedPhase =
      roadmap.phases.find(

        (p) => p.phase === phase

      );

    if (!selectedPhase) {

      return res.status(404).json({

        message: "Phase not found"

      });

    }

    const selectedTask =
      selectedPhase.tasks.find(

        (t) => t.task === task

      );

    if (!selectedTask) {

      return res.status(404).json({

        message: "Task not found"

      });

    }

    if (selectedTask.completed) {

      return res.status(400).json({

        message: "Task already completed"

      });

    }


    selectedTask.completed = true;


    const profile =
      await Profile.findOne({ userId });

    const today = new Date();

    const lastDate =
      profile.lastCompletedDate
        ? new Date(profile.lastCompletedDate)
        : null;


    if (!lastDate) {

      profile.streak = 1;

    }
    else {

      const todayOnly =
        new Date(

          today.getFullYear(),

          today.getMonth(),

          today.getDate()

        );

      const lastOnly =
        new Date(

          lastDate.getFullYear(),

          lastDate.getMonth(),

          lastDate.getDate()

        );

      const diffDays =

        Math.floor(

          (todayOnly - lastOnly)

          /

          (1000 * 60 * 60 * 24)

        );

      if (diffDays === 1) {

        profile.streak += 1;

      }
      else if (diffDays > 1) {

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


    roadmap.progress =

      Math.round(

        (completedTasks / totalTasks) * 100

      );

    if (roadmap.progress === 100) {

      roadmap.status = 'Completed';

    }
    else if (roadmap.progress > 0) {

      roadmap.status = 'In Progress';

    }

    await roadmap.save();

    return res.status(200).json({

      message: "Task marked completed",

      progress: roadmap.progress,

      roadmap

    });

  }
  catch (error) {

    return res.status(500).json({

      message: "Something went wrong"

    });

  }

};