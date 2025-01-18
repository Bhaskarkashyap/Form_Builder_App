import React, { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { LoaderCircle, Save } from 'lucide-react'
import useDesigner from './hooks/useDesigner'
import { UpdateFormContent } from '@/actions/form'

import { toast } from '@/hooks/use-toast'

function SaveFormBtn({id}: {id:number}) {
  const { elements} = useDesigner()
  const [loading, setTransition] = useTransition()
  
  const updateFormContent = async ()=> {
    try {
      const JsonElements = JSON.stringify(elements)
      await UpdateFormContent(id, JsonElements)
      toast({
        title: 'sucess',
        description: 'Your form has been saved'
      })
    } catch (error) {
      console.log(error)
      toast({
        title:"error",
        description:'something wents wrong'
      })
    }
  }

  return (
   <Button variant={"outline"} className='gap-2' disabled={loading}
   onClick={() => {
    setTransition(updateFormContent)
   }}
   >
    <Save className='w-4 h-4' />
    Save {loading && <LoaderCircle className='animate-spin' />}
   </Button>
  )
}

export default SaveFormBtn