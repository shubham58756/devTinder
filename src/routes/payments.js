const expres=require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter=expres.Router();
const razorpayInstance= require("../utils/razorpay");
const Payment=require("../model/payments");
const User=require("../model/user");
const {membershipAmount}=require("../utils/constants");
const { validate } = require("../model/user");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const { default: webhooks } = require("razorpay/dist/types/webhooks");
const user = require("../model/user");

paymentRouter.post("/payment/create",userAuth, async(req,res)=>{
    try{
        const{membershipType}=req.body;
        const{firstName,lastName,email}=req.user;
       const order= await razorpayInstance.orders.create({ 
            amount:membershipAmount[membershipType]*100,
            currency:"INR",
            receipt:"receipt#1",
            notes:{
                firstName,
                lastName,
                membershipType:membershipType,
        },
        
        });
        //save it to the my database
        //Return back to the order details to the frontend
       console.log(order);
       const payment=new Payment({
        usereId:req.user.id,
        orderId:order.id,
        amount:order.amount,
        currency:order.currency,
        receipt:order.receipt,
        notes:order.notes, 
       });
       const savedPayment= await payment.save();
        res.json({...savedPayment.toJSON(), keyId:process.env.RAZORPAY_KEY_ID});

       

    }
    catch(err){
    return res.status(500).json({msg:err.message});
    
    }

    
});
paymentRouter.post("/payment/webhook", async(req,res)=>{
    try{
        const webhookSignature=req.get("X-Razorpay-Signature");

        const isWebhookValid= validateWebhookSignature(
            JSON.stringify(req.body),
        webhookSignature,
        process.env.RAZORPAY_WEBHOOK_SECRET);
        if(!isWebhookValid){
            return res.status(400).json({msg:"Invalid webhook signature"});
            
        }
        //update payment status based on event type
        const paymentDeatils=req.body.payload.payment.entity;
        const payment=await Payment.findOne({orderId:paymentDeatils.order_id})
        payment.status=paymentDeatils.status;
        await payment.save();
        const user=await User.findOne({_id:payment.userId});
        user.isPremium=true;
        user.membershipType=payment.notes.membershipType; 
        await user.save();

        //update the user as premium
        //return sucess respose to the razorpay 



        // if(req.body.events=="payment.captured"){


        // }
        // if(req.body.events=="payment.failed"){
            
        // }
        return res.status(200).json({msg:"webbhook recived sucessfully"});
    }catch(err){
        return res.status(500).json({msg:err.message});
    }
})
paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user.toJSON();
  console.log(user);

  if (user.isPremium) {
    return res.json({
      isPremium: true,user
     
    });
  }

  return res.json({ isPremium: false ,user

   });
});


module.exports=paymentRouter;
