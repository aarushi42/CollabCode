const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

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

module.exports = requestRouter;
