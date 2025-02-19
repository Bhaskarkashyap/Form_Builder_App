import React, { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { BookCheck, LoaderCircle } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { toast } from '@/hooks/use-toast'
import { PublishForm } from '@/actions/form'
import { useRouter } from 'next/navigation'



function PublishFormBtn({id} : {id: number}) {
  const [loading , startTransition] = useTransition();
  const router = useRouter();


  async function publishForm() {
    try {
      await PublishForm(id)
      toast({
        title:"sucess",
        description:"Your form is now available to the public"
      })
      router.refresh()
    } catch (error) {
      toast({
        title:"Error",
        description:"something wents wrong"
      })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='gap-2'>
        <BookCheck className='h-4 w-4' />
        Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
       <AlertDialogHeader>
       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
       <AlertDialogDescription>
        This action cannot be undone. After publishing you will not be able to edit this form. <br />
        <span className='font-medium'>
          By publishing this form you will make it abailable to the public and you will be able to collect submission
        </span>
       </AlertDialogDescription>
       </AlertDialogHeader>
       <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction disabled={loading}
        onClick={(e) => {
          e.preventDefault();
          startTransition(publishForm)
        }}
        >Proceed {loading && <LoaderCircle className='animate-spin' />}</AlertDialogAction>
       </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PublishFormBtn