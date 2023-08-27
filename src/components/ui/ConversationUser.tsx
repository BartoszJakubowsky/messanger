import {motion as m} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
interface UserProps {
    user: {
      id: string,
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      image: string;
    },
    conversation?: string,
}
export default function ConversationUser({user, conversation} : UserProps) {
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) {
          return text;
        }
        return text.slice(0, maxLength) + '...';
      };

    return (
      <Link href={`/conversation/${user.id}`}>
        <m.div 
        initial={{opacity:0}} 
        animate={{opacity:1}} 
        transition={{duration: 0.2}} 
        exit={{opacity:0}} 
        className="flex-row h-20 justify-stretch items-center gap-2 p-1 overflow-hidden bg-pink-300 dark:bg-indigo-900 rounded-md cursor-pointer flex">
          <Image className="rounded-full w-16 h-16" src={user.image}  width={1000} height={800} alt='user image'/>
          <div className="flex flex-col">
            <h3 className="w-full text-lg">{user.name}</h3>
            {conversation && <p className="text-gray-400">{truncateText(conversation, 50)}</p>}
          </div>
        </m.div>
      </Link>
    )
};
