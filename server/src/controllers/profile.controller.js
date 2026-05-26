import Profile from "../models/profile.model.js";
import Roadmap from "../models/roadmap.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// CREATE PROFILE


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


    const existingProfile =

      await Profile.findOne({
        userId
      });


    if (existingProfile) {

      return res.status(400).json({

        message: "User already exists"

      });

    }


    const newProfile =

      await Profile.create({

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

      message:
      "Profile created successfully",

      profile:newProfile,

    });

  }

  catch(error){

    return res.status(500).json({

      message:
      "Something went wrong while creating profile"

    });

  }

};


// GET PROFILE


export const getProfile = async(req,res)=>{

try{

const userId=req.user.userId;

const profile=

await Profile.findOne({

userId

});

if(!profile){

return res.status(404).json({

message:"Profile not found"

});

}

return res.status(200).json({

profile

});

}
catch(error){

return res.status(500).json({

message:
"Something went wrong while fetching profile"

});

}

};


// UPDATE PROFILE


export const updateProfile=async(req,res)=>{

try{

const userId=req.user.userId;

const profile=

await Profile.findOne({

userId

});

if(!profile){

return res.status(404).json({

message:"Profile not found"

});

}



// ROADMAP LOCK LOGIC


const roadmap=

await Roadmap.findOne({

userId

});


if(roadmap){

const diffDays=

Math.floor(

(new Date()

-

roadmap.generatedAt)

/

(1000*60*60*24)

);


if(diffDays<14){

const restrictedFields=[

"targetRole",

"currentSkillLevel",

"dailyAvailableHours",

"interests",

"goalTimeline"

];


const attemptedChange=

restrictedFields.some(

(field)=>

req.body[field]!==undefined

);


if(attemptedChange){

return res.status(400).json({

message:
`Roadmap settings can be changed after ${14-diffDays} days`

});

}

}

}


// UPDATE PROFILE
const updatedProfile=

await Profile.findOneAndUpdate(

{userId},

req.body,

{

new:true

}

);


return res.status(200).json({

message:
"Profile Updated Successfully",

profile:updatedProfile

});

}
catch(error){

return res.status(500).json({

message:
"Something went wrong while updating profile"

});

}

};

// DELETE ACCOUNT


export const deleteProfile = async(req,res)=>{

try{

const userId=req.user.userId;

const {password}=req.body;


const user=

await User.findById(

userId

);


if(!user){

return res.status(404).json({

message:"User not found"

});

}


const isMatch=

await bcrypt.compare(

password,

user.password

);


if(!isMatch){

return res.status(400).json({

message:
"Incorrect password"

});

}


// Delete all related data

await Profile.findOneAndDelete({

userId

});

await Roadmap.findOneAndDelete({

userId

});

await User.findByIdAndDelete(

userId

);


return res.status(200).json({

message:
"Account deleted successfully"

});

}
catch(error){

return res.status(500).json({

message:
"Something went wrong while deleting account"

});

}

};