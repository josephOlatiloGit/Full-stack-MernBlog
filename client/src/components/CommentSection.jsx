import { generatePath, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
import { useState } from "react";
/**
 *We want to make sure that it only sign in user that 
 can comment on a post so we with  useSelector we get the id of a sign in user. 
 * YOu notice that when we click on the username link on in the comment section the page load the bottom of the profile page. so to fix that we create a component called ScrollTo top .
 */

export default function CommentSection({ postId }) {
  const [comment, setComment] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-sm text-gray-500">
          <p>Signed in as</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
          />
          <Link
            className="text-xs text-cyan-600 hover:underline"
            to={"/dashboard?tab=profile"}
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment
          <Link className="text-blue-500 hover:underline" to={"sign-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows={"3"}
            maxLength={"200"}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className=" flex justify-between items-center mt-5">
            <p className="gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline type="submit" gradientDuoTone={"purpleToBlue"}>
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
