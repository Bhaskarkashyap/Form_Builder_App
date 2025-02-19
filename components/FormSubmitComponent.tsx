"use client"

import React, { useCallback, useRef, useState, useTransition } from 'react'
import { FormElementInstance, FormElements } from './FormElements'
import { Button } from './ui/button';
import { LoaderCircle, MousePointerClick } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SubmitForm } from '@/actions/form';


function FormSubmitComponent({
    formUrl,
    content
} : {
    content: FormElementInstance[];
    formUrl: string
}) {
    const formValues = useRef<{[key : string] : string}>({});
    const formErrors = useRef<{[key: string] : boolean}>({});
    const [renderKey, setRenderKey ] = useState(new Date().getTime())

    const [submitted, setSubmitted] = useState(false)
    const [panding, startTransition] = useTransition()

    const validateForm: () => boolean = useCallback(() => {
        for (const field of content) {
            const actualValue = formValues.current[field.id] || "";
            const valid = FormElements[field.type].validate(field,actualValue)

            if(!valid) {
                formErrors.current[field.id] = true
            }
        }

        if(Object.keys(formErrors.current).length > 0){
            return false
        }

        return true
    }, [content])

    const submitValue = useCallback((key : string, value: string) => {
        formValues.current[key] = value
     } , [])

    const submitForm = async () => {
        formErrors.current = {};
        const validForm = validateForm()
        if(!validForm){
            setRenderKey(new Date().getTime())
            toast({
                title: 'Error',
                description:'please check the form ',
                variant:'destructive'
            })
            return 
        }

        try {

            const JsonContent = JSON.stringify(formValues.current)
            await SubmitForm(formUrl, JsonContent)
            setSubmitted(true)
            
        } catch (error) {
            toast({
                title: 'Error',
                description:'Something went wrong ',
                variant:'destructive'
            })
            console.log(error)
        }
        console.log("From values: " , formValues.current)
       
    }

    if(submitted) {
        return (
            <div className='flex justify-center w-full items-center p-8'>
            <div className='max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded'>
            <h1 className='text-2xl font-bold'>Form Submitted</h1>
            <p className='text-muted-foreground'>Thank you for submitting the form, you can leave the page</p>
            </div>
            </div>
        )
    }

  return (
    <div className='flex justify-center w-full h-full items-center p-8'>
        <div key={renderKey} className='max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded'>
            {
                content.map((element) => {
                    const FormElement = FormElements[element.type].formComponent;
                    return <FormElement key={element.id} elementInstance={element} submitValue={submitValue} isInvalid={formErrors.current[element.id]} defaultValues={formValues.current[element.id]} />
                })
            }
            <Button className='mt-8'
            onClick={() => {
                startTransition(submitForm)
            }} 
            disabled={panding} 
            >
          { !panding && <>
          <MousePointerClick className='mr-2' />
            Submit
          </>}
          {panding && <LoaderCircle className='animate-spin' />}
            </Button>
        </div>
    </div>
  )
}

export default FormSubmitComponent