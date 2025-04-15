import React from "react";

const SongsCard = ({ name, onClick, artists, image, duration }) => {
  return (
    <>
      {/* Mobile Layout: Two Columns */}
      <div
        onClick={onClick}
        className="sm:hidden w-[95%] rounded-md shadow-md bg-[rgba(5,10,20,0.5)] m-2 cursor-pointer p-2 text-white flex flex-row gap-4 items-center"
      >
        {/* Left Column: Image */}
        <div className="flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="h-16 w-16 object-cover rounded-md"
          />
        </div>
        {/* Right Column: Song Details */}
        <div className="flex flex-col text-left flex-grow">
          <p className="text-base font-semibold">{name.split("(")[0]}</p>
          <p className="text-sm">Artists: {artists.join(", ")}</p>
          <p className="text-sm">{duration}</p>
        </div>
      </div>

      {/* Desktop Layout: Original Row Layout */}
      <div
        onClick={onClick}
        className="hidden sm:flex w-[97%] gap-3 rounded-md shadow-md bg-[rgba(5,10,20,0.5)] m-2 cursor-pointer p-2 text-white justify-between items-center"
      >
        {/* Left: Image */}
        <div className="flex items-center">
          <img
            src={image}
            alt={name}
            className="h-[60px] w-[60px] object-cover rounded-md"
          />
        </div>
        {/* Middle: Song Details */}
        <div className="flex flex-col text-base justify-center flex-grow">
          <p className="font-semibold">{name.split("(")[0]}</p>
          <p>Artists: {artists.join(", ")}</p>
        </div>
        {/* Right: Duration */}
        <div className="ml-auto pr-2 text-lg text-right">{duration}</div>
      </div>
    </>
  );
};

export default SongsCard;
