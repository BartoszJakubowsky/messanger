import { useEffect, useState } from "react"
import {motion as m} from 'framer-motion';
import { api } from "~/utils/api";
import UserPanel from './UserPanel'
import { useSession } from "next-auth/react";
import InfiniteConversationsList from "./InfiniteConversationList";
import InputText from "../inputs/inputText";
import Settings from "./Settings";
import Button from "./button";
import Modal from "./Modal";
import {GoSearch, GoX, GoPeople, GoNote} from 'react-icons/go';
import { useRouter } from "next/router";
export default function Sidebar() {
    
    const { data: sessionData } = useSession();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [search, setSearch] = useState('')
    const [openSearch, setOpenSearch] = useState(false);
    const [searchConv, setSearchConv] = useState(true);
    const [openSettings, setOpenSettings] = useState(false);
    const [modalSave, setModalSave] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);

    const [user, setUser] = useState(sessionData?.user);
    

    const mutateUserSave =  api.userRouter.updateUser.useMutation({
      onSuccess: (newUser) => {
        setUser(newUser)
      router.reload();
      }
    })

    const mutateUserDelete = api.userRouter.deleteUser.useMutation({
      onSuccess: () => {
        router.reload();
      }
    });
    
    useEffect(()=> {
        setUser(sessionData?.user)
    }, [sessionData?.user])

    if (!user)
      return;

    const handleMenuClick = () => setOpenSettings(!openSettings);

    if (sessionData == undefined)
      return false
    
  

    const saveChanges = () => {
      if (user?.name)
        mutateUserSave.mutate({name: user.name, description: user.description})
    }
    const deleteUser = () => {
        mutateUserDelete.mutate();
    }
    const handleOpenSearch = () => setOpenSearch(!openSearch)

    return (
        <>
        <Modal isOpen={modalSave} setIsOpen={setModalSave} onClick={saveChanges}  modalText="Are you sure you want to save changes?" noButton="No, go back" yesButton="Yes, save" onlyButton={false}/>
        <Modal isOpen={modalDelete} setIsOpen={setModalDelete} onClick={deleteUser}  modalText="Are you sure you want to delete the account?" noButton="No, go back" yesButton="Yes, delete" onlyButton={false}/>
        <Button onClick={()=> setIsOpen(!isOpen)} text="Menu" className="absolute left-1 top-1"/>
        <nav className={`${isOpen? 'w-full md:w-[615px]  translate-x-0' : 'md:w-0 md:[&>*]:invisible w-full -translate-x-full -ml-4'} z-[1] absolute md:relative inset-0  transition-all duration-150 ease-in-out p-2 flex flex-col gap-2 dark:bg-indigo-800 bg-pink-200 overflow-x-hidden`}>
          <div className="max-w-[350px] min-w-[350px]">
                <div className="flex flex-row justify-between mb-2">
                    <Button text='Back' className="w-20" onClick={()=>setIsOpen(!isOpen)}/>
                    <h1 className=" pointer-events-none text-lg text-slate-100 flex bg-pink-300 dark:bg-indigo-600 p-3 rounded-sm">Dumb messanger</h1>
                    <Button onClick={handleMenuClick} className="w-20" text={'Settings'}/>
                </div>
                <div className="flex justify-stretch gap-2 overflow-hidden w-full">
                    <div className="w-full flex gap-2">
                        {!openSearch 
                        ? <Button className="w-10 h-10 flex items-center justify-center" onClick={handleOpenSearch} text={<GoSearch/>}/>
                        :<>
                        <div className="flex justify-between gap-2 h-10">
                        <Button className="w-10 flex items-center justify-center" onClick={handleOpenSearch} text={<GoX/>}/>
                        <Button className="w-10 flex items-center justify-center" text={searchConv?  <GoPeople/> : <GoNote/> } onClick={()=> setSearchConv(!searchConv)}/>
                        </div>
                        <InputText 
                        value={search}
                        onChange={(event)=>setSearch(event.target.value)}
                        className="w-full rounded-xl"
                        autoFocus={true}
                        placeholder={`${searchConv? 'Search for conversation' : 'Find a user'}`}/>
                        </>
                        }
                    </div>
                </div>
            {searchConv ? 
            
            <RecentConversations searchConv={search} />
            :
            <m.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.2}} exit={{opacity:0}} className="flex justify-start my-4 gap-1 flex-wrap">
                <GetUser userName={search}/>
            </m.div>
            }
            <Settings 
              setIsOpen={setOpenSettings}
              isOpen={openSettings}
              setModalSave={setModalSave}
              setModalDelete={setModalDelete}
              user={sessionData.user} 
              setUser={setUser}
              />
            </div>
        </nav>
        </>
    )
};

function GetUser({ userName }: { userName: string}) {

  const { data: matchedUsers, isLoading, isError } = api.userRouter.matchedUsers.useQuery({content: userName});

  if (isError) return <h3 className="w-full text-center mt-10">Error, pls try later</h3>

  if (isLoading) return <h3 className="w-full text-center mt-10">Loading...</h3>;

  if (matchedUsers?.length === 0) return <h3 className="w-full text-center mt-10">No users found!</h3>
  
  if (matchedUsers)
    return matchedUsers.map(user =><UserPanel  key={user.id} user={user}/>
  )
  
}


function RecentConversations({searchConv} : {searchConv: string}) {

  const matchConversations = api.conversation.matchConversation.useQuery({userInConv: searchConv});
  const conversations = api.conversation.infiniteConversations.useInfiniteQuery(
    {}, 
    {getNextPageParam: (lastScrollPage) => lastScrollPage.nextCursor});

  const matchedConversations = searchConv.length > 0 ? matchConversations : false;

  if (conversations.data?.pages == 0)
      return <h1 className="w-full text-center mt-10">No conversations yet!</h1>
    
  return (
    <InfiniteConversationsList
      data={searchConv.length > 0 ? matchedConversations.data : conversations.data?.pages.flatMap(conversationsArr => conversationsArr.conversations)}
      isError={searchConv.length > 0 ? matchedConversations.isError : conversations.isError}
      isLoading={searchConv.length > 0 ? matchedConversations.isLoading : conversations.isLoading}
      hasMore={searchConv.length > 0 ? undefined :conversations.hasNextPage}
      fetchNewData={searchConv.length > 0 ? undefined : conversations.fetchNextPage}
    />
  )
}

