const express = require("express");
const ConnectionRequest = require("../models/connectionRequest.js");
const { userAuth } = require("../middleware/userAuth.js");
const User = require("../models/user.js");

const requestRouter = express.Router();

//Sending/Rejecting Connection Request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      
      //validating status type
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type " + status,
        });
      }
      
      //checking user is present in db
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({message: "User not found"});
      }

      //Check for existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId, toUserId: fromUserId
          },
        ],
      });


      if(existingConnectionRequest){
        return res.status(400).send({message: "Connection request Already Exists"});
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: req.user.firstName + " is interested in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(500).send("Error: " + err.message);
    }
  }
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try{
    const loggedInUser = req.user;
    const {status, requestId} = req.params;


    //validate the status
    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(403).json({message: "Invalid status " + status});
    }

    //requestId should be valid(present in db or not)
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested" //only interested requestes can be accepted
    });
    if(!connectionRequest){
      return res.status(400).json({message: "Connection request not found"});
    };
    //loggedInUser = toUserId

    connectionRequest.status = status;
    
    const data = await connectionRequest.save();

    res.json({message: "Connection request "+ status, data});
  }
  catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
