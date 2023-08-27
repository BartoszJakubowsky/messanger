import Button from './button';
import { useEffect } from 'react';
import {motion as m, AnimatePresence} from 'framer-motion';


interface ModalProps {
    modalText: string
    yesButton: string
    noButton? : string
    onClick : () => void
    isOpen : boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onlyButton: boolean
}
export default function Modal({modalText, yesButton, noButton, onClick, isOpen, setIsOpen, onlyButton = true} : ModalProps) {
    

    const spring = {
        type: "spring",
        stiffness: 700,
        damping: 30,
      };
      

      useEffect(() => {
        const handleEscapeKeyPress = (event: { keyCode: number; }) => {
          if (event.keyCode === 27 ) {

            handleGlobalClick()
          }
        };
    
        window.addEventListener('keydown', handleEscapeKeyPress);
    
        return () => {
            window.removeEventListener('keydown', handleEscapeKeyPress);
        };
      }, []); 
    

    const handleClickYes = () => {
        onClick && onClick();
        setIsOpen(false);
    }

    const handleClickNo = () => {
        setIsOpen(false)
    }
    const handleGlobalClick = () => {
        if (onlyButton)
        return

        setIsOpen(false)
    }
    return (
        <AnimatePresence mode='wait'>
        {isOpen? 
            <m.div onClick={handleGlobalClick} 
            initial = {{ opacity: 0 }}
            animate = {{ opacity: 1 }}
            transition={{duration: 0.2}}
            exit = {{ opacity: 0 }}
             className='fixed inset-0 bg-opacity-80 duration-200 transition-all bg-gray-900 z-50 flex justify-center items-center'>
            <m.div 
             transition={spring} 
             initial= {{ opacity: 0, scale: 0.5 }}
            animate= {{ opacity: 1, scale: 1 }}
            exit = {{ opacity: 0, scale: 0.75 }}
            className='relative w-80 rounded-sm h-60 bg-pink-600 dark:bg-indigo-800 mb-3/4 background p-4 overflow-hidden text-lg flex flex-wrap flex-col'>
            {modalText}
            <Button onClick={handleClickYes} text={yesButton} className='!w-fit !self-end mt-auto mb-2'/>
            {noButton && <Button onClick={handleClickNo} text={noButton} className='!w-fit !self-end mt-auto mb-2 dark:bg-red-950 bg-red-400'/>}
            </m.div>
            </m.div>
    :
    false}
    </AnimatePresence>
    )
}