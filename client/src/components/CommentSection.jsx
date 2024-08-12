import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import Comments from "./Comments";
/**
 *We want to make sure that it only sign in user that 
 can comment on a post so we with  useSelector we get the id of a sign in user. 
 * YOu notice that when we click on the username link on in the comment section the page load the bottom of the profile page. so to fix that we create a component called ScrollTo top .
 */

export default function CommentSection({ postId }) {
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  console.log(comments);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  /**
   * Here we get the posts comment using useEffect. where the dependency the is postId, we catch/render the effect when the postId comment changes.
   */

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

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
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      <>
        {comments.length === 0 ? (
          <p className="text-sm py-5">No comments yet!</p>
        ) : (
          <div className=" text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              {comments.length}
            </div>
          </div>
        )}
        {comments.map((comment) => (
          <Comments key={comment._id} comment={comment} />
        ))}
      </>
    </div>
  );
}
