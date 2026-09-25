import Profile from '../models/profile.model.js';
import Roadmap from '../models/roadmap.model.js';
import User from '../models/user.model.js';
import groq from '../utils/groq.js';
import { roadmapLockRemaining } from '../utils/roadmapLock.js';


// GENERATE AI ROADMAP


export const generateRoadmap = async (req, res) => {

  try {

    const userId = req.user.userId;

    // Check existing roadmap
    const existingRoadmap =
      await Roadmap.findOne({ userId });

    // Prevent abuse (14-day lock)
    if (existingRoadmap) {
      const remaining = roadmapLockRemaining(existingRoadmap);
      if (remaining > 0) {
        return res.status(400).json({
          message: `You can generate a new roadmap after ${remaining} days`,
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


    // Sanitize profile input before embedding it in the prompt, so crafted
    // field values can't break out of the instructions (prompt injection),
    // and overlong values can't blow up the token budget.
    const sanitize = (v, max = 200) =>
      String(v ?? '')
        .replace(/```/g, '')
        .replace(/[\x00-\x1F\x7F]/g, ' ')
        .trim()
        .slice(0, max);
    const interestsText = Array.isArray(profile.interests)
      ? profile.interests.map((i) => sanitize(i, 60)).join(', ')
      : sanitize(profile.interests, 200);

    // AI Prompt

    const prompt = `

Create a personalized learning roadmap.

Target Role:
${sanitize(profile.targetRole)}

Current Skill Level:
${sanitize(profile.currentSkillLevel)}

Daily Hours:
${sanitize(profile.dailyAvailableHours, 20)}

Goal Timeline:
${sanitize(profile.goalTimeline)}

Interests:
${interestsText}

Return ONLY VALID JSON.

Do NOT return markdown.

Keep the roadmap compact: at most 4 phases, at most 3 tasks per phase,
each task a single short sentence, at most 1 resource per task.
Each resource MUST be one complete working https:// URL (never a title,
never markdown, never a bare domain).

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
"https://full-working-url-here"
]

}

]

}

]

}

`;



    // AI Call

    // Groq's free on_demand tier caps output at ~1000 tokens/min (OTPM). A
    // full roadmap wants ~1700 output tokens, so Groq rejects the request
    // with 429 before generating anything. max_completion_tokens keeps the
    // request under the cap, and the prompt above constrains the roadmap
    // size so the JSON still completes instead of truncating mid-object.
    // If Groq retires the model, override it with GROQ_ROADMAP_MODEL.
    const completion =
      await groq.chat.completions.create({

        messages: [

          {
            role: "user",
            content: prompt
          }

        ],

        model: process.env.GROQ_ROADMAP_MODEL || "qwen/qwen3.8-27b",

        temperature: 0.7,

        max_completion_tokens: 900

      });



    // Parse AI response. The model sometimes wraps JSON in markdown fences,
    // so strip those first; reasoning models may also wrap their thinking in
    // <think> tags — strip those too. A malformed response becomes a clean
    // 500 instead of an unhandled crash.
    const aiResponse = completion.choices[0].message.content;

    let roadmapData;
    try {
      const withoutThinking = aiResponse.replace(/<think>[\s\S]*?<\/think>/gi, '');
      const fence = withoutThinking.match(/```(?:json)?\s*([\s\S]*?)```/i);
      roadmapData = JSON.parse((fence ? fence[1] : withoutThinking).trim());
    } catch {
      return res.status(500).json({
        message: 'AI returned an invalid roadmap. Please try again.',
      });
    }
    if (!roadmapData || !Array.isArray(roadmapData.phases)) {
      return res.status(500).json({
        message: 'AI returned an invalid roadmap. Please try again.',
      });
    }



    // Replace the user's roadmap instead of stacking a new document.
    // The old code called Roadmap.create() on every generation, so a user
    // accumulated several roadmap documents; every reader uses
    // findOne({ userId }) with no sort, which returns the OLDEST one —
    // regenerations were saved but never displayed.
    const roadmap = await Roadmap.findOneAndReplace(
      { userId },
      {
        userId,
        ...roadmapData,
        generatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Clean up duplicates left behind by the old stacking behavior.
    await Roadmap.deleteMany({ userId, _id: { $ne: roadmap._id } });



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

    // Groq 429s are quota/tier rejections, not transient failures — surface
    // that clearly so the user knows it's the AI plan, not the app.
    if (error?.status === 429) {

      return res.status(429).json({

        message:
          "AI rate limit reached. Your Groq plan caps roadmap output — try again in a minute, or upgrade your Groq tier for larger roadmaps.",

        detail:
          error?.message || "Rate limited by Groq"

      });

    }

    // Include the underlying reason (e.g. bad API key) so a failure is
    // diagnosable from the client instead of a dead "something went wrong".
    // The stack trace stays server-side.
    return res.status(500).json({

      message:
        "Something went wrong while generating roadmap",

      detail:
        error?.message || "Unknown error"

    });

  }

};



// GET ROADMAP


export const getRoadmap = async (req, res) => {

  try {

    const userId = req.user.userId;

    const user =
      await User.findById(userId);

    // Self-healing: generations made before the replace-fix could leave
    // several roadmap documents per user (and those users may still be
    // inside the 14-day lock, unable to regenerate). Keep the newest,
    // drop the rest, so every reader agrees on which roadmap is current.
    const roadmaps =
      await Roadmap.find({ userId }).sort({ generatedAt: -1 });

    if (roadmaps.length === 0) {

      return res.status(404).json({

        message:
          'Roadmap not found',

      });

    }

    const roadmap = roadmaps[0];

    if (roadmaps.length > 1) {
      await Roadmap.deleteMany({ userId, _id: { $ne: roadmap._id } });
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

    const { phase, task, taskId } = req.body;

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

    // Prefer stable subdocument IDs; fall back to text match for older clients.
    // (Text matching is fragile — duplicate task names would collide.)
    const selectedTask = taskId
      ? selectedPhase.tasks.id(taskId)
      : selectedPhase.tasks.find((t) => t.task === task);

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


    const profile = await Profile.findOne({ userId });

    // Streak tracking is best-effort: a roadmap implies a profile exists,
    // but the request must never crash if it doesn't.
    if (profile) {
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
    }


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


    // Guard against division by zero when a roadmap has no tasks
    roadmap.progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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