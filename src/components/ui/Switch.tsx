/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion as m } from "framer-motion";
import {type ReactNode} from 'react'
interface SwitchProps {
    onClick: (prop: boolean) => void
    initial? : boolean
    children?: ReactNode
    className? : string
}
export default function Switch ({onClick, initial,children, className} : SwitchProps)
{
    const [isOn, setIsOn] = useState(initial);

    const toggleSwitch = () => 
    {
        setIsOn(!isOn);
        onClick(!isOn);
    }
  
    return (
      <div className={` ${className}  w-20 h-8 border-2 dark:border-indigo-300 border-pink-300 flex ${isOn? 'justify-end' : 'justify-start'} items-center cursor-pointer rounded-3xl p-2 "`} 
      onClick={toggleSwitch}
      >
        <m.div className={`w-6 h-6 ${isOn? 'dark:bg-indigo-700 bg-pink-500' : 'bg-pink-300 dark:bg-indigo-500'} cursor-pointer rounded-3xl`} layout transition={spring}/>
        {children}
      </div>
    );
}

const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };