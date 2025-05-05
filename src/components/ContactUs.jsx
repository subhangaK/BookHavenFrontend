import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";
import contactImage from "../assets/contact.jpg";

const ContactUs = () => {
  return (
    <div className="">
      {/* Heading */}
      <div className="text-center mb-10 bg-[#A7A9AC] pb-10 pt-10">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-sm max-w-4xl mx-auto text-black mt-5">
          We’d absolutely love to hear from you—whether you have a question
          about our services, need guidance with something specific, want to
          explore potential collaborations, or simply feel like sharing your
          thoughts, experiences, or feedback with us.
        </p>
      </div>

      {/* Image + Contact Section */}
      <div className="max-w-7xl flex flex-col md:flex-row items-start gap-4 mx-52 ml-60">
        {/* Left Image in Separate Div */}
        <div className="w-full md:w-1/2 h-96 md:h-[500px] mt-10 -ml-10">
          <img
            src={contactImage}
            alt="Contact"
            className="w-[90%] h-full object-cover"
          />
        </div>

        {/* Right Section */}
        <div className="w-[60%] border border-black shadow-md p-6 bg-[#F0EEEE] -ml-32">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Contact Info */}
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-3">Get in Touch</h3>
              <p className="mb-4 text-gray-700 text-sm">
                Reach out to us through our contact form, email, or social media
                channels for any inquiries or support.
              </p>

              <div className="mb-3 flex items-start gap-2">
                <FaMapMarkerAlt className="text-orange-600 mt-1" />
                <div>
                  <p className="font-semibold ">Address</p>
                  <p>Balaju, Kathmandu</p>
                </div>
              </div>

              <div className="mb-3 flex items-start gap-2">
                <FaPhoneAlt className="text-orange-600 mt-1" />
                <div>
                  <p className="font-semibold">Phone number</p>
                  <p>+977 9827262555</p>
                </div>
              </div>

              <div className="mb-3 flex items-start gap-2">
                <FaEnvelope className="text-orange-600 mt-1" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="ml-1">bookhaven.business@gmail.com</p>
                </div>
              </div>

              <hr className="my-3 border-gray-400" />

              <div>
                <p className="font-semibold mb-2 ml-24">Follow us</p>
                <div className="flex gap-4 text-2xl text-gray-800 ml-20">
                  <FaInstagram className="text-pink-600 cursor-pointer" />
                  <FaFacebook className="text-blue-600 cursor-pointer" />
                  <FaTwitter className="text-blue-400 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Send Message Form */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm w-full md:w-[500px]">
              <h3 className="text-md font-semibold mb-4 text-center">
                Send a message
              </h3>
              <form className="space-y-3">
                <div>
                  <label className="block text-sm">Name</label>
                  <input
                    type="text"
                    className="w-full border-b border-black bg-transparent focus:outline-none py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm">Email</label>
                  <input
                    type="email"
                    className="w-full border-b border-black bg-transparent focus:outline-none py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm">Message</label>
                  <textarea
                    rows="3"
                    className="w-full border-b border-black bg-transparent focus:outline-none py-1 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-[#2B77A0] text-white px-4 py-2 rounded block mx-auto"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
