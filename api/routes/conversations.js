const router = require("express").Router();
const Conversation = require("../models/Conversation");

//POST NEW CONVERSATION
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET CONVERSATION OF USER
router.get("/:userId", async (req, res) => {
  let { userId } = req.params;
  try {
    const conversation = await Conversation.find({
      members: { $in: [userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET CONVERSATION INCLUDES TWO USERID
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  let { firstUserId, secondUserId } = req.params;
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [firstUserId, secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
