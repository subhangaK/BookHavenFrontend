import React from "react";
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
  // Define styles based on type
  const typeConfig = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
        </svg>
      ),
      text: "text-blue-700",
      progressBg: "bg-blue-200",
      progressFill: "bg-blue-500",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-100",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      ),
      text: "text-green-700",
      progressBg: "bg-green-200",
      progressFill: "bg-green-500",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-500">
          <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
        </svg>
      ),
      text: "text-amber-700",
      progressBg: "bg-amber-200",
      progressFill: "bg-amber-500",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-100",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
        </svg>
      ),
      text: "text-red-700",
      progressBg: "bg-red-200",
      progressFill: "bg-red-500",
    },
    promo: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-500">
          <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
        </svg>
      ),
      text: "text-purple-700",
      progressBg: "bg-purple-200",
      progressFill: "bg-purple-500",
    },
  };

  const { bg, border, icon, text, progressBg, progressFill } = typeConfig[type] || typeConfig.info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`
          relative
          ${bg}
          ${border}
          border
          ${text}
          rounded-lg
          shadow-sm
          overflow-hidden
          max-w-4xl
          mx-auto
          mb-6
          ${className}
        `}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start px-4 py-3 md:py-4">
          {/* Icon */}
          <div className="flex-shrink-0 mr-3 mt-0.5">
            {icon}
          </div>
          
          {/* Content */}
          <div className="flex-grow">
            {expiryTime && (
              <div className="flex items-center text-xs opacity-75 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                </svg>
                <span>Expires in {expiryTime}</span>
              </div>
            )}
            <p className="text-sm md:text-base font-medium">{message}</p>
          </div>
          
          {/* Action */}
          <div className="flex-shrink-0 ml-4 flex items-center">
            {actionLabel && onAction && (
              <button
                onClick={onAction}
                className={`
                  mr-2
                  px-3
                  py-1
                  text-xs
                  font-medium
                  rounded
                  border
                  transition-colors
                  whitespace-nowrap
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-1
                  ${type === 'info' ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' : ''}
                  ${type === 'success' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' : ''}
                  ${type === 'warning' ? 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200' : ''}
                  ${type === 'error' ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' : ''}
                  ${type === 'promo' ? 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200' : ''}
                `}
              >
                {actionLabel}
              </button>
            )}
            
            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className={`
                  inline-flex
                  p-1.5
                  rounded-md
                  focus:outline-none
                  transition-colors
                  ${bg}
                  hover:bg-opacity-75
                `}
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        {showProgress && (
          <div className={`h-1 w-full ${progressBg}`}>
            <div
              className={`h-full ${progressFill} transition-all duration-300 ease-in-out`}
              style={{ width: "75%" }}
            ></div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Banner;