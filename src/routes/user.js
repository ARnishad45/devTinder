const express = require("express");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middleware/userAuth");
const userRouter = express.Router();

const SAFE_USER_DATA = "firstName lastName photoUrl about skills";

//fetching pending requests
userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested", //will show only pending(interested) requests
    }).populate("fromUserId", SAFE_USER_DATA);

    res.json({
      message: "Peneding requests",
      connectionRequest,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser,
          status: "accepted",
        },
        {
          toUserId: loggedInUser,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);

    // console.log(connectionRequest);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Connections",
      data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 30 ? 30 : limit;

    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id.toString() },
        { fromUserId: loggedInUser._id.toString() },
      ],
    }).select("fromUserId toUserId");

    const hideUsersInFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersInFeed.add(req.fromUserId.toString()),
        hideUsersInFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersInFeed) } }, //excluding connections & users who already send request
        { _id: { $ne: loggedInUser._id } }, //hiding user itself from feed
      ],
    })
      .select(SAFE_USER_DATA)
      .skip(skip)
      .limit(limit);

    // console.log(users);

    res.send(users);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
