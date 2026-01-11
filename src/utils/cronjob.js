const cron= require('node-cron');
const {subDays, startOfDay, endOfDay}=require("date-fns");
const sendEmail=require("./sendEmail");
const ConnectionRequestModel=require("../modelsConnectionRequest");





cron.schedule("0 8 * * *",async()=>{
   


    try{

        const yesterday=subDays (new Date(), 1);
        const yesterdayStart= startOfDay(yesterday);
        const yesterdayEnd=endOfDay(yesterday);


        const pendingRequests= await ConnectionRequestModel.find({
            status:"interested",
            cereatedAt:{
                $gte:yesterdayStart,
                $lt:yesterdayEnd,
            },

        }.populate("fromUUserId toUserId"));
        const listOfEmails = [
            ...new Set(pendingRequests.Map(req=>req.toUserId.email))
        ];
        for(const email of listOfEmails){
            //send email to user with pending requests
            try{
            const res=await sendEmail.run("New Friend Requests Pending" +email,
                "There are so many frend requests pending Plesase Login to the portal and Accept or Reject the Request.");
            console.log(res);
            }
            catch(err){ 
                console.log(err);
            }
        }
    }catch(err){
        console.error("Error executing cron job:", err);
    }
});