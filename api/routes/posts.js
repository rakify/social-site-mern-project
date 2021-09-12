const router = require("express").Router();
const path = require("path");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
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
router.put("/:id", upload.single("updateFile"), async (req, res) => {
  const { id } = req.params;
  const { userId, noImg = false, desc } = req.body;

  const updatedPost = {
    userId,
    desc,
  };

  try {
    const post = await Post.findById(id);
    if (post.userId === userId) {
      //if theres image upload it
      if (req.file) {
        try {
          let result = await cloudinary.uploader.upload(req.file.path, {
            folder: `social/${userId}`,
          });
          updatedPost.img = result.secure_url;
          updatedPost.img_id = result.public_id;
        } catch (err) {
          res.send(err);
        }
      }
      // if theres no image attached set img and img_id empty also destroy any img if there is
      if (noImg) {
        (updatedPost.img = ""), (updatedPost.img_id = "");
        post.img && await cloudinary.uploader.destroy(post.img_id);
      }
      await post.updateOne({ $set: updatedPost });
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








//GET COMMENTS BY POST RECENT 4 COMMENTS
router.get("/comments/all", async (req, res) => {
  const { postId } = req.query;
  try {
    const comments = await Comment.find({ postId: postId })
      .sort({ createdAt: -1 })
      .limit(4);
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json("No comments");
  }
});

//POST NEW COMMENT
router.post("/:postId/comment", async (req, res) => {
  try {
    const comment = new Comment(req.body);
    const newComment = await comment.save();
    const post = await Post.findById(req.body.postId);
    await post.updateOne({ $push: { comments: newComment._id } });
    res.status(200).json("Comment Added");
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE A COMMENT
router.delete("/comment/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  console.log(userId,id)
  try {
    const comment = await Comment.findById(id);
    if (comment.userId === userId) {
      console.log(comment)
      await Post.findByIdAndUpdate(comment.postId, { $pull: { comments: comment._id } });
      await comment.deleteOne();
      res.status(200).json("the comment has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
