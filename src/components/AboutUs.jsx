import React from "react";
import {
  Book,
  Bookmark,
  Target,
  Award,
  Users,
  BookOpen,
  HeartHandshake,
} from "lucide-react";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 text-gray-900 font-sans">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-blue-500 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10"></div>
        <div className="container mx-auto px-4 py-16 text-center relative z-10">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>

          <h1 className="text-xl md:text-4xl font-bold mb-4 leading-tight animate-fade-in-down">
            BookHaven: Your Literary Sanctuary
          </h1>
          <p className="text-base max-w-2xl mx-auto mb-8 text-blue-100 animate-fade-in-up">
            More than an online bookstore – we craft a curated literary
            experience to spark your passion for reading and discovery.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/productpage"
              className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-full font-medium text-base transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore Our Collection
            </a>
            <a
              href="/register"
              className="border-2 border-white hover:bg-white/10 px-6 py-3 rounded-full font-medium text-base transition duration-300 transform hover:-translate-y-1"
            >
              Become a Member
            </a>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white p-8 rounded-xl shadow-xl transform transition duration-500 hover:scale-105">
            <BookOpen className="text-indigo-600 mb-6" size={40} />
            <h2 className="text-2xl font-bold mb-6 text-indigo-800">
              Our Story
            </h2>
            <p className="text-base text-gray-700 mb-6 leading-relaxed">
              Founded by passionate bibliophiles, BookHaven was born from a
              dream to create a digital sanctuary where book lovers can
              discover, connect, and immerse themselves in literary worlds.
              Every book is a journey, and every reader deserves an inspiring,
              tailored experience.
            </p>
            <div className="flex items-center text-indigo-600">
              <Target className="mr-3" size={24} />
              <span className="font-semibold text-base">
                Connecting Readers, One Book at a Time
              </span>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <Bookmark className="text-indigo-600 mr-4" size={32} />
                <h3 className="text-lg font-semibold text-indigo-900">
                  Curated Selection
                </h3>
              </div>
              <p className="text-base text-gray-600 leading-relaxed">
                Our expert curators handpick each title, ensuring only the most
                captivating, thought-provoking, and high-quality books grace our
                virtual shelves.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <HeartHandshake className="text-indigo-600 mr-4" size={32} />
                <h3 className="text-lg font-semibold text-indigo-900">
                  Vibrant Community
                </h3>
              </div>
              <p className="text-base text-gray-600 leading-relaxed">
                Beyond a bookstore, we’re a thriving community of readers,
                writers, and book enthusiasts united by our love for the magic
                of literature.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact and Achievements */}
      <div className="bg-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12 text-indigo-900 animate-fade-in">
            Our Progress So Far
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <Users className="text-indigo-700 mx-auto mb-4" size={40} />
                ),
                number: "10+",
                label: "Active Members",
                color: "text-indigo-900",
              },
              {
                icon: (
                  <Book className="text-indigo-700 mx-auto mb-4" size={40} />
                ),
                number: "20+",
                label: "Books Published",
                color: "text-indigo-900",
              },
              {
                icon: (
                  <Award className="text-indigo-700 mx-auto mb-4" size={40} />
                ),
                number: "3+",
                label: "Genres Explored",
                color: "text-indigo-900",
              },
              {
                icon: (
                  <Bookmark
                    className="text-indigo-700 mx-auto mb-4"
                    size={40}
                  />
                ),
                number: "90%",
                label: "Positive Feedback",
                color: "text-indigo-900",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl text-center shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2"
              >
                {stat.icon}
                <p className={`text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.number}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-500 to-blue-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-xl md:text-4xl font-bold mb-4 animate-fade-in-down">
            Begin Your Literary Adventure
          </h2>
          <p className="text-base mb-8 max-w-2xl mx-auto text-blue-100 animate-fade-in-up">
            Whether you’re chasing your next great read, a gift for a book
            lover, or a portal to new worlds, BookHaven is your trusted guide in
            the enchanting world of books.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/productpage"
              className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-full font-medium text-base transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Shop Now
            </a>
            <a
              href="/register"
              className="border-2 border-white hover:bg-white/10 px-6 py-3 rounded-full font-medium text-base transition duration-300 transform hover:-translate-y-1"
            >
              Join Us Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
