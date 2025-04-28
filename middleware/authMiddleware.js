import jwt from 'jsonwebtoken';
import UserModel from '../model/userSchemaModel.js';
const userAuthMiddleware = async (req, res, next) => {
    let userToken;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            userToken = authorization.split(' ')[1];
            // get userId from jwt token 
                const userID = verifyUserJWTToken(userToken, process.env.JWT_SECRET_KEY);
            // get the userid from token and set that userId into the req object                     
                const currentUser =  await UserModel.findOne({_id:userID},{password:0});
                 // check if user still exists 
                if (!currentUser) {
                // generate the error message from ErrorManagement class              
                    const err = new ErrorManagement('the token is no longer exist!', 401);            
                // return error
                    return next(err);
                }
                
                // set the user in req
                req.user = currentUser;
             
                next();
        } catch (error) {
            // console.log(error)
            res.status(401).send({status:"faild", msg: "unauthorized user."})
        }
    }
    if (!userToken) {
        res.status(401).send({status:"faild", msg: "unauthorized user. no token"});            
    }
}

const verifyUserJWTToken = (userToken, secreteKey) => {
    // verify the token and get usetId from token which we have set at the time of login 
        // get the userId from token (using destructuring)   
        const { userID } = jwt.verify(userToken, secreteKey);
        return userID;
}

// export section
    export default userAuthMiddleware;
