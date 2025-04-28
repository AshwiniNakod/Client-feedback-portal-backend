import express from 'express';
import multer from 'multer';
import UserController from '../controller/userController.js';
import userAuthMiddleware from '../middleware/authMiddleware.js';
import FeedbackController from '../controller/feedbackController.js';

export const router  = express.Router();

router.get('/',(req,res)=>{
    res.send("Welcome to client feedback portal")
})
router.post('/register',userAuthMiddleware,UserController.RegisterUser)
router.get('/getAllUser',UserController.getAllUser)
router.get('/getUser/:id',UserController.getUser)
router.post('/logIn',UserController.logIn)


//router for feedback controller

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() 
      console.log(file.originalname)
      cb(null,`${file.originalname}`.split('.')[0] + '-' + uniqueSuffix + '.' + `${file.originalname}`.split('.')[1])
    }
  })
 
  const upload = multer({ storage: storage })

router.post('/createFeedback', userAuthMiddleware, upload.single('image'),FeedbackController.createFeedback)
router.get('/getAllFeedback',FeedbackController.getAllFeedback)
router.get('/getAllFeedbackByUser/:userId',FeedbackController.getAllFeedbackByUser)
router.get('/getFeedbackById/:id',FeedbackController.getFeedbackById)
router.put('/commentOnFeedback/:id',userAuthMiddleware,FeedbackController.commentOnFeedback)
router.get('/showImage/:id/:fileName',FeedbackController.getImageUploaded)


