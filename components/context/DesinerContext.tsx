"use client"

import { createContext, Dispatch, SetStateAction, useState } from "react"
import { FormElementInstance } from "../FormElements"

type DesinerContextType = {
    elements:FormElementInstance[];
    setElements:  Dispatch<SetStateAction<FormElementInstance[]>>
    addElement: (index: number, element: FormElementInstance) => void;
    removeElement: (id : string) => void

    selectedElement: FormElementInstance | null;
    setSelectedElement:Dispatch<SetStateAction<FormElementInstance | null>> 

    updateElement: (id: string, element: FormElementInstance) => void;
}

export const DesinerContext = createContext<DesinerContextType | null>(null);

export default function DesinerContextProvider({children} : {
    children: React.ReactNode
}){
    const [elements, setElements] = useState<FormElementInstance[]>([])
    const [selectedElement , setSelectedElement] = useState<FormElementInstance | null>(null)

    const addElement = (index:number, element:FormElementInstance) => {
        setElements((prev) => {
            const newElements = [...prev]
            newElements.splice(index,0,element)
            return newElements;
        })
    }

    const removeElement = (id: string) => {
        setElements((prev) => prev.filter((element) => element.id !== id))
    }

    const updateElement = (id:string, element:FormElementInstance) => {
        setElements(prev => {
            const newElements = [...prev] 
            const index = newElements.findIndex(el => el.id === id)
            newElements[index] = element

            return newElements;
        })
    }

    return <DesinerContext.Provider 
    value={{
      elements,
      addElement,
      removeElement,
      setElements,
      selectedElement,
      setSelectedElement,

      updateElement
    }}>
        {children}
    </DesinerContext.Provider>
}