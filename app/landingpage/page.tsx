'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Roboto, Sen } from 'next/font/google'
import { cn } from "@/lib/utils";
import UserButton from "@/components/UserButton";
 
const roboto = Roboto({
  weight:"700",
  subsets:['latin']
})
const sen = Sen({
  weight:"400",
  subsets:['latin']
})


function LandingPage(){
  return (
 
 <div className="max-w-7xl mx-auto ">
    <div className="text-center  pt-36">
  
  <h1 className={cn(roboto.className, "text-8xl font-bold")}>Advanced Form Builder with <span className="text-purple-500">Drag & Drop</span> stuff</h1>
    <p className={cn(sen.className, " pt-5")}>Create unlimited form with just drag and drop field and share with link</p>
    <div className="pt-10 flex justify-center gap-5" >
    <UserButton url='/?visited=true' label='Get Started'  />
      <Button variant={'outline'}>Guest Demo</Button>
  </div>
    <div className="flex justify-center mt-10">
    <Image width={10000} height={10000} className="shadow-md w-full h-fulls shadow-gray-500" src='/dashboard.png' alt="Dashboard" />
    </div>
  </div>
  

 </div>

  );
};

export default LandingPage;
