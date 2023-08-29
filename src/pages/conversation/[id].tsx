import { api } from "~/utils/api"
import { useRouter } from 'next/router';
import {useEffect, useState } from "react";
import {motion as m} from 'framer-motion';
import InfiniteMessagesList from "~/components/ui/InfiniteMessagesList";
export default function ConversationPage() {

  const router = useRouter();
  const { id } = router.query;

    if (typeof id != 'string') 
      return <h3>{"Loading [id] page ..."}</h3>        

    const {data: conversation, isError, isLoading} = api.conversation.getConversation.useQuery({conversation: id})

    if (isLoading)
        return <h3>Loading conversation...</h3>

    if (isError)
        return <h3>Conversation error</h3>

   
    return (
        <div className="w-full h-screen flex flex-col justify-end">
        <RecentMessages conversationId={conversation.id}/>
        <TextArea conversationId={conversation.id}/>
        </div>
    )


};


function TextArea({conversationId}: {conversationId: string}) {
  
  const [text, setText] = useState('');
  const [error, setError] = useState(false);
  const createMessage = api.conversation.createMessage.useMutation({
    onSuccess: (newMessage) => {
      console.log(newMessage);
      setText('');
    }
  })
  const handleSubmit = () => createMessage.mutate({conversationId, content: text});

  return (
    <div className="bg-pink-500 dark:bg-indigo-700 w-full flex p-2 gap-2 md:h-24 h-10 max-h-[100px] items-stretch self-end">
    <textarea 
    value={text}
    onChange={(e) => setText(e.target.value)}
    className="w-full dark:bg-indigo-400 bg-red-200 dark:focus:bg-indigo-300 focus-within:bg-red-100  transition-all duration-200 text-black outline-none p-2 resize-none rounded" />
    <button 
    onClick={handleSubmit}
    className="bg-indigo-950 p-2 rounded-sm self-start">
      Send
    </button>
  </div>
  )
}



  function RecentMessages({conversationId}: {conversationId: string}) {

  const [message, setMessage] = useState('');

    const messages = api.conversation.infiniteMessage.useInfiniteQuery(
        {conversationId},
        {getNextPageParam: (lastScrollPage) => lastScrollPage.nextCursor});

    if (messages.data?.pages == 0)
        return <h1 className="w-full text-center">No messages yet!</h1>
      console.log(messages.data?.pages);
    return (
      <InfiniteMessagesList
        data={messages.data?.pages.flatMap(arrOfMessagesArr => arrOfMessagesArr.messages)}
        isError={messages.isError}
        isLoading={messages.isLoading}
        hasMore={messages.hasNextPage}
        fetchNewData={messages.fetchNextPage}
        noData={'No conversations'}
      />
    );
  }



