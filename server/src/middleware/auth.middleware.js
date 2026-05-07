import jwt from 'jsonwebtoken';

export const protect = (req,res,next)=>{
    const authheader = req.headers.authorization

    if(!authheader){
        return res.status(401).json({
            message :  'No Token Provided.'
        });
    }

    const token = authheader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json({
            message: 'Invalid Token',
        });
    }
    

};