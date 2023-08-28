import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import {motion as m} from 'framer-motion';
import Image from "next/image";
interface UserProps {
      id: string,
      name: string | null;
      image: string ;
}

interface ConversationsProps {
 conversationId: string, 
 lastMessage: {content: string, user: UserProps},
 createdAt?: string,
 participants: UserProps[];
}

interface InfiniteConversationsListProps {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewData: () => Promise<unknown>;
  data?: ConversationsProps[];
}

export default function InfiniteConversationsList({
  data,
  isError,
  isLoading,
  fetchNewData,
  hasMore,
}: InfiniteConversationsListProps) {

  if (isLoading) return <h1>Loading...</h1>;

  if (isError) return <h1>Error</h1>;

  if (data == null || data.length == 0) {
    return (
      <h2 className="my-4 text-start text-2xl text-gray-500">no data</h2>
    );
  }


  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchNewData}
      hasMore={hasMore ?? false}
      loader={"Loading ..."}
    >
        <p>cos tam cos tam</p>
      {data.map((dataToRender, index) => {

        // const truncateUsers = (text: string, maxLength: number) => {
        //     if (text.length <= maxLength) {
        //     return text;
        //     }
        //     return text.slice(0, maxLength) + '...';
        // };
        return (
          <ConversationPanel
            key={dataToRender.conversationId}
            conversationId={dataToRender.conversationId}
            lastMessage={dataToRender.lastMessage}
            participants={dataToRender.participants}
          />
        );
      })}
    </InfiniteScroll>
  );
}



function ConversationPanel ({conversationId, lastMessage, createdAt, participants} : ConversationsProps) {

   const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) {
          return text;
        }
        return text.slice(0, maxLength) + '...';
      };
    return (
      <Link href={`/conversation/${conversationId}`} className="w-full">
        <m.div 
        initial={{opacity:0}} 
        animate={{opacity:1}} 
        transition={{duration: 0.2}}  
        exit={{opacity:0}} 
        className="flex-col w-full h-20 p-2 justify-stretch items-start gap-1 overflow-hidden bg-pink-300 dark:bg-indigo-900 rounded-md cursor-pointer flex">
          <div className="w-full p-1 flex gap-2">
            {participants.map((user, index) => {
              //if max users to show
              if (index == 2)
              return (
                <p>
                  And {`${participants.length - index}`} more users...
                </p>
              )
              return (
                <div key={user.id} className="flex gap-2 overflow-hidden items-center">
                  <Image className="rounded-full w-6 h-6" src={user.image}  width={300} height={300} alt='user image'/>
                  <h1>{user.name}</h1>
                </div>
              )
            })}
           
          </div>
          <div className="w-full flex gap-1 ml-2 text-sm opacity-80">
            <p>{lastMessage.user.name} :</p>
            <p>{truncateText(lastMessage.content, 32)}</p>
          </div>
        </m.div>
      </Link>
    )
}


