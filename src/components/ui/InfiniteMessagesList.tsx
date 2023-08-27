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
}

export default function InfiniteMessagesList({
  data,
  isError,
  isLoading,
  fetchNewData,
  hasMore,
  noData,
}: InfiniteMessagesListProps) {

  if (isLoading) return <h1>Loading...</h1>;

  if (isError) return <h1>Error</h1>;


  if (data == null || data.length == 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">{noData}</h2>
    );
  }


  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchNewData}
      hasMore={hasMore ?? false}
      loader={"Loading ..."}
    >
      {data.map((dataToRender, index) => {
        return (
          <Message 
          key={dataToRender.id} 
          userId={dataToRender.userId} 
          content={dataToRender.content} 
          index={index}/>
        );
      }).reverse()}
    </InfiniteScroll>
  );
}






function Message ({userId, content, index}: {userId: string, content: string, index: number}) {

    const currentUser = useSession();
    return (
      <m.div 
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: index *0.2}}
      className={`${currentUser.data?.user.id === userId? 'justify-start' : 'justify-end'} w-full h-fit flex p-4`}>
        <p className="max-w-[40%] w-[250px] bg-pink-700 dark:bg-indigo-700 p-2 rounded-md">
        {content}
        </p>
      </m.div>
    )
  }