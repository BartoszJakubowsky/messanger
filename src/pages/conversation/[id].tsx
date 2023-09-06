import { api } from "~/utils/api"
import { useRouter } from 'next/router';
import {useState } from "react";
import InfiniteMessagesList from "~/components/ui/InfiniteMessagesList";

import { useChannel } from "@ably-labs/react-hooks";

export default function ConversationPage() {

  const router = useRouter();
  const { id } = router.query;
 

  if (!id || Array.isArray(id))
    return;
  const conversationId = id;
    
    return (
        <div className="w-full h-screen flex flex-col justify-end overflow-hidden">
        <RecentMessages conversationId={conversationId}/>
        <TextArea conversationId={conversationId}/>
        </div>
    )


};


function TextArea({conversationId}: {conversationId: string}) {
  
  const [text, setText] = useState('');

   const [channel] = useChannel(`conversationChanel`, () => true)

  const createMessage = api.conversation.createMessage.useMutation({
    onSuccess: (newMessage) => {
      channel.publish('message', newMessage);
    }
  })

  const handleSubmit = (e :  React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (text.length == 0) return
    
    createMessage.mutate({conversationId, content: text});
    setText('');
  }

  return (
    <div className="bg-pink-500 dark:bg-indigo-700 w-full flex p-2 gap-2 md:h-24 h-10 min-h-[100px] max-h-[100px] items-stretch self-end">
    <textarea 
    value={text}
    onChange={(e) => setText(e.target.value)}
    className="w-full  dark:bg-indigo-400 bg-red-200 dark:focus:bg-indigo-300 focus-within:bg-red-100  transition-all duration-200 text-black outline-none p-2 resize-none rounded" />
    <button 
    onClick={handleSubmit}
    className="bg-indigo-950 p-2 rounded-sm self-start">
      Send
    </button>
  </div>
  )
}



  function RecentMessages({conversationId}: {conversationId: string}) {

    const messages = api.conversation.infiniteMessage.useInfiniteQuery(
        {conversationId},
        {getNextPageParam: (lastScrollPage) => {
          if (Array.isArray(lastScrollPage))
            return undefined;
          else
            return lastScrollPage.nextCursor;
        }});
    
    if (messages.data?.pages.length == 0)
        return <h1 className="w-full text-center mb-auto mt-auto">No messages yet!</h1>
    
      const messagesData = messages.data?.pages.flatMap((arrOfMessagesArr) =>
      Array.isArray(arrOfMessagesArr)
        ? []
        : arrOfMessagesArr.messages.map((message) => ({
            ...message,
            children: message.content, 
          }))
      );
    return (
      <InfiniteMessagesList
        data={messagesData}
        isError={messages.isError}
        isLoading={messages.isLoading}
        hasMore={messages.hasNextPage}
        fetchNewData={messages.fetchNextPage}
        noData={'No conversations'}
      />
    );
  }



