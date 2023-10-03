import connectDB from '../DB/connection.js'
import postRouter from './modules/post/post.router.js'
import authRouter from './modules/auth/auth.router.js'
import userRouter from "./modules/user/user.router.js"
import commentRouter from "./modules/comment/comment.router.js"
import replyCommentRouter from "./modules/replyComment/replyComment.router.js"
import { globalErrorHandling } from './utils/errorHandling.js'



const initApp = (app, express) => {
    //convert Buffer Data
    app.use(express.json({}))
    //Setup API Routing 
    app.use(`/auth`, authRouter)
    app.use(`/post`, postRouter)
    app.use('/user',userRouter)
    app.use('/comment',commentRouter)
    app.use('/replycomment',replyCommentRouter)

    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })
    app.use(globalErrorHandling)

    connectDB()

}



export default initApp