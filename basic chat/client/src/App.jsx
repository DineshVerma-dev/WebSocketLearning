import React, { useEffect } from 'react'
import { io } from "socket.io-client"


const App = () => {

  const socket = io("http://localhost:4000")

  useEffect(() => {

    socket.on("connect", (id) => {
      console.log("connected frontend" ,socket.id);

    })

    socket.on("welcome" , (s) => {
      console.log(s)
    })
  }, [])



  return (
    <div>
      App
    </div>
  )
}

export default App
