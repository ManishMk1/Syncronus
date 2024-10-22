import React from 'react'
import { CircularProgress } from '@mui/material'
function Loading() {
  return (
    <div className='flex justify-center items-center w-[100vw] h-[100vh]'>
        <div className='flex justify-center items-center gap-5'>
            <h1>Loading</h1><CircularProgress></CircularProgress>
        </div>
    </div>
  )
}

export default Loading