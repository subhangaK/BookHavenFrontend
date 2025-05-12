import React from "react";
import {
  FaTimes,
  FaBullhorn,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaArrowRight,
  FaBell,
  FaRegClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Banner = ({
  message,
  onClose,
  type = "info",
  className = "",
  actionLabel,
  onAction,
  expiryTime,
  showProgress = false,
}) => {
  // Define styles and icons based on type
  const typeConfig = {
    info: {
      gradient: "from-indigo-600 to-purple-600",
      icon: <FaBullhorn className="w-6 h-6" />,
      label: "Announcement",
      accentColor: "bg-indigo-400",
      patternColor: "from-white/10 to-transparent",
    },
    success: {
      gradient: "from-green-600 to-emerald-600",
      icon: <FaCheckCircle className="w-6 h-6" />,
      label: "Success",
      accentColor: "bg-green-400",
      patternColor: "from-white/10 to-transparent",
    },
    warning: {
      gradient: "from-yellow-600 to-amber-600",
      icon: <FaExclamationTriangle className="w-6 h-6" />,
      label: "Warning",
      accentColor: "bg-yellow-400",
      patternColor: "from-white/10 to-transparent",
    },
    error: {
      gradient: "from-red-600 to-rose-600",
      icon: <FaTimesCircle className="w-6 h-6" />,
      label: "Error",
      accentColor: "bg-red-400",
      patternColor: "from-white/10 to-transparent",
    },
    promo: {
      gradient: "from-blue-600 to-cyan-600",
      icon: <FaBell className="w-6 h-6" />,
      label: "Special Offer",
      accentColor: "bg-blue-400",
      patternColor: "from-white/10 to-transparent",
    },
  };

  const { gradient, icon, label, accentColor, patternColor } =
    typeConfig[type] || typeConfig.info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`
          relative
          bg-gradient-to-r ${gradient}
          text-white
          p-6 md:p-8
          rounded-xl
          shadow-xl
          mx-auto
          max-w-5xl
          mb-8
          flex
          flex-col md:flex-row
          items-center
          border border-white/20
          overflow-hidden
          z-10
          transform
          transition-all
          duration-300
          hover:shadow-2xl
          ${className}
        `}
        role="alert"
        aria-live="polite"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {/* Left corner accent */}
          <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-white opacity-10"></div>

          {/* Right corner accent */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white opacity-5"></div>

          {/* Diagonal stripes */}
          <div className="absolute right-0 bottom-0 w-64 h-32 -rotate-12 opacity-10">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`absolute h-1 ${accentColor} rounded-full transform`}
                style={{
                  width: `${100 - i * 10}%`,
                  bottom: `${i * 6}px`,
                  right: `${i * 4}px`,
                  opacity: 0.7 - i * 0.1,
                }}
              ></div>
            ))}
          </div>

          {/* Top gradient pattern */}
          <div
            className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${patternColor}`}
          ></div>

          {/* Left gradient pattern */}
          <div
            className={`absolute top-0 left-0 h-full w-1 bg-gradient-to-b ${patternColor}`}
          ></div>
        </div>

        {/* Content container */}
        <div className="flex flex-col md:flex-row items-center w-full z-10">
          {/* Icon and Label */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div
              className={`flex-shrink-0 p-2 rounded-full bg-white/20 ${
                showProgress ? "relative" : ""
              }`}
            >
              {icon}
              {showProgress && (
                <svg
                  className="absolute -top-1 -left-1 -right-1 -bottom-1 w-10 h-10"
                  viewBox="0 0 100 100"
                >
                  <circle
                    className="text-white/20"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="46"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-white"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="46"
                    cx="50"
                    cy="50"
                    strokeDasharray="289.02652413026095"
                    strokeDashoffset="72.25663103256524"
                  />
                </svg>
              )}
            </div>
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide">
                {label}
              </span>
              {expiryTime && (
                <div className="flex items-center text-xs text-white/80 mt-1">
                  <FaRegClock className="mr-1" />
                  <span>Expires in {expiryTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Banner Content */}
          <div className="flex-grow px-4 md:px-6 text-center md:text-left">
            <p className="text-base md:text-lg font-medium leading-snug">
              {message}
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-4 md:mt-0 md:ml-4 flex items-center">
            {actionLabel && onAction && (
              <button
                onClick={onAction}
                className="
                  bg-white 
                  text-indigo-700 
                  font-medium 
                  py-2 
                  px-4 
                  rounded-lg
                  flex 
                  items-center
                  space-x-2
                  hover:bg-white/90
                  transition-colors
                  duration-200
                  shadow-md
                  mr-4
                "
              >
                <span>{actionLabel}</span>
                <FaArrowRight />
              </button>
            )}

            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="
                  flex-shrink-0
                  text-white
                  hover:text-gray-200
                  transition-colors
                  duration-200
                  focus:outline-none
                  focus:ring-2
                  focus:ring-white
                  rounded-full
                  p-2
                  hover:bg-white/20
                "
                aria-label="Close banner"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress bar at bottom */}
        {showProgress && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
            <div className="bg-white h-full w-3/4"></div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Banner;
