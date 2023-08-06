import { useState } from "react"
import InfiniteScroll from 'react-infinite-scroll-component';
import {motion as m, AnimatePresence} from 'framer-motion';

export default function Sidebar() {
    
    
    const [isOpen, setIsOpen] = useState(true);
    const [search, setSearch] = useState('')

    const fetchLatestConversations = () => console.log('elo');
    return (
        <>
        <button onClick={()=> setIsOpen(!isOpen)} className="absolute left-1 top-1 w-3 h-3 rounded-lg text-white">X</button>
        {/* <nav className={`${isOpen? 'translate-x-0' : ' -translate-x-full'} absolute left-0 right-0 transition-all bg-blue-900 h-full w-full md:w-2/3 duration-200 ease-in-out`}> */}
        <nav className={`${isOpen? 'md:w-[600px] w-5/6  translate-x-0' : 'md:w-0 md:[&>*]:invisible w-full -translate-x-full'} absolute md:relative inset-0  transition-all duration-150 ease-in-out p-2 flex flex-col gap-2 bg-indigo-800`}>
                <div className="flex flex-row justify-stretch gap-2 overflow-hidden">
                    <button className="bg-red-300 w-1/5 justify-self-start" onClick={()=> setIsOpen(!isOpen)}>Y</button>  
                    <h1 className="bg-white w-full">Dumb messanger</h1>
                </div>
                <div className="flex justify-stretch gap-2 overflow-hidden">
                    <div className="w-full bg-red-50 flex gap-2">
                        <span className="rounded-full bg-yellow-400">lupa</span>
                        <input onChange={(event)=>setSearch(event.target.value)} type="text" placeholder="search"></input>
                    </div>
                    <button className="bg-white w-1/5">Settings</button>
                </div>

            <InfiniteScroll
            dataLength={10}
            next={fetchLatestConversations}
            hasMore={false}
            loader={"Loading ..."}
            >
            <AnimatePresence mode='wait'>
            {search.length === 0 ? 
            <SidebarConversation/>
            :
            <m.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.2}} exit={{opacity:0}} className="flex flex-row h-20 justify-stretch gap-2 p-1 overflow-hidden bg-red-800 cursor-pointer">
                s
            </m.div>
            }
            </AnimatePresence>
            </InfiniteScroll>
        </nav>
        <div className=" md:hidden absolute right-0 top-0 h-full w-1/5" onClick={()=>setIsOpen(false)}>

        </div>
        </>
    )
};


function SidebarConversation() {
    const user = {
      name: 'Some name',
      image: 'x',
      latest: 'siem a siema siema siema siema siema a siema siema siema siema siemaa siema siema siema siema siema siema siema siema siema siema siema siema',
    };
  
    const truncateText = (text: string, maxLength: number) => {
      if (text.length <= maxLength) {
        return text;
      }
      return text.slice(0, maxLength) + '...';
    };
  
    return (
      <m.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.2}} exit={{opacity:0}} className="flex flex-row h-20 justify-stretch gap-2 p-1 overflow-hidden bg-indigo-800 cursor-pointer">
        <div className="rounded-full bg-yellow-200 min-w-[20%]">{user.image}</div>
        <div className="flex flex-col">
          <h3 className="w-full text-lg">{user.name}</h3>
          {user.latest && <p className="text-gray-400">{truncateText(user.latest, 50)}</p>}
        </div>
      </m.div>
    );
  }