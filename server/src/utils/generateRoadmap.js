import Groq from "groq-sdk";

const groq=new Groq({

apiKey:process.env.GROQ_API_KEY

});

export const generateRoadmap=async(profile)=>{

const prompt=`

Create a personalized roadmap.

Target Role:
${profile.targetRole}

Skill Level:
${profile.currentSkillLevel}

Hours Per Day:
${profile.dailyAvailableHours}

Timeline:
${profile.goalTimeline}

Interests:
${profile.interests}

Return ONLY JSON:

{
"title":"",
"progress":0,
"phases":[
{
"phase":1,
"title":"",
"tasks":[
{
"task":"",
"completed":false
}
]
}
]
}

`;

const completion=

await groq.chat.completions.create({

messages:[

{

role:"user",
content:prompt

}

],

model:"llama-3.3-70b-versatile"

});

return JSON.parse(

completion.choices[0]
.message.content

);

};