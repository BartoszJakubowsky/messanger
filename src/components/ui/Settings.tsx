import { useSession } from "next-auth/react";
import Button from "./button";
import InputText from "../inputs/inputText";
import { useState } from "react";
import Modal from "./Modal";
import { api } from "~/utils/api";
import Switch from "./Switch";


interface UserProps {
    name: string,
    theme: string
}
interface SettingsProps {
    isOpen : boolean
    setIsOpen : React.Dispatch<React.SetStateAction<boolean>>;
    setOpenModal : React.Dispatch<React.SetStateAction<boolean>>;
    user: UserProps
    setUser: React.Dispatch<object>;
}
export default function Settings({isOpen, setIsOpen, setOpenModal, user, setUser} : SettingsProps) {
    
    const [userName, setUserName] = useState(user?.name);
    const [theme, setTheme] = useState(user?.theme)
    const handleSaveClick = () => setOpenModal(true);

    const handleNameChange = (newName : string) => {
        setUserName(newName);
        setUser({...user, name : userName})
    }

    const handleThemeChange = (themeBoolean : boolean) => {
        if (!themeBoolean)
        setTheme('light');
        else
        setTheme('dark')
        
        setUser({...user, theme: themeBoolean? 'dark' : 'light'})
    }

    return (
        <>
        <div className={`${isOpen? 'translate-x-0' : '-translate-x-full'} absolute inset-0  transition-all duration-150 ease-in-out p-2 flex flex-col gap-2 overflow-x-hidden  dark:bg-indigo-900 bg-pink-200`}>
            <div className="flex gap-2 items-center bg-ping-100 dark:bg-indigo-800 p-2 border-b-2 border-black">
            <Button onClick={() => setIsOpen(!isOpen)} text={'go back'}/>
             <h1 className=" text-2xl text-slate-100">{user?.name}</h1>
            <Button onClick={() => handleSaveClick()} className="ml-auto" text={'Save changes'}/>
             </div>
             <div className="p-2 flex flex-col gap-2 ">
                <label htmlFor="input" className="text-lg font-semibold">
                    Your name
                </label>
                <InputText className="w-36 rounded-sm" value={userName} onChange={(event)=>handleNameChange(event.target.value)}/>
                <Switch onClick={handleThemeChange} initial={theme == 'dark' ? true: false} />
             </div>
        </div>
        </>
    )
};
