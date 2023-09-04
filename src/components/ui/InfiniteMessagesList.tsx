import InfiniteScroll from "react-infinite-scroll-component";
import { useSession } from "next-auth/react";
import type {ReactNode} from 'react';
import {motion as m} from 'framer-motion';


interface MessagesProps {
  id: string
  content: string;
  createdAt: Date;
  userId: string;
  children: ReactNode;
}

interface InfiniteMessagesListProps {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewData: () => Promise<unknown>;
  data?: MessagesProps[];
  noData? : string;
  ablyMessages: MessagesProps[]
}

export default function InfiniteMessagesList({
  data,
  isError,
  isLoading,
  fetchNewData,
  hasMore,
  noData,
  ablyMessages
}: InfiniteMessagesListProps) {

  if (isLoading) return <h1>Loading...</h1>;

  if (isError) return <h1>Error</h1>;


  if (data == null || data.length == 0) {
    return (
      <h2 className="my-4 text-2xl text-gray-500">{noData}</h2>
    );
  }

  if (ablyMessages)
  {
    if (!data.some(message => message.id == ablyMessages.id))
      data = [ablyMessages, ...data]

  }
    

  return (
    <div id="scrollableDiv" 
    style={{
      height: '100vh',
      overflow: 'auto',
      display: "flex",
      flexDirection: "column-reverse"
    }}
    >
    <InfiniteScroll
      dataLength={data.length}
      next={fetchNewData}
      inverse={true}
      hasMore={hasMore ?? false}
      style={{ display: "flex", flexDirection: "column-reverse" }}
      loader={"Loading ..."}
      scrollableTarget="scrollableDiv"
    >
      {data.map((dataToRender, index) => {
        return (
          <Message 
          key={dataToRender.id} 
          userId={dataToRender.userId} 
          content={dataToRender.content} 
          index={index}/>
        );
      })}
    </InfiniteScroll>
    </div>
  );
}






function Message ({userId, content, index}: {userId: string, content: string, index: number}) {

    const currentUser = useSession();
    const currentUserId = currentUser.data?.user.id;
    return (
      <m.div 
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: index *0.05}}
      className={`${currentUserId === userId? 'justify-end' : 'justify-start'} w-full h-fit flex p-4`}>
        <p className={`max-w-[40%] w-[250px] bg-pink-700 dark:bg-indigo-700 p-2 rounded-lg ${currentUserId === userId? ' rounded-br-none' : ' rounded-bl-none'}`}>
        {content}
        </p>
      </m.div>
    )
  }