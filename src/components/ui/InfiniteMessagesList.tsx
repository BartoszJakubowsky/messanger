import InfiniteScroll from "react-infinite-scroll-component";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { motion as m } from "framer-motion";
import { useChannel } from "@ably-labs/react-hooks";
import type { Types } from "ably";
interface MessagesProps {
  id: string;
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
}

export default function InfiniteMessagesList({
  data,
  isError,
  isLoading,
  fetchNewData,
  hasMore,
}: InfiniteMessagesListProps) {
  const [websocketMessage, setWebsocketMessage] =
    useState<MessagesProps | null>(null);
  const [dataToRender, setDataToRender] = useState<MessagesProps[] | undefined>(
    data
  );

  const [channel] = useChannel(
    `conversationChanel`,
    (message: Types.Message) => {
      if (message.data) setWebsocketMessage(message.data as MessagesProps);
    }
  );
  const newMessage = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (newMessage?.current && websocketMessage)
      newMessage.current.scrollIntoView({ behavior: "auto" });
  }, [websocketMessage]);

  useEffect(() => {
    setDataToRender(data);
  }, [data]);

  useEffect(() => {
    if (dataToRender && websocketMessage)
      setDataToRender([websocketMessage, ...dataToRender]);
  }, [websocketMessage]);

  if (isLoading) return <h1 className="m-auto">Loading...</h1>;

  if (isError) return <h1 className="m-auto">Error</h1>;

  if (dataToRender == null || dataToRender.length == 0)
    return <h1 className="m-auto">{"No messages yet!"}</h1>;

  return (
    <div
      id="scrollableDiv"
      style={{
        height: "100vh",
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      <InfiniteScroll
        dataLength={dataToRender.length}
        next={fetchNewData}
        inverse={true}
        hasMore={hasMore ?? false}
        style={{ display: "flex", flexDirection: "column-reverse" }}
        loader={"Loading ..."}
        scrollableTarget="scrollableDiv"
      >
        {/* empty div to enable scroll after received message */}
        <div ref={newMessage}></div>
        {dataToRender?.map((message, index) => {
          return (
            <Message
              key={message.id}
              userId={message.userId}
              content={message.content}
              index={index}
              initial={index == 0 && false}
            />
          );
        })}
        {/* empty div to enable scroll at the bottom when new message arrive */}
      </InfiniteScroll>
    </div>
  );
}

function Message({
  userId,
  content,
  index,
  initial = true,
}: {
  userId: string;
  content: string;
  index?: number;
  initial?: boolean;
}) {
  const currentUser = useSession();
  const currentUserId = currentUser.data?.user.id;
  return (
    <m.div
      // initial makes illusion last message wasn't rerender during refetch data from prisma
      initial={initial && { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index ? index * 0.05 : 0 }}
      className={`${
        currentUserId === userId ? "justify-end " : "justify-start"
      } m-1 mx-4 flex h-fit`}
    >
      <p
        className={`w-fit max-w-[60%] whitespace-pre-wrap break-words rounded-lg bg-pink-700 p-2 dark:bg-indigo-700 ${
          currentUserId === userId
            ? " rounded-br-none lg:mr-[20%] xl:mr-[25%]"
            : " rounded-bl-none lg:ml-[20%] xl:ml-[25%]"
        }`}
      >
        {content}
      </p>
    </m.div>
  );
}
