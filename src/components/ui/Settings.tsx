import { signOut, useSession } from "next-auth/react";
import Button from "./button";
import InputText from "../inputs/inputText";
import { useState } from "react";
import Modal from "./Modal";
import { api } from "~/utils/api";
import Switch from "./Switch";
import {type SetStateAction} from 'react';
import { useRouter } from "next/router";
interface UserProps {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    id: string;
    description: string;
}
interface SettingsProps {
    isOpen : boolean
    setModalSave : React.Dispatch<React.SetStateAction<boolean>>;
    setModalDelete : React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpen : React.Dispatch<React.SetStateAction<boolean>>;
    user: UserProps
    setUser: React.Dispatch<SetStateAction<({
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
    } & {
        id: string;
        description: string;
    }) | undefined>>;
}
export default function Settings({isOpen, setIsOpen, setModalDelete, setModalSave, user, setUser} : SettingsProps) {
    const [userName, setUserName] = useState(user.name);
    const [description, setDescription] = useState(user.description);
    const router = useRouter();
    
    const getInitialTheme = () => {

        if (window.matchMedia('(prefers-color-scheme: dark)').matches)
            return 'system'

        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
            return 'dark'
          } else {
            document.documentElement.classList.remove('dark')
            return 'light'
          }
            
    }
    const [theme, setTheme] = useState(getInitialTheme());

    const handleThemeChange = () => {

        if (theme === 'dark')
        {
            localStorage.setItem('theme', 'light')
            setTheme('light')
        }
        else
        {
            localStorage.setItem('theme', 'dark')
            setTheme('dark');
        }
    }
    const handleSaveClick = () => setModalSave(true);
    const handleDeleteClick = () => setModalDelete(true);

    const handleNameChange = (newName : string) => {

        if (newName.length > 28)
            return

        setUserName(newName);
        setUser({...user, name : newName, description})
    }
    const handleDescriptionChange = (newDescription : string) => {

        if (newDescription.length > 32)
            return
        setDescription(newDescription)
        setUser({...user, name: userName, description: newDescription})
    }

    return (
        <>
        <div className={`${isOpen? 'translate-x-0' : '-translate-x-full'} absolute inset-0  transition-all duration-150 ease-in-out p-2 flex flex-col gap-2 overflow-x-hidden  dark:bg-indigo-900 bg-pink-200 border-r-2 border-black`}>
            <div className="flex gap-2 justify-between bg-pink-100 dark:bg-indigo-700 p-2 border-b-2 border-black">
            <Button className="w-20" onClick={() => setIsOpen(!isOpen)} text={'go back'}/>
             <h1 className=" text-2xl mt-auto mb-auto overflow-hidden text-slate-100 text-center">{user?.name}</h1>
            <Button className='w-20' onClick={() => handleSaveClick()} text={'Save changes'}/>
             </div>
             <div className="p-2 flex flex-col gap-2 ">
                <div className=" flex flex-row gap-2">
                    <Button
                    onClick={() => {void signOut(); void router.push('/')}}
                    text="Sing out"
                    className="w-fit"
                    />
                    <div className="flex flex-col gap-1 items-center">
                        <label htmlFor="input" className="font-semibold">
                            Theme
                        </label>
                        <Switch className={`${theme == 'system' && 'pointer-events-none opacity-50'}`} onClick={handleThemeChange} initial={theme == 'dark' || theme == 'system' ? true : false} />
                    </div>
                </div>
                <label htmlFor="input" className="text-lg font-semibold">
                    Your name
                </label>
                <InputText className="w-36 rounded-sm" value={userName} onChange={(event)=>handleNameChange(event.target.value)}/>

                <label htmlFor="input" className="text-lg font-semibold">
                    Your description
                </label>
                <InputText className="w-36 rounded-sm" value={description} onChange={(event)=>handleDescriptionChange(event.target.value)}/>
             </div>
             <Button className='self-end mt-auto w-20 dark:bg-red-950 bg-red-400' onClick={() => handleDeleteClick()} text={'Delete account'}/>
        </div>
        </>
    )
};
