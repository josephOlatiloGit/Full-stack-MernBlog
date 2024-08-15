import { Link } from "react-router-dom";

/**
 * In other to had a hover effect to the card frame we add a group-class to the container div, which mean if we hover over the group car we hover on every thing..
 * We add a plug in called line clamp tailwind to fix the content title line in the card , we install it and add it ass new plugin so then we specify the number of lines we want the text content to have.
 */

export default function PostCard({ post }) {
  return (
    <div className="group relative w-fill border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2 ">
        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
        <span className="italic text-sm">{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 group-hover:bottom-0 absolute  bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
