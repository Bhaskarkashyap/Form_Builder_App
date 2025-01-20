import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { Button } from '@/components/ui/button'
import { ScrollText } from 'lucide-react'

import React from 'react'
import UserButton from '@/components/UserButton'

const LandingPageLayout = ({ children }: {children : React.ReactNode}
) => {

  return (
   <div className='relative'>
    <div className="absolute z-[-1] bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_80%)]">
    </div>
    <div className='flex  flex-col min-h-screen max-h-screen w-full container mx-auto'>
        <nav className='flex justify-between items-center  p-4'>
          <div className='flex gap-x-2 bg-background px-2'>
          <ScrollText size={15} /> 
          <h1 className='font-bold text-xl '>
          
          Form Builder
          
            </h1>
          </div>
          <div className='flex gap-4 items-center'>
            <ThemeSwitcher />
         <UserButton url='/?visited=true' label='Get Started' />
          </div>
        </nav>
        <main className='flex w-full flex-grow '>{children}</main>
        
        <footer className='flex justify-between items-center  pt-36 pb-10'>
  
            <div className=' text-muted-foreground flex items-center'><span className='mr-2'>&copy; </span><p>Created by BHASKAR</p></div>
          <div className='flex gap-4 items-center'>
            <Button>
           Subcribe
         </Button>
          </div>
        </footer>
    </div>
   </div>
  )
}

export default LandingPageLayout