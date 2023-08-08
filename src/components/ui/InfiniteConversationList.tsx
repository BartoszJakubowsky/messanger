import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import type {ReactNode} from 'react';
import Image from "next/image";
import {motion as m, AnimatePresence} from 'framer-motion';


interface ConversationProps {
  content: string;
  createdAt: Date;
  user: { id: string; image: string | null; name: string | null };
  children: ReactNode;
}

interface InfiniteTweetListProps {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewData: () => Promise<unknown>;
  data?: ConversationProps[];
  noData? : string;
}

export default function InfiniteTweetList({
  data,
  isError,
  isLoading,
  fetchNewData,
  hasMore,
  noData,
}: InfiniteTweetListProps) {
  if (isLoading) return <h1>Loading...</h1>;

  if (isError) return <h1>Error</h1>;

  if (data == null) return null;

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
      {data.map((dataToRender) => {
        return (
          <ConversationCard key={dataToRender.id} {...dataToRender}>
            {dataToRender.content}
          </ConversationCard>
        );
      })}
    </InfiniteScroll>
  );
}


function ConversationCard() {
  const user = {
    name: 'Some name',
    image: '',
    latest: 'siem a siema siema siema siema siema a siema siema siema siema siemaa siema siema siema siema siema siema siema siema siema siema siema siema',
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };

  return (
    <m.div 
    initial={{opacity:0}} 
    animate={{opacity:1}} 
    transition={{duration: 0.2}} 
    exit={{opacity:0}} 
    className="flex-row h-20 justify-stretch items-center gap-2 p-1 overflow-hidden bg-pink-300 dark:bg-indigo-900 rounded-md cursor-pointer flex">
      <div className="rounded-full bg-yellow-200 w-20 h-16">{user.image}</div>
      <div className="flex flex-col">
        <h3 className="w-full text-lg">{user.name}</h3>
        {user.latest && <p className="text-gray-400">{truncateText(user.latest, 50)}</p>}
      </div>
    </m.div>
  );
}





