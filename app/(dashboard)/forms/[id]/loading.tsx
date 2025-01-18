import React from 'react'
import { LoaderCircle } from 'lucide-react'

function Loading() {
  return (
    <div className='flex items-center justify-center w-full h-full'>
        <LoaderCircle className='animate-spin h-12 w-12' />
    </div>
  )
}

export default Loading