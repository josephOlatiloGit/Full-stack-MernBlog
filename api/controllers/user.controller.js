import { errorHandler } from "../utils/errorHandler.js";
import User from "../models/user.model.js";
import bycryptjs from "bcryptjs";

export const text = (req, res) => {
  res.json({ message: "Api is working" });
};

/**
 * Before a user profile can be updated we need to authenticate/verify the user params or token.
 */

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 8) {
      return next(
        errorHandler(400, "Password must contain at least 8 characters")
      );
    }
    req.body.password = bycryptjs.hashSync(req.body.password, 10);
  }

  // username validation checks:
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username > 20) {
      return next(errorHandler(400, "Username must be 7 to 20 characters "));
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username can not contain white spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }

    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain lowercase and numbers")
      );
    }
  }

  // profile update:
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        /**
         * The set method allow us to only update the single params listed from the body.
         */
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    return res.status(200).json(rest);
  } catch (error) {
    next(error);
    return;
  }
};

// // Store the timestamp when the password was updated
// req.user.lastPasswordUpdate = Date.now();
// await req.user.save();

// // Check if the user is updating the email
// if (req.body.email) {
//   // Ensure 24 hours have passed since the last password update
//   const timeSinceLastPasswordUpdate = Date.now() - req.user.lastPasswordUpdate;
//   const hoursPassed = timeSinceLastPasswordUpdate / (1000 * 60 * 60);
//   if (hoursPassed < 24) {
//     return next(
//       errorHandler(400, "You can only update your email after 24 hours since the last password change")
//     );
//   }
//

/**Delete User we make the delete route to
 be dynamic for both the Admin and the user : */

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(403, "You are not allowed to delete this user");
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};

// Sign out User:

export const signOut = (req, res, next) => {
  try {
    return res
      .cookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
    return;
  }
};

// Get all Users:
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIdex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIdex)
      .limit(limit);
    /*
     *We do not want to see the password so we map through the result and separate the password from the results */

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // To get the total users, and  from the previous month
    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
