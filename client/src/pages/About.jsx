import React from "react";

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-3xl font-semibold text-center py-7">
            About TobildCode Blog
          </h1>
          <div className="text-md text-gray-500 flex flex-col gap-6  ">
            <p>
              I started the Tobild Blog to showcase my abilities and expertise
              as a full stack developer. My profession is software engineering,
              and I enjoy writing about my experiences and the lessons I've
              learnt. This blog is intended to act as a community where software
              engineers may exchange ideas, articles, and tips for debugging
              code as well as support one another's professional development.
            </p>

            <p>
              Every week, this site will include tutorials and articles covering
              subjects including programming languages, software engineering,
              and web development. Make sure to return for fresh stuff as I am
              constantly discovering and learning about new technologies!
            </p>
            <p>
              We invite you to interact with other readers by leaving comments
              on our content. It is possible for you to respond to and like
              comments left by other users. We think that a community of
              learners can support one another's development and progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
