"use client"

import {   Heading2 } from "lucide-react"
import { ElementsType, FormElement, FormElementInstance } from "../FormElements"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import useDesigner from "../hooks/useDesigner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"


const type:ElementsType = "SubTitleField"

const extraAttributes = {
    title:"SubTitle Field",

}

const propertiesShema = z.object({
    title: z.string().min(2).max(50),

})

export const SubTitleFieldFormElement:FormElement = {
    type,

    construct: (id:string) =>({
        id,
        type,
        extraAttributes
    }),
    
    designerBtnElement: {
     icon: Heading2 ,
     label: 'SubTitleField Field'    
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
    const { title } = element.extraAttributes;

return (
       <div className="flex flex-col gap-2 w-full">
        <Label className="text-muted-foreground">
        SubTitle Field
        </Label>
     <p className="text-lg">{title}</p>
       </div>
)
}

function FormComponent({
    elementInstance,

}: {
    elementInstance:FormElementInstance;

}) {
    const element = elementInstance as CustomInstance

    const { title } = element.extraAttributes;

return (
     <p className="text-lg">{title}</p>
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
         title: element.extraAttributes.title
        }
    })

    useEffect(() => {
    form.reset(element.extraAttributes)
    }, [element, form])

    
    function applyChanges(values: propertiesFormSchemaType) {
    const { title} = values;
    updateElement(element.id, {
        ...element,
        extraAttributes:{
           title
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
       name="title"
       render={({field}) => (
        <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
                <Input {...field} 
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