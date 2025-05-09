// "use client"

import Test from '@/components/test'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { Button } from '@/components/ui/button'
import { trpc } from '@/trpc/server'
import { ArrowRightIcon } from 'lucide-react'
import React from 'react'

const Home = () => {
  void trpc.hello.prefetch({text:"Surya"})
  return (
    <div>
      <BackgroundBeams/>
      <div className="flex flex-col justify-center items-center z-50 h-screen font-space-grotesk">
        <h1 className="text-white text-6xl font-bold mb-4">Notes App</h1>
        <p className="text-muted-foreground text-center mb-4">A minimalist note-taking application designed for clarity and simplicity. <br/> Create, organize, and find your notes with ease.</p>
        <div className="flex gap-2">
          <Button className='cursor-pointer'>Try Now <ArrowRightIcon/></Button>
          <Button className='cursor-pointer ' variant="outline">Learn More</Button>
        </div>
        <div className="mt-4 font-bold text-2xl text-white">
          <Test/>
        </div>
      </div>
    </div>
  )
}

export default Home