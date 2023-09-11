import { api } from "~/utils/api"
import { useRouter } from 'next/router';
import {useState, useEffect, useRef} from "react";
import InfiniteMessagesList from "~/components/ui/InfiniteMessagesList";
import { useChannel } from "@ably-labs/react-hooks";
import { useSession } from "next-auth/react";

export default function ConversationPage() {

  const router = useRouter();
  const { id } = router.query;
  const { data: sessionData } = useSession();

  if (!id || Array.isArray(id))
    return 

  
  if (!sessionData?.user)
    void router.push('/');

  const conversationId = id;
    
    return (
        <div className="w-full h-screen flex flex-col justify-end overflow-hidden">
        <RecentMessages conversationId={conversationId}/>
        <TextArea conversationId={conversationId}/>
        </div>
    )


};


function TextArea({ conversationId }: { conversationId: string }) {
  const [text, setText] = useState('');
  // const [shiftEnter, setShiftEnter] = useState(false);
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [channel] = useChannel(`conversationChanel`, () => true);

  const createMessage = api.conversation.createMessage.useMutation({
    onSuccess: (newMessage) => {
      channel.publish('message', newMessage);
    },
  });

  // useEffect(() => {
  //   const enterKeyListener = (e: KeyboardEvent) => {
  //     if (e.key === 'Enter' && e.shiftKey) {
  //       setShiftEnter(true);
  //     } else if (e.key === 'Enter' && !shiftEnter) {
  //       console.log('?');
  //       handleSubmit();
  //     } else if (e.key === 'Enter' && shiftEnter) {
  //       if (!text.includes('\n')) {
  //         setShiftEnter(false);
  //         handleSubmit();
  //       }
  //     }
  //   };

  //   document.addEventListener('keydown', enterKeyListener);
  //   return () => document.removeEventListener('keydown', enterKeyListener);
  // }, [text, shiftEnter]);

  const handleSubmit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (text.length === 0 || text.trim().length === 0) return;

    createMessage.mutate({ conversationId, content: text });
    
    setText('');
    if (textRef.current)
    {
      textRef.current.selectionStart= 0;
      textRef.current.selectionEnd= 0;
    }

  };

  return (
    <div className="bg-pink-500 dark:bg-indigo-700 w-full flex p-2 gap-2 md:h-24 h-10 min-h-[100px] max-h-[100px] items-stretch self-end">
      <textarea
        ref={textRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full lg:w-[60%]  lg:ml-auto dark:bg-indigo-400 bg-red-200 dark:focus:bg-indigo-300 focus-within:bg-red-100 transition-all duration-200 text-black outline-none p-2 resize-none rounded"
      />
      <button
        onClick={handleSubmit}
        className="bg-indigo-950 p-2 rounded-sm self-start lg:mr-auto"
      >
        Send
      </button>
    </div>
  );
}




  function RecentMessages({conversationId}: {conversationId: string}) {

    const messages = api.conversation.infiniteMessage.useInfiniteQuery(
        {conversationId},
        {getNextPageParam: (lastScrollPage) => {
          if (Array.isArray(lastScrollPage)  || !lastScrollPage)
            return null;
          else
            return lastScrollPage.nextCursor;
        }});
    
    
    
      const messagesData = messages.data?.pages.flatMap((arrOfMessagesArr) =>
      Array.isArray(arrOfMessagesArr) || !arrOfMessagesArr
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
      />
    );
  }



