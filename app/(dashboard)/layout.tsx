
import React from 'react'

const Layout = ({ children }: {children : React.ReactNode}
) => {
  return (
    <div className='flex flex-col min-h-screen bg-background max-h-screen w-full max-w-7xl mx-auto'>
      
        <main className='flex w-full flex-grow '>{children}</main>
    </div>
  )
}

export default Layout