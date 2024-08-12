import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
/**
 * We need to create a public user api to fetch the comment userId
 *
 */
export default function Comments({ comment, onLike }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  // console.log(user);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full gb-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      {/* To show the time of comment we use a package called moment. 
      We make the likes to be valid only by one click so to create an api to keep and update the likes count */}
      <div className=" flex-1">
        <div className=" flex items-center mb-1">
          <span className="font-bold text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 mb-2">{comment.content}</p>
        <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
          <button
            type="button"
            onClick={() => onLike(comment._id)}
            className={`text-gray400 hover:text-blue-500 
              ${
                currentUser &&
                comment.likes.includes(currentUser._id) &&
                `!text-blue-500`
              } `}
          >
            <FaThumbsUp className="text-sm" />
          </button>
          <p className="text-gray-400">
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                " " +
                (comment.numberOfLikes === 1 ? "Like" : "Likes")}
          </p>
        </div>
      </div>
    </div>
  );
}
