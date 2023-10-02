import { api } from "~/utils/api"
import { useRouter } from 'next/router';
import {useState, useEffect, useRef} from "react";
import InfiniteMessagesList from "~/components/ui/InfiniteMessagesList";
import { useChannel } from "@ably-labs/react-hooks";
import { useSession } from "next-auth/react";
import {IoMdSend, IoIosAttach, IoMdCloudDownload} from 'react-icons/io'
import Image from "next/image";
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import IconFile from '../../../public/icon_file.png'
import IconPDF from '../../../public/icon_pdf.png'
import IconWord from '../../../public/icon_word.png'
import IconTxt from '../../../public/icon_txt.png'

interface File {
  path: string
  preview: string
  lastModified: number
  lastModifiedDate: Date
  name: string
  size: number
  type: string
  webkitRelativePath: string
}

export default function ConversationPage() {

  const router = useRouter();
  const { id } = router.query;
  const { data: sessionData } = useSession();
  
  const [files, setFiles] = useState<File[] | []>([]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({ 
    noClick: true,
    noKeyboard: true,
    onDrop: (newFiles) => {
      console.log(newFiles);
      const oldFiles = [...files];
      const addedFiles = newFiles.map(file => Object.assign(file, {preview: URL.createObjectURL(file)}));
      const allFiles = [...oldFiles, ...addedFiles]
      setFiles(allFiles as File[]);
    }
  })

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  if (!id || Array.isArray(id))
    return 

  if (!sessionData?.user)
    void router.push('/');

  const conversationId = id;

  
    
    return (
      <div {...getRootProps()} className="w-full h-screen flex flex-col justify-end overflow-hidden">
      <input {...getInputProps()} className="absolute inset-0"/>
      {
        isDragActive && <div className="absolute z-50 inset-0 flex justify-center items-center backdrop-blur-md bg-opacity-70 bg-indigo-950">
          <div className=" w-64 h-80 border-2 border-dashed border-white rounded-r-md p-2 bg-indigo-950 bg-opacity-30">
            <IoMdCloudDownload className=" w-24 h-24 animate-bounce mt-4 mx-auto"/>
            Drag and drop file you want to share
          </div>
          </div>
      }
        <RecentMessages conversationId={conversationId}/>
        <TextArea conversationId={conversationId} files={files}/>
        </div>
    )


};


function TextArea({ conversationId, files }: { conversationId: string, files: File[] }) {
  const [text, setText] = useState('');

  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [channel] = useChannel(`conversationChanel`, () => true);
  
  const createMessage = api.conversation.createMessage.useMutation({
    onSuccess: (newMessage) => {
      channel.publish('message', newMessage);
    },
  });
  
  //bugged code, can't figure why
  // const [shiftEnter, setShiftEnter] = useState(false);
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
  <>
    {fullScreenImage && 
      <div className="fixed h-screen w-screen z-10 flex justify-center items-center backdrop-blur-md bg-opacity-70 bg-indigo-950">
        <button className="absolute top-2 right-4" onClick={()=>setFullScreenImage(null)}>x</button>
      <Image
       className=""
       src={fullScreenImage}
       width={600}
       height={600}
       quality={1000}
       alt="full screen image"
      />
      </div>
      }
    <div className="relative  bg-indigo-700 w-full flex p-2 gap-2 md:h-24 h-20 min-h-[100px] max-h-[100px] items-stretch self-end">
    {files.length > 0 &&  
    <div className="absolute flex gap-2 bg-indigo-700 -top-28 left-0 border-indigo-950 border-b-2 border-opacity-30 h-28 w-full p-1  pl-2 overflow-x-auto overflow-y-hidden ">
    {files.map((file, index) => 
    {
    
    const fileIcon = () =>
    {
      const splittedText = file.path.split('.');
      const fileExtension = splittedText[splittedText.length - 1];
      switch (fileExtension) {
        case 'pdf':
          return IconPDF;
        case 'docx':
          return IconWord;
        case 'txt':
          return IconTxt;
        case 'jpg':
        case 'png':
        case 'svg':
        case 'gif':
        case 'webp':
          return file.preview
        default:
          return IconFile
      }
    }
    
    const handleImageClick = (src: string) => {
      setFullScreenImage(src);
    }
    return (
    <div className="max-w-[80px] min-w-[80px] bg-indigo-800 rounded-md overflow-hidden cursor-pointer" key={index} onClick={() => handleImageClick(file.preview)}>
        <div className="relative w-[75%] h-[55%] overflow-hidden rounded-md  p-1 m-auto" >
        <Image
          className="rounded-md"
          src={fileIcon()}
          alt="file image"
          fill
          // Revoke data uri after image is loaded
          // onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
        </div>
        <h3 className="text-sm hover:-translate-y-[70%] ease-in-out transition-transform duration-1000 p-1 bg-indigo-800 z-[2]">
          {file.name}
        </h3>
    </div>
    )
  })}
  </div>
  }
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
        <IoMdSend className="m-auto"/>
      </button>
       {/* <IoIosAttach className="m-auto"/> */}
        
    </div>
    </>
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



