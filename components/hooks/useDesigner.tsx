"use client"

import { useContext } from 'react'
import { DesinerContext } from '../context/DesinerContext'

function useDesigner() {
    const context = useContext(DesinerContext)

    if(!context) {
        throw new Error("use desinger error")
    }
     return context

}

export default useDesigner