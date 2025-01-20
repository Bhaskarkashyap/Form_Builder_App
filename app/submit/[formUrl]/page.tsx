import { GetFormContentByUrl } from '@/actions/form'
import { FormElementInstance } from '@/components/FormElements'
import FormSubmitComponent from '@/components/FormSubmitComponent'
import React from 'react'

async function SubmitPage({params}: {params: {
    formUrl: string
}}) {
 
     const formURl = await params.formUrl
 
    const form  = await GetFormContentByUrl(formURl)

    if(!form) {
        throw new Error("form not found")
    }

    const formContent = JSON.parse(form.content) as FormElementInstance[];


  return (
    <FormSubmitComponent formUrl={params.formUrl} content={formContent} /> 
  )
}

export default SubmitPage