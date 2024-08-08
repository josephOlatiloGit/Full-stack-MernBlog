import Post from "../models/post.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all fields"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "-");
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    return res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Post route:
 * We need to make this route more dynamic so it can be
 * called at different places in our application.(by getting the post with all attributes from our Model, as well as searchTerms)
 * Also we want to add a show more button to render more post, we implement that by showing the post index.
 */

// export const getPosts = async (req, res, next) => {
//   try {
//     const startIndex = parseInt(req.query.startIndex) || 0;
//     const limit = parseInt(req.query.limit) || 9;
//     const sortDirection = req.query.order === "asc" ? 1 : -1;
//
// THIS CODE WILL RETURN A SERVER ERROR : source.toObject is not a function
// The Post model should be used to interact with the database, not to construct query objects directly.
//

//     const posts = await Post.find({
//       ...Post(req.query.userId && { userId: req.query.userId }),
//       ...Post(req.query.category && { category: req.query.category }),
//       ...Post(req.query.slug && { slug: req.query.slug }),
//       ...Post(req.query.postId && { _id: req.query.postId }),
//       ...Post(
//         req.query.searchTerm && {
//           $or: [
//             { title: { $regex: req.query.searchTerm, $options: "i" } },
//             { content: { $regex: req.query.searchTerm, $options: "i" } },
//           ],
//         }
//       ),
//     })
//       .sort({ updatedAt: sortDirection })
//       .skip(startIndex)
//       .limit(limit);

//     // getTotal post:
//     const totalPosts = await Post.countDocuments();

//     // getTotal Post in one month ago:
//     const now = new Date();

//     const oneMonthAgo = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       now.getDate()
//     );

//     const lastMonthPosts = await Post.countDocuments({
//       createdAt: { $gte: oneMonthAgo },
//     });

//     return res.status(200).son({
//       posts,
//       totalPosts,
//       lastMonthPosts,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const query = {};

    if (req.query.userId) query.userId = req.query.userId;
    if (req.query.category) query.category = req.query.category;
    if (req.query.slug) query.slug = req.query.slug;
    if (req.query.postId) query._id = req.query.postId;
    if (req.query.searchTerm) {
      query.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // getTotal post:
    const totalPosts = await Post.countDocuments(query);

    // getTotal Post in one month ago:
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      ...query,
      createdAt: { $gte: oneMonthAgo },
    });

    return res.status(200).json({
      success: true,
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Post:
export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    return res.status(200).json("Post has been deleted");
  } catch (error) {
    next(error);
    return;
  }
};

export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    return res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
    return;
  }
};
