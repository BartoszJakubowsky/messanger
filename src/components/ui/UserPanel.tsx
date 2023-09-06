import {motion as m} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import {useEffect} from 'react';

interface UserProps {
    user: {
      id: string
      name: string;
      email: string ;
      image: string ;
      description: string ;
    },
}
export default function ConversationUser({user} : UserProps) {

    const router = useRouter()

    const {refetch} = api.conversation.getConversation.useQuery({convUserId: user.id}, {enabled: false})
      
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) {
          return text;
        }
        return text.slice(0, maxLength) + '...';
      };
    
    const handleClick = () => {
      void refetch().then(res => {

          const convId = res.data;
          void router.push(`/conversation/${convId}`)
      });
    }
    return (
        <m.button
        initial={{opacity:0}} 
        animate={{opacity:1}} 
        transition={{duration: 0.2}} 
        exit={{opacity:0}} 
        onClick={handleClick}
        className="flex-row w-full h-20 justify-stretch items-center gap-2 p-1 overflow-hidden bg-pink-300 dark:bg-indigo-900 rounded-md cursor-pointer flex">
          {user?.image && <Image className="rounded-full w-16 h-16" src={user.image}  width={1000} height={800} alt='user image'/>}
          <div className="flex flex-col">
            <h3 className="w-full text-lg text-start">{user.name}</h3>
            {<p className="text-gray-400 text-start">{truncateText(user?.description, 50)}</p>}
          </div>
        </m.button>
    )
};
