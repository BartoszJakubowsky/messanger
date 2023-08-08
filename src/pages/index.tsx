import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/utils/api";
import TextArea from '../components/inputs/textArea';
import {motion as m} from 'framer-motion';

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  
  const { data: sessionData } = useSession();

  if (sessionData === undefined)
    return (
  <div className="absolute inset-0 flex justify-center items-center">
    Loading...
  </div>
  )


  if (!sessionData)
    return (
<div className="flex flex-col items-center justify-center gap-4 w-full">
       <button
         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
         onClick={sessionData ? () => void signOut() : () => void signIn()}
       >
         {sessionData ? "Sign out" : "Sign in"}
       </button>
     </div>
   )

  const messages = [
    {author: true, content: '11111111111111 111111111111111111 111111111111111111111111 111111111111111111111111'},
    {author: false, content: 'elo321 elo321elo321elo321elo321 elo321 elo321 elo321elo321elo321elo321 elo321elo321'},
    {author: true, content: 'elo321 elo321elo321elo321elo321 elo321 elo321 elo321elo321elo321elo321 elo321elo321'},
    {author: true, content: 'elo321 elo321elo321elo321elo321 elo321 elo321 elo321elo321elo321elo321 elo321elo321'},
    {author: false, content: 'elo321 elo321elo321elo321elo321 elo321 elo321 elo321elo321elo321elo321 elo321elo321'},
    {author: true, content: '2222222222 2222222222222222222 222222222222222222222 222222222222222222 22222222'}
  ]

  const reversedMessages = messages.reverse();
  return (
    <>
      <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c] w-full flex flex-row justify-end flex-wrap">

      {messages.map((message, index) => {
        return <Message key={index} author={message.author} content={message.content} index={index}/>
      })}


      <div className="bg-pink-500 dark:bg-indigo-700 w-full flex p-2 gap-2 md:h-24 h-10 max-h-[100px] items-stretch">
        <textarea className="w-full dark:bg-indigo-400 bg-red-200 dark:focus:bg-indigo-300 focus-within:bg-red-100  transition-all duration-200 text-black outline-none p-2 resize-none rounded" />
        <button className="bg-indigo-950 p-2 rounded-sm self-start">
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

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }


function Message ({author, content, index}: {author: boolean, content: string, index: number}) {


  return (
    <m.div 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{delay: index *0.2}}
    className={`${author? 'justify-start' : 'justify-end'} w-full h-fit flex p-4`}>
      <p className="max-w-[40%] w-[250px] bg-pink-700 dark:bg-indigo-700 p-2 rounded-md">
      {content}
      </p>
    </m.div>
  )
}