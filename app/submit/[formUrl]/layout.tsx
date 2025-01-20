
import { ScrollText } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Layout = ({ children }: {children : React.ReactNode}
) => {
  return (
    <div className='flex flex-col min-h-screen bg-background max-h-screen h-screen w-full max-w-7xl mx-auto'>
        <nav className='flex justify-between items-center h-[60px] px-4 py-2'>
          <div className='flex gap-x-2'>
          <ScrollText size={15} /> 
          <h1 className='font-bold'>
          <Link href={"/"}>
          Form Builder
          </Link>
            </h1>
          </div>
  
        </nav>
        <main className='flex w-full flex-grow '>{children}</main>
    </div>
  )
}

export default Layout