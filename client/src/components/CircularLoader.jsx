import React from "react";

const CircularLoader = () => {
  const loaderStyle = {
    border: "5px solid #f3f3f3",  // Light gray
    borderTop: "5px solid #7B3F00",  // Darker color for the spinner
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    animation: "spin 1s linear infinite"
  };

  return (
    <div className="flex justify-center items-center">
      <div style={loaderStyle}></div>
    </div>
  );
};

export default CircularLoader;
