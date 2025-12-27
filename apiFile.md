*devTinder
#auth router
  POST/signup
  POST login
  POST logout

#profile router
  PATCH profile-view
  PATCH  profile-edit
  PATCH profile(patch password)

#connection request router
  POST request /send/intrested/:userid
  POST request/send/ignore/:userid
  POST /request/reviw/acepted/:request
  POST /request/reviw/rejectes/:request
 
#userRouter
 GET user/connections
 GET user/request/recived
 GET /feed -get you to the profile of other user on platfron

STATUS/ ignore ,intrested, accepted,rejected

