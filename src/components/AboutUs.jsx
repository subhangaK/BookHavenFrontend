import React from "react";
import aboutBg from "../assets/about-bg.jpg";
import openBook from "../assets/open-book.jpg";

const AboutUs = () => {
  return (
    <div className="w-full font-sans overflow-x-hidden">
      {/* Top Section with Background Image */}
      <div
        className="w-full h-[250px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${aboutBg})` }}
      >
        <h1 className="text-white text-4xl font-bold drop-shadow-md">
          About Us
        </h1>
      </div>

      {/* Welcome Section */}
      <div className="py-10 w-full">
        <h2 className="font-bold text-lg md:text-xl mb-4 text-center w-full">
          Welcome to Book Haven – Your Ultimate Bookstore Destination
        </h2>
        <p className="text-gray-800 w-full text-center text-sm md:text-base px-2 md:px-0">
          At Book Haven, we believe that every book tells a story, and every
          reader <br /> deserves a sanctuary where they can explore new worlds,
          spark their <br /> imagination, and discover timeless treasures. Our
          online bookstore is a <br /> carefully curated space for book lovers
          of all ages and interests.
        </p>

        {/* Centered Book Image */}
        <div className="absolute flex justify-center my-10 w-full">
          <img
            src={openBook}
            alt="Book"
            className="w-[250px] h-auto shadow-lg border-gray-100 border-1"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#2c5c7c] text-white w-full text-sm md:text-base mt-20 border-black border-1">
        <div className="flex justify-between flex-wrap max-w-6xl mx-auto px-4 py-6">
          {/* Left Side */}
          <div className="flex space-x-12">
            <div className="-ml-16">
              <p className="font-bold text-lg ">20+</p>
              <p>Users</p>
            </div>
            <div className="ml-32">
              <p className="font-bold text-lg">30+</p>
              <p>Books sold</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex space-x-8">
            <div className="-ml-10">
              <p className="font-bold text-lg">20+</p>
              <p>Articles</p>
            </div>
            <div className="ml-24">
              <p className="font-bold text-lg">20+</p>
              <p>Books Published</p>
            </div>
          </div>
        </div>
      </div>

      {/* What Sets Us Apart Section */}
      <div className="flex flex-col md:flex-row items-center justify-center py-10 w-full gap-10 px-0">
        {/* Left Box */}
        <div className="relative w-[240px] h-[240px] mt-10">
          {/* Back card (gray box on the left) */}
          <div className="absolute top-6 left-2 w-[190px] h-[200px] bg-gray-200 shadow-md z-0"></div>

          {/* Front card (blue box on the right) */}
          <div className="absolute top-0 right-0 w-[192px] h-[192px] bg-[#183c5c] text-white p-4 flex items-center justify-center z-10 shadow-md">
            <p
              className="text-center font-semibold leading-6"
              style={{
                fontFamily: '"IM Fell English SC", serif',
                fontSize: "1rem",
              }}
            >
              A<br />
              Haven Built
              <br />
              for Book
              <br />
              Lovers
            </p>
          </div>
        </div>

        {/* Right Content */}
        <div className="text-left w-full max-w-2xl px-4 -mt-10">
          <h3 className="font-bold mb-4">What Sets Book Haven Apart</h3>
          <ul className="list-none space-y-3 text-sm md:text-base">
            <li>
              <span className="text-blue-800 mr-2">◆</span>
              <strong>User-Friendly Experience:</strong> Clean, intuitive
              website design
            </li>
            <li>
              <span className="text-blue-800 mr-2">◆</span>
              <strong>Detailed Book Information:</strong> In-depth descriptions
              for every title
            </li>
            <li>
              <span className="text-blue-800 mr-2">◆</span>
              <strong>Handpicked Collection:</strong> Carefully selected
              bestsellers and hidden gems
            </li>
            <li>
              <span className="text-blue-800 mr-2">◆</span>
              <strong>Read Anywhere, Anytime:</strong> A digital space that
              feels like a cozy reading nook
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
