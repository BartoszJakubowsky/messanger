import { useState } from "react"
import InfiniteScroll from 'react-infinite-scroll-component';
import {motion as m, AnimatePresence} from 'framer-motion';
import { api } from "~/utils/api";
import InfiniteConversationList from '../ui/InfiniteConversationList'
import ConversationUser from './ConversationUser'
export default function Sidebar() {
    
    
    const [isOpen, setIsOpen] = useState(true);
    const [search, setSearch] = useState('')

   
    return (
        <>
        <button onClick={()=> setIsOpen(!isOpen)} className="absolute left-1 top-1 w-3 h-3 rounded-lg text-white">Menu</button>
        {/* <nav className={`${isOpen? 'translate-x-0' : ' -translate-x-full'} absolute left-0 right-0 transition-all bg-blue-900 h-full w-full md:w-2/3 duration-200 ease-in-out`}> */}
        <nav className={`${isOpen? 'md:w-[600px] w-5/6  translate-x-0' : 'md:w-0 md:[&>*]:invisible w-full -translate-x-full -ml-4'} absolute md:relative inset-0  transition-all duration-150 ease-in-out p-2 flex flex-col gap-2 dark:bg-indigo-800 bg-pink-200`}>
                <div className="flex flex-row justify-stretch gap-2 overflow-hidden">
                    <button className="bg-indigo-950 w-1/5 justify-self-start p-2 rounded-sm" onClick={()=> setIsOpen(!isOpen)}>Back</button>  
                    <h1 className=" text-2xl text-slate-100">Your dumb messanger</h1>
                </div>
                <div className="flex justify-stretch gap-2 overflow-hidden">
                    <div className="w-full flex gap-2">
                        <input 
                        onChange={(event)=>setSearch(event.target.value)} 
                        className="w-full bg-indigo-400 focus-within:bg-indigo-200 text-white focus:placeholder:text-slate-100 transition-colors duration-200 placeholder:text-slate-200 p-1" 
                        type="text" 
                        placeholder="Search for someone"/>
                    </div>
                    <button className="bg-indigo-950 p-2 rounded-sm outline-none border-indigo-500">Settings</button>
                </div>

            <AnimatePresence mode='wait'>
            {search.length === 0 ? 
            <RecentConversations/>
            :
            <m.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.2}} exit={{opacity:0}}>
                <GetUser userName={search}/>
            </m.div>
            }
            </AnimatePresence>
        </nav>
        <div className=" md:hidden absolute right-0 top-0 h-full w-1/5" onClick={()=>setIsOpen(false)}>

        </div>
        </>
    )
};


function GetUser({ userName }: { userName: string }) {


  const { data: matchedUsers, isLoading, isError } = api.conversation.matchedUsers.useQuery({content: userName});

  if (isLoading) return <div>Loading...</div>;

  if (matchedUsers?.length === 0) return <p>Not found!</p>
  
  if (matchedUsers)
    return matchedUsers.map(user =><ConversationUser key={user.id} user={user}/>
      )
  
}


function RecentConversations() {

  const conversations = api.conversation.infiniteFeed.useInfiniteQuery({},
    { getNextPageParam: (lastScrollPage) => lastScrollPage.nextCursor});
  return (
    <InfiniteConversationList
      data={conversations.data?.pages.flatMap((scrollPage) => scrollPage.conversations)}
      isError={conversations.isError}
      isLoading={conversations.isLoading}
      hasMore={conversations.hasNextPage}
      fetchNewData={conversations.fetchNextPage}
      noData={'No conversations'}
    />
  );
}

