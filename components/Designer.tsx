"use client"

import React, { useState } from 'react'
import DesignerSidebar from './DesignerSidebar'
import { DragEndEvent, useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

import useDesigner from './hooks/useDesigner'
import { ElementsType, FormElementInstance, FormElements } from './FormElements'
import idGenrator from '@/lib/idGenrator'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'


function Designer() {
  const { elements, addElement, selectedElement, setSelectedElement, removeElement} = useDesigner()

  const droppable = useDroppable({
    id:'designer-drop-area',
    data: {
      isDesignerDropArea: true
    }
  })
  useDndMonitor({
    onDragEnd: (event:DragEndEvent) => {
      const {active, over} = event;

      if(!active || !over) return null;

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea;

      if(isDesignerBtnElement && isDroppingOverDesignerDropArea) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(
          idGenrator()
        )
        addElement(elements.length, newElement)
        return ;
      }

      const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement;

      const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;

      const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement

      if(droppingSidebarBtnOverDesignerElement){
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(
          idGenrator()
        )
        const overId = over.data?.current?.elementId

        const overElementIndex = elements.findIndex(el => el.id === overId)
        if(overElementIndex === -1) {
          throw new Error("Element not found")
        } 

        let indexForNewElement = overElementIndex;

        if(isDroppingOverDesignerElementBottomHalf){
          indexForNewElement = overElementIndex + 1
        }
         addElement(indexForNewElement, newElement)
           return;
      }
     
      //third scenario

      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;

      const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement;

      if(draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data?.current?.elementId;
        const overId = over.data?.current?.elementId;

        const activeElementIndex = elements.findIndex(el => el.id === activeId)

        const overElementIndex = elements.findIndex(el => el.id === overId)
        if(activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error('element not found')
        }
         
        const activeElement = {...elements[activeElementIndex]}
        removeElement(activeId)

        let indexForNewElement = overElementIndex;
        if(isDroppingOverDesignerElementBottomHalf){
          indexForNewElement = overElementIndex + 1
        }
         addElement(indexForNewElement, activeElement)
           return;
      }

    }
  })
  return (
    <div className='flex w-full h-full'>
        <div className='p-4 w-full' onClick={() => {
          if(selectedElement) setSelectedElement(null)
        }}>
        <div ref={droppable.setNodeRef} 
        className={cn('bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto',
         droppable.isOver && "ring-4 ring-primary ring-inset")}>

           {!droppable.isOver && elements.length===0 && <p className='text-3xl text-muted-foreground flex flex-grow items-center font-bold'>Drag here</p>}

            {droppable.isOver && elements.length === 0 && (
              <div className='p-4 w-full'>
                <div className='h-[120px] rounded-md bg-primary/20'></div>
              </div>
            )}
            {elements.length > 0 && (
              <div className='flex flex-col w-full gap-2 p-4'>
                {elements.map((element) => (
                  <DesignerElementWrapper key={element.id} element={element} />
             
                ))}
           
              </div>
            )}
        </div>
        </div>
        <DesignerSidebar />
    </div>
  )
}

function DesignerElementWrapper({element}: {element:FormElementInstance}) {
  const { removeElement, setSelectedElement } = useDesigner()
  const [mouseIsOver , setMouseIsOver] = useState<boolean>(false)

  const DesinerElement = FormElements[element.type].designerComponent;

  const topHalf = useDroppable({
    id: element.id + '-top',
    data:{
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true
    }
  })

  const bottomHalf = useDroppable({
    id: element.id + '-bottom',
    data:{
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true
    }
  })

  const draggable = useDraggable({
    id: element.id + '-drag-handler',
    data:{
      type: element.type,
      elementId: element.id,
      isDesignerElement: true
    }
  })

  if(draggable.isDragging) return null;
  return (
   <>
    <div 
    ref={draggable.setNodeRef}
    {...draggable.listeners}
    {...draggable.attributes}
    className='relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset'
    onClick={(e) => {
      e.stopPropagation()
      setSelectedElement(element)
    }}
    onMouseEnter={ () => setMouseIsOver(true)}
    onMouseLeave={ () => setMouseIsOver(false)}
    >
      <div ref={topHalf.setNodeRef} className={'absolute  w-full h-1/2 rouded-t-md'}></div> 
      <div ref={bottomHalf.setNodeRef} className='absolute  w-full bottom-0 h-1/2 rouded-b-md'></div> 
      {mouseIsOver && (
        <>
        <div className='absolute right-0 top-1/2 -translate-y-1/2 p-2' 
        >
          <Button variant={'outline'} className='border-none bg-red-500' 
          onClick={(e) => {
            e.stopPropagation()
            removeElement(element.id) 
          }}
          >
            <Trash className='' />
          </Button>
        </div>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'>
          <p className='text-muted-foreground text-sm'>Click for properties or drag to move</p>
        </div>
        </>
      )}
      {topHalf.isOver && (
        <div className='absoloute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none ' />
      )}
      <div className={cn('flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100' ,
         mouseIsOver && 'opacity-30',
         )}>
      <DesinerElement elementInstance={element} />
    </div>
    {bottomHalf.isOver && (
        <div className='absoloute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-b-none ' />
      )}
    </div>
   </>
  )
  }

export default Designer