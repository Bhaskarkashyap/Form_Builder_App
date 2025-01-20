'use client'

import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';

type ButtonType = {
    url : string;
    label: string;
}

function UserButton({url, label} : ButtonType) {
     const router = useRouter();
      
        const handleGetStarted = () => {
          router.push(url);
        };
  return (
    <Button onClick={handleGetStarted}>
    {label}
  </Button>
  )
}

export default UserButton