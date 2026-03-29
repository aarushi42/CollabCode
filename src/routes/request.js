const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();
const sendEmail = require("../utilis/sendEmail");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;

    try {
      //check if to userId exists or not
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.json(`${toUserId} is Invalid`);
      }

      //check if the status is valid
      const ALLOWED_STATUS = ["interested", "ignored"];
      const isStatusValid = ALLOWED_STATUS.includes(status);
      if (!isStatusValid) {
        return res.json(`${status} is Invalid status`);
      }

      // if a request already exists
      const requestExists = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (requestExists) {
        return res.json(`Request already exists`);
      }

      const data = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await data.save();

      if (status == "interested") {
        const emailRes = await sendEmail.run({
          toEmailId: toUser.emailId,
          subject: "New Connection Request",
          message: `${req.user.firstName} wants to connect with you`,
        });

        console.log(emailRes);

        res.json(
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        );
      }
      if (status == "ignored") {
        res.json(req.user.firstName + " " + status + " " + toUser.firstName);
      }
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    //:status should be accepted or rejected
    //req status should be explicitly intereseted  to accept or rehect
    //loggenin user should be the to user
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const ALLOWED_STATUS = ["accepted", "rejected"];
      const isStatusAllowed = ALLOWED_STATUS.includes(status);
      if (!isStatusAllowed) {
        return res.status(400).json({ message: "Bad Request" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(400).json({ message: "Request not Found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();
      res.json({ message: "Request " + connectionRequest.status, data });
    } catch (err) {
      res.json({ message: `ERROR: ` + err.message });
    }
  },
);

module.exports = requestRouter;
