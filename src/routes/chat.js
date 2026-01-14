const express=require("express");
const chatRouter=express.Router();
chatRouter.get('/chat/:targetUserId',async(req,res)=>{
    const {targetUserId}=req.params;
    const userId=req.user._id;
    try{

        let chat= await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate({
            path:"messages.senderId",
            select:"firstName lastName profilePicture",
        })
        if(!chat){
            chat=new Chat({
                participants:[userId,targetUserId],
                messages:[],
            })
            await chat.save();
        }
        return res.status(200).json({chat});
    }
    catch(err){
        console.log(err);
    }

});



module.exports=chatRouter;