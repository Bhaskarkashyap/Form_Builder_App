"use client"

import React from 'react'
import { useForm } from 'react-hook-form'


import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LoaderCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import formSchema, { formSchemaType } from '@/app/schemas/form'
import { CreateForm } from '@/actions/form'
import { useRouter } from 'next/navigation'


const CreateFormButton = () => {
   const router = useRouter()
    const form = useForm<formSchemaType>({
     resolver: zodResolver(formSchema),
     defaultValues: {
      name: '',
      description: '',
  },
    })
   
    async function onSubmit(values:formSchemaType) {
      try {
       const formId =  await CreateForm(values)
        toast({
          title:"Success",
          description:"Form created successfully"
        })
        router.push(`/builder/${formId}`)


      } catch (error) {
        toast({
          title:'Error',
          description:'something wents wrong',
          variant: "destructive"
        })
        console.log(error)
      }
      
    }

  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button className=''>Create New Form</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Form</DialogTitle>
          <DialogDescription>Create a new form start collecting responses</DialogDescription>
        </DialogHeader>
        <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
         <FormField control={form.control} name='name' render={({field}) => (
               <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
               </FormItem>
  )} />
         <FormField control={form.control} name='description' render={({field}) => (
               <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormMessage />
               </FormItem>
  )} />
         </form>
        </Form>
        <DialogFooter>
          <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
          className='w-full mt-4'
          >
          {!form.formState.isSubmitting && <span>Save</span>}
          {form.formState.isSubmitting && <LoaderCircle className='animate-spin' />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFormButton