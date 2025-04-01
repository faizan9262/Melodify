import React from "react";

const PlaylistCard = ({ name, img_src, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-[90%] md:w-full bg-[rgba(5,10,20,0.3)] flex flex-col text-white cursor-pointer shadow-xl rounded-md transition-all duration-300 hover:scale-105"
    >
      <div className="p-3">
        <img
          src={img_src}
          alt="playlist"
          className="w-full h-32 sm:h-48 md:h-56 lg:h-64 object-cover rounded-md"
        />
      </div>
      <p className="bg-transparent text-sm sm:text-lg font-semibold text-center mx-2 my-3">
        {name}
      </p>
    </div>
  );
};

export default PlaylistCard;
