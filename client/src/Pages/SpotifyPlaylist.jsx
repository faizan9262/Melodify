import React, { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import Playlist from '../components/Playlist'

const Music = () => {


 

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-grow overflow-y-auto">
        <Playlist />
      </div>
    </div>
  )
}

export default Music