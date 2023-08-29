import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import MainImage from '../../public/DumbMessanger-3.png'
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
    <div className="w-full flex justify-center items-center">
      <div className="relative z-0">
      <Image 
        src={MainImage} 
        width={3000}
        height={1000}
        alt="main image" 
        loading="lazy" 
        placeholder="blur"
        />
        <span className="absolute  w-full h-8 -top-1 bg-gradient-to-b dark:from-indigo-900 dark:via-indigo-900 dark:to-transparent"/>
        <span className="absolute  w-full h-8 -bottom-1 bg-gradient-to-t dark:from-indigo-900 dark:via-indigo-900 dark:to-transparent"/>
        </div>
    </div>
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


