import Post from '../models/Post.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
    try {
        const { userId, description, picture } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            picture,
            userPicturePath: user.picture,
            likes: {},
            comments: []
        });
        await newPost.save();

        const post = await Post.find();
        res.json(post).status(201);
    } catch (error) {
        res.json({ message: error.message }).status(409);
        console.log(error.message);
    }
};

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts).status(200);
    } catch (error) {
        res.json({ message: error.message }).status(409);
        console.log(error.message);
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId });
        res.json(posts).status(200);
    } catch (error) {
        res.json({ message: error.message }).status(409);
        console.log(error.message);
    }
};

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        /* 
            likes:{
                userId: true,
            }
        */

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.json(updatedPost).status(200);
    } catch (error) {
        res.json({ message: error.message }).status(409);
        console.log(error.message);
    }
};