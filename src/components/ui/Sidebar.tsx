import { useState } from "react"
import InfiniteScroll from 'react-infinite-scroll-component';
import {motion as m, AnimatePresence} from 'framer-motion';
import { api } from "~/utils/api";
import ConversationUser from './ConversationUser'
import { useSession } from "next-auth/react";
import InfiniteConversationsList from "./InfiniteConversationList";
import InputText from "../inputs/inputText";
import Settings from "./Settings";
import Button from "./button";
import Modal from "./Modal";
import {GoSearch, GoX} from 'react-icons/go';
export default function Sidebar() {
    
    const { data: sessionData } = useSession();
    
    const [isOpen, setIsOpen] = useState(true);
    const [search, setSearch] = useState('')
    const [openSearch, setOpenSearch] = useState(true);
    const [openSettings, setOpenSettings] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const [user, setUser] = useState(sessionData?.user);
    const handleMenuClick = () => setOpenSettings(!openSettings);

    if (sessionData == undefined)
      return false
    
    const saveChanges = () => {
      console.log(user);
    }
    const handleOpenSearch = () => setOpenSearch(!openSearch)
    return (
        <>
        <Modal isOpen={openModal} setIsOpen={setOpenModal} onClick={saveChanges}  modalText="Are you sure you want to save changes?" noButton="No, go back" yesButton="Yes, save" onlyButton={false}/>
        <button onClick={()=> setIsOpen(!isOpen)} className="absolute left-1 top-1 w-3 h-3 rounded-lg text-white">Menu</button>
        {/* <nav className={`${isOpen? 'translate-x-0' : ' -translate-x-full'} absolute left-0 right-0 transition-all bg-blue-900 h-full w-full md:w-2/3 duration-200 ease-in-out`}> */}
        <nav className={`${isOpen? 'sm:w-[600px] w-full  translate-x-0' : 'md:w-0 md:[&>*]:invisible w-full -translate-x-full -ml-4'} absolute md:relative inset-0  transition-all duration-150 ease-in-out p-2 flex flex-col gap-2 dark:bg-indigo-800 bg-pink-200 overflow-x-hidden`}>
          <div className="max-w-[350px] min-w-[350px] flex flex-wrap  items-start">
                <div className="flex flex-row justify-stretch items-center gap-2 overflow-hidden mb-2 ">
                    <button className="bg-indigo-950 w-1/5 justify-self-start p-2 rounded-sm" onClick={()=> setIsOpen(!isOpen)}>Back</button>  
                    <h1 className=" text-xl text-slate-100 w-full bg-pink-300 dark:bg-indigo-500 p-1 rounded-sm">Your dumb messanger</h1>
                    <Button onClick={handleMenuClick} text={'Settings'}/>
                </div>
                <div className="flex justify-stretch gap-2 overflow-hidden w-full pr-2">
                    <div className="w-full flex gap-2">
                        {!openSearch 
                        ? <Button className="w-10 flex items-center justify-center" onClick={handleOpenSearch} text={<GoSearch/>}/>
                        :<>
                        <Button className="w-10 flex items-center justify-center" onClick={handleOpenSearch} text={<GoX/>}/>
                        <InputText 
                        value={search}
                        onChange={(event)=>setSearch(event.target.value)}
                        className="w-full bg-indigo-400 focus-within:bg-indigo-200 text-white focus:placeholder:text-slate-100 transition-colors duration-200 placeholder:text-slate-200 p-1" 
                        placeholder="Search for someone"/>
                        </>
                        }
                    </div>
                </div>
            {!openSearch ? 
            <RecentConversations/>
            :
            <m.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.2}} exit={{opacity:0}} className="flex gap-1 flex-wrap p-2 pr-4">
                <GetUser userName={search}/>
            </m.div>
            }
            <Settings isOpen={openSettings} setIsOpen={setOpenSettings}  setOpenModal={setOpenModal} user={user} setUser={setUser}/>
            </div>
        </nav>
        </>
    )
};

function GetUser({ userName }: { userName: string}) {

  const [stopSeachring, setStopSearching] = useState(false);
  const { data: matchedUsers, isLoading, isError } = api.conversation.matchedUsers.useQuery({content: userName});

  if (isLoading) return <div>Loading...</div>;

  if (matchedUsers?.length === 0) return <p>Not found!</p>
  
  if (matchedUsers)
    return matchedUsers.map(user =><ConversationUser  key={user.id} user={user}/>
  )
  
}


function RecentConversations() {

  const conversations = api.conversation.infiniteConversations.useInfiniteQuery(
    {}, 
    {getNextPageParam: (lastScrollPage) => lastScrollPage.nextCursor});
    
  if (conversations.data?.pages == 0)
      return <h1 className="w-full text-center">No conversations yet!</h1>
    
  return (
    <InfiniteConversationsList
      data={conversations.data?.pages.flatMap(conversationsArr => conversationsArr.conversations)}
      isError={conversations.isError}
      isLoading={conversations.isLoading}
      hasMore={conversations.hasNextPage}
      fetchNewData={conversations.fetchNextPage}
    />
  )
}

