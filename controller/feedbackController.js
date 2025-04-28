import ErrorManagement from "../assets/ErrorHandling/customeErrorManagementFunction.js";
import feedbackModel from "../model/feedbackSchemaModel.js";
import path from 'path'
class FeedbackController {
    static createFeedback = async(req,res,next) =>{
        try {
            const {text, rating } = req.body;
            const image  =req.file;
            const imagePath = image ?  `${req.file.path}` : null
            
            if (text && text ) {
                const feedback = new feedbackModel({
                    userId: req.user._id,
                    text,
                    rating,
                    image: imagePath 
                  });
              
                  const savedFeedback = await feedback.save();
                
                return res.status(201).json({
                    status: 'success',
                    message: 'Feedback submiited.'
                });

            }else{
                const err = new ErrorManagement(`All Feilds are required`, 400);
                return next(err); 
            }
        } catch (error) {
            return next(error)
        }
    }
    static getAllFeedback = async(req,res,next) =>{
        try {
         const allFeedback = await feedbackModel.find({})
         return res.status(200).json({
            status: 'success',
            count: allFeedback.length,
            message: allFeedback
        });
        } catch (error) {
            return next(error)
        }
    }
    static getAllFeedbackByUser = async(req,res,next) =>{
        try {
         const allFeedbackByUser = await feedbackModel.find({userId: req.params.userId})
         return res.status(200).json({
            status: 'success',
            count: allFeedbackByUser.length,
            message: allFeedbackByUser
        });
        } catch (error) {
            return next(error)
        }
    }
    static getFeedbackById = async(req,res,next) =>{
        try {
         const feedback = await feedbackModel.findById({_id: req.params.id})
         return res.status(200).json({
            status: 'success',
            message: feedback
        });
        } catch (error) {
            return next(error)
        }
    }
    static commentOnFeedback = async(req,res,next) =>{
        try {
            const { comment} = req.body
            if (comment) {
                // const feedback = await feedbackModel.findByIdAndUpdate(
                //     req.params.id,
                //     { adminComment: comment },
                //     { new: true }
                //   );
                const feedback = await feedbackModel.findByIdAndUpdate({
                    _id: req.params.id,
                },
                {
                   $push: {
                    adminComment: {
                        commentedBy: req.user._id,
                        commentText: comment
                    }
                   }
                },{ new: true });
                  if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
             return res.status(200).json({
                status: 'success',
                message: 'Comment added successfully'
            });
            }
            const err = new ErrorManagement(`All fields are required!`, 400);
            return next(err);     
        } catch (error) {
            // console.log(error)
            return next(error)
        }
    }
    static getImageUploaded = async(req,res,next) => {
        try {
            const {id, fileName} = req.params;
           const getFile =  await feedbackModel.findById({
                _id:id,
                // image:fileName
            })
            console.log(getFile)
            if (getFile) {
                const filePath = path.join(process.cwd(), 'images', fileName);
                // console.log(fileName)
                console.log(filePath);
                return res.status(200).sendFile(filePath);
            }
            return res.status(200).json('not get');
        } catch (error) {
            // console.log(error)
           return next(error)
        }

    }
   
}

export default FeedbackController;