import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import ErrorManagement from "../assets/ErrorHandling/customeErrorManagementFunction.js";
import UserModel from "../model/userSchemaModel.js";


class UserController {
    static RegisterUser = async(req,res,next) =>{
        try {
            const {userName, password, role} = req.body;
            console.log(req.body)
            if (userName && password ) {
                const saltValueForHashPassword = await bcrypt.genSalt(12)
                const hashedPassword = await bcrypt.hash(password, saltValueForHashPassword);
                const newUser = new UserModel({
                    userName,
                    password: hashedPassword,
                    role
                })
            await newUser.save()
                
                return res.status(201).json({
                    status: 'success',
                    message: 'User created successfully.'
                });

            }else{
                const err = new ErrorManagement(`All Feilds are required`, 400);
                return next(err); 
            }
        } catch (error) {
            console.log(error)
        }
    }
    static getAllUser = async(req,res,next) =>{
        try {
                const users = await UserModel.find({})
                            
                return res.status(200).json({
                    status: 'success',
                    message: users
                });

            
        } catch (error) {
            console.log(error)
        }
    }
    static getUser = async(req,res,next) =>{
        try {
                const user = await UserModel.findById({_id: req.params.id})
                return res.status(200).json({
                    status: 'success',
                    message: user
                });

            
        } catch (error) {
            console.log(error)
        }
    }
    static logIn = async(req,res,next)=>{
        try {
            const { userName, password } = req.body;
            if (userName && password) {
                const checkUserExitsInDb = await UserModel.findOne({userName: userName})
                console.log(checkUserExitsInDb)
                if (checkUserExitsInDb) {
                    const isPasswordMatched = await bcrypt.compare(password, checkUserExitsInDb.password);
                    console.log(isPasswordMatched)
                    if (userName === checkUserExitsInDb.userName &&  isPasswordMatched ) {
                        
                        // generate jwt token 
                        const JWTtoken =  jwt.sign(  { 
                                                        userID: checkUserExitsInDb._id
                                                    }, 
                                                    process.env.JWT_SECRET_KEY, 
                                                    {
                                                        expiresIn: "1h"
                                                    }
                                                );
                        const userDeatils = {
                            userName: checkUserExitsInDb.userName,
                            JWTtoken: JWTtoken,
                            role: checkUserExitsInDb.role
                        }
                        return res.status(200).send(
                                                        { 
                                                        status: "success", 
                                                        message: "You are LogedIn.",
                                                        userDetails: userDeatils
                                                    });

                    } else{
                        const err = new ErrorManagement(`The username or password entered does not match.`, 400);
                        return next(err);               
                    }
                }else {
                    const err = new ErrorManagement(`You are not a registered user, Please complete the registration process.`, 401);
                    return next(err);        
                }
            }else{
                const err = new ErrorManagement(`All feilds are required`, 400);
                return next(err);      
            }
           
        } catch (error) {
            console.log(error)
            return next(error);
        }
    }
}
export default UserController;