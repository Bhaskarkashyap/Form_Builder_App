"use client"

import {  Pilcrow } from "lucide-react"
import { ElementsType, FormElement, FormElementInstance } from "../FormElements"
import { Label } from "../ui/label"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import useDesigner from "../hooks/useDesigner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"


const type:ElementsType = "ParagraphField"

const extraAttributes = {
    text: "Text here..",

}

const propertiesShema = z.object({
    text: z.string().min(2).max(500),

})

export const ParagraphFieldFormElement:FormElement = {
    type,

    construct: (id:string) =>({
        id,
        type,
        extraAttributes
    }),
    
    designerBtnElement: {
     icon: Pilcrow ,
     label: 'Paragraph Field'    
    },

    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: () => true,
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes
}

function DesignerComponent({
    elementInstance
}: {
    elementInstance:FormElementInstance
}) {
    const element = elementInstance as CustomInstance
    const { text } = element.extraAttributes;

return (
       <div className="flex flex-col gap-2 w-full">
        <Label className="text-muted-foreground">
        Paragraph Field
        </Label>
     <p>{text}</p>
       </div>
)
}

function FormComponent({
    elementInstance,

}: {
    elementInstance:FormElementInstance;

}) {
    const element = elementInstance as CustomInstance

    const { text } = element.extraAttributes;

return (
     <p>{text}</p>
)
}


type propertiesFormSchemaType = z.infer< typeof propertiesShema>

function PropertiesComponent({
    elementInstance
}:{
    elementInstance:FormElementInstance
}){
    const element = elementInstance as CustomInstance
    const { updateElement } = useDesigner()

    const form = useForm<propertiesFormSchemaType>({
        resolver : zodResolver(propertiesShema),
        mode: 'onBlur',
        defaultValues: {
         text: element.extraAttributes.text
        }
    })

    useEffect(() => {
    form.reset(element.extraAttributes)
    }, [element, form])

    
    function applyChanges(values: propertiesFormSchemaType) {
    const { text} = values;
    updateElement(element.id, {
        ...element,
        extraAttributes:{
           text
        }
    })
    }
    

    return(
       <Form {...form}>
       <form onBlur={form.handleSubmit(applyChanges)} className="space-y-3" onSubmit={(e) => {
        e.preventDefault()
       }}>
       <FormField 
       control={form.control}
       name="text"
       render={({field}) => (
        <FormItem>
            <FormLabel>Text</FormLabel>
            <FormControl>
                <Textarea rows={5} {...field} 
                onKeyDown={(e) => {
                    if(e.key === 'Enter') e.currentTarget.blur()
                }}
                />
            </FormControl>
          
            <FormMessage />
        </FormItem>
    )}
       />
       </form>
       </Form>
    )
}