import React, { useEffect, useState } from "react";
import moment from "moment";
/**
 * We need to create a public user api to fetch the comment userId
 *
 */
export default function Comments({ comment }) {
  const [user, setUser] = useState({});
  console.log(user);
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
      {/* To show the time of comment we use a package called moment */}
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
      </div>
    </div>
  );
}
