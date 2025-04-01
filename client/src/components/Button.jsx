import React from 'react'

const Button = ({text,onClick ,className,icon}) => {
  return (
    <div onClick={onClick} className='bg-black text-white  hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 px-6 py-1 gap-2 rounded-full shadow-sm flex items-center justify-center cursor-pointer'>
      <p className={`font-semibold  quicksand ${className}`}>{text}</p>
      {icon}
    </div>
  )
}

export default Button
