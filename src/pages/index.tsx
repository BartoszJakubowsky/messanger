import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/utils/api";
import TextArea from '../components/inputs/textArea';
import {motion as m} from 'framer-motion';
import {io} from 'socket.io-client';
import { useRouter } from "next/router";
import Image from "next/image";
import MainImage from '../../public/DumbMessanger-3.png'
export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  
  const { data: sessionData } = useSession();
  const router = useRouter();
  if (sessionData === undefined)
    return (
  <div className="absolute inset-0 flex justify-center items-center">
    Loading...
  </div>
  )

  if (!sessionData)
    return (
    <div className="flex flex-col items-center justify-center gap-4 w-full relative overflow-hidden">
      <div className="w-full relative">
      <Image 
        src={MainImage} 
        className="sm:scale-100 scale-125 w-full"  
        width={2000}
        alt="main image" 
        loading="lazy" 
        placeholder="blur"
        />
       <button
         className="absolute sm:bottom-4 -bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-10 z-[1] py-3 font-semibold text-white no-underline transition hover:bg-white/20"
         onClick={() => void signIn()}
       >
         {sessionData ? "Sign out" : "Sign in"}
       </button>
       </div>
     </div>
   )

  return (
    <>
      <div className="m-16">main page</div>
            {/* <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase /> */}
    </>
  );
}


// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call


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


