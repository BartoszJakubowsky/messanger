import { api } from "~/utils/api"
import { useRouter } from 'next/router';
import {useState } from "react";
import InfiniteMessagesList from "~/components/ui/InfiniteMessagesList";

// import { useChannel } from "../../components/ably/AblyReactEffect";
import { useChannel } from "@ably-labs/react-hooks";
import { Types } from "ably";
import { useSession } from "next-auth/react";
// import dynamic from 'next/dynamic'
// const AblyTextArea = dynamic(() => import('../../'), { ssr: false });

interface Message { 
  userId: string, 
  content: string,
  conversationId: string
}
export default function ConversationPage() {

  const router = useRouter();
  const { id } = router.query;
  const [ablyMessage, setAblyMessage] = useState<Message>();

  // const [channel, ably] = useChannel(`${id}`, (message) => {

  //   console.log('abbly works', message);
  //   setAblyMessages((prevMessages) => [message.data, ...prevMessages]);
  // })
  const [channel] = useChannel(`conversationChanel`, async (message: Types.Message) => {

    message.data.id = message.id;
    console.log('abbly works', message);
    setAblyMessage(message.data);
  })

  if (!id || Array.isArray(id))
    return;
  const conversationId = id;
    
    return (
        <div className="w-full h-screen flex flex-col justify-end overflow-hidden">
        <RecentMessages conversationId={conversationId} ablyMessages={ablyMessage}/>
        <TextArea conversationId={conversationId} channel={channel}/>
        </div>
    )


};


function TextArea({conversationId, channel}: {conversationId: string, channel: Types.RealtimePromise | Types.RealtimeChannelPromise}) {
  
  const [text, setText] = useState('');
  const [error, setError] = useState(false);
  const { data: sessionData } = useSession();

  const createMessage = api.conversation.createMessage.useMutation({
    onSuccess: (newMessage) => {
      setText('');
    }
  })

  const handleSubmit = (e : Event) => {
    e.preventDefault();

    if (text.length == 0)
      return
    
    const userId = sessionData?.user.id;
    
    channel.publish('message', {
      userId,
      content : text,
      conversationId
    });
    createMessage.mutate({conversationId, content: text});
  }

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



  function RecentMessages({conversationId, ablyMessages}: {conversationId: string, ablyMessages: Message[]}) {

    const messages = api.conversation.infiniteMessage.useInfiniteQuery(
        {conversationId},
        {getNextPageParam: (lastScrollPage) => lastScrollPage.nextCursor});
    
    if (messages.data?.pages == 0)
        return <h1 className="w-full text-center mb-auto mt-auto">No messages yet!</h1>

    return (
      <InfiniteMessagesList
        data={messages.data?.pages.flatMap(arrOfMessagesArr => arrOfMessagesArr.messages)}
        isError={messages.isError}
        isLoading={messages.isLoading}
        hasMore={messages.hasNextPage}
        fetchNewData={messages.fetchNextPage}
        ablyMessages={ablyMessages}
        noData={'No conversations'}
      />
    );
  }



