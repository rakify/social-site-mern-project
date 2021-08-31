const router = require("express").Router();
const path = require("path");
const Post = require("../models/Post");
const User = require("../models/User");

//for upload and storing image
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

//multer image upload process starts
const storage = multer.diskStorage({
  //destination: 'public/images/product_images/tmp',
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
    // path.extname gets the uploaded file extension
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1000 * 1000, // 1000*1000 Bytes = 1 MB
  },
  fileFilter(_req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only png, jpeg and jpg format
      return cb(new Error("Only .jpg .jpeg .png format allowed"));
    }
    cb(undefined, true);
  },
});
//multer image upload process ends

// CREATE A POST
router.post("/", upload.single("file"), async (req, res) => {
  let { userId } = req.body;

  if (req.file) {
    // Uploading the file to cloudinary
    try {
      let result = await cloudinary.uploader.upload(req.file.path, {
        folder: `social/${userId}`,
      });
      req.body.img = result.secure_url;
      req.body.img_id = result.public_id;
    } catch (err) {
      res.send(err);
    }
  }

  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE A POST
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const post = await Post.findById(id);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE A POST
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const post = await Post.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//LIKE or DISLIKE A POST
router.put("/:id/like", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const post = await Post.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("the post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET A POST
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET TIMELINE POSTS
router.get("/timeline/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const currentUser = await User.findOne({ _id: userId });
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => Post.find({ userId: friendId }))
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PROFILE POSTS
router.get("/profile/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const currentUser = await User.findOne({ username: username });
    const userPosts = await Post.find({ userId: currentUser._id });
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PUBLIC/ALL POSTS
router.get("/fetch/public", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
