import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/utils/api";
import TextArea from '../components/inputs/textArea';
import {motion as m} from 'framer-motion';

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  

  const messages = [
    {author: true, content: '11111111111111 111111111111111111 111111111111111111111111 111111111111111111111111'},
    {author: false, content: 'elo321 elo321elo321elo321elo321 elo321 elo321 elo321elo321elo321elo321 elo321elo321'},
    {author: true, content: 'elo321 elo321elo321elo321elo321 elo321 elo321 elo321elo321elo321elo321 elo321elo321'},
    {author: true, content: 'elo321 elo321elo321elo321elo321 elo321 elo321 elo321elo321elo321elo321 elo321elo321'},
    {author: false, content: 'elo321 elo321elo321elo321elo321 elo321 elo321 elo321elo321elo321elo321 elo321elo321'},
    {author: true, content: '2222222222 2222222222222222222 222222222222222222222 222222222222222222 22222222'}
  ]

  const reversedMessages = messages.reverse();
  console.log(reversedMessages);
  return (
    <>
      <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c] w-full flex flex-col justify-end flex-wrap">

      {messages.map((message, index) => {
        return <Message key={index} author={message.author} content={message.content} index={index}/>
      })}


      <div className="bg-red-200 w-full flex p-2 gap-2 md:h-24 h-10 items-start">
        <textarea className="w-full bg-white resize-none rounded" />
        <button className="bg-gray-800">
          send
        </button>
      </div>







            {/* <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase /> */}
    </div>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}


function Message ({author, content, index}: {author: boolean, content: string, index: number}) {


  return (
    <m.div 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{delay: index *0.2}}
    className={`${author? 'justify-start' : 'justify-end'} w-full h-fit flex p-2`}>
      <p className="w-1/3">
      {content}
      </p>
    </m.div>
  )
}