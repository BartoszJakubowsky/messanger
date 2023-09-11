import InfiniteScroll from "react-infinite-scroll-component";
import {motion as m} from 'framer-motion';
import Image from "next/image";
import { useRouter } from "next/router";
interface UserProps {
      id: string,
      name: string | null;
      image: string;
}

interface ConversationsProps {
 id: string, 
 lastMessage?: {content: string, user: UserProps},
 createdAt?: string,
 participants: UserProps[];
 closeSidebar : ()=> void;
} 

interface InfiniteConversationsListProps {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewData: () => Promise<unknown>;
  data?: ConversationsProps[];
  closeSidebar : ()=> void;
}

export default function InfiniteConversationsList({
  data,
  isError,
  isLoading,
  fetchNewData,
  hasMore,
  closeSidebar
}: InfiniteConversationsListProps) {


  if (isLoading) return <h1>Loading...</h1>;

  if (isError) return <h1>Error</h1>;

  if (data == null || data.length == 0) {
    return (
      <h2 className="my-4 text-2xl text-center">No conversations found!</h2>
    );
  }


  return (
    <div id="scrollableDiv" 
    style={{
      height: '100%',
      overflow: 'auto',
      display: "flex",
      flexDirection: 'column'
    }}
    className="no-scrollbar"
    >
    <InfiniteScroll
      dataLength={data.length}
      next={fetchNewData}
      hasMore={hasMore ?? false}
      loader={"Loading ..."}
      className="mt-2 flex flex-wrap gap-2"
      scrollableTarget="scrollableDiv"
    >
      {data.map((dataToRender) => {
        if (dataToRender.participants.length == 0)
          return 
        
        return (
          <ConversationPanel
            key={dataToRender.id}
            id={dataToRender.id}
            lastMessage={dataToRender.lastMessage}
            participants={dataToRender.participants}
            closeSidebar={closeSidebar}
          />
        );
      })}
    </InfiniteScroll>
    </div>
  );
}



function ConversationPanel ({id: conversationId, lastMessage, participants, closeSidebar} : ConversationsProps) {

   const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) {
          return text;
        }
        return text.slice(0, maxLength) + '...';
      };
    const router = useRouter();

    const onClick = () => {
      closeSidebar();
      void router.push(`/conversation/${conversationId}`);
    }
    return (
      <button onClick={onClick} className="w-full">
        <m.div 
        initial={{opacity:0}} 
        animate={{opacity:1}} 
        transition={{duration: 0.2}}  
        exit={{opacity:0}} 
        className="flex-col w-full h-20 p-2 justify-stretch items-start gap-1 overflow-hidden  dark:bg-indigo-900 rounded-md cursor-pointer flex">
          <div className="p-1 h-8 overflow-hidden flex gap-2">
            {participants.map((user, index) => {
              //if max users to show
              if (index == 2)
              return (
                <p>
                  And {`${participants.length - index}`} more users...
                </p>
              )
              return (
                <div key={user.id} className="flex min-w-fit gap-2 overflow-hidden items-center">
                  <Image className="rounded-full w-6 h-6" src={user.image}  width={300} height={300} alt='user image'/>
                  <h1>{user.name}</h1>
                </div>
              )
            })}
           
          </div>
          {lastMessage && <div className="w-full flex gap-1 ml-2 text-sm opacity-80">
            <p>{lastMessage.user.name} :</p>
            <p>{truncateText(lastMessage.content, 26)}</p>
          </div>}
        </m.div>
      </button>
    )
}


