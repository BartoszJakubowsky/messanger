import { api } from "~/utils/api";
import { useState, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useChannel } from "@ably-labs/react-hooks";
import Image from "next/image";
import type { File } from "~/types/FileInterface";
import IconFile from "../../../public/icon_file.png";
import IconPDF from "../../../public/icon_pdf.png";
import IconWord from "../../../public/icon_word.png";
import IconTxt from "../../../public/icon_txt.png";
import { IoMdSend, IoMdClose, IoMdAttach } from "react-icons/io";
import FilePreview from "./filePreview";
export default function TextArea({
  conversationId,
  files,
  setFiles,
  openDialog,
}: {
  conversationId: string;
  files: File[];
  setFiles: Dispatch<SetStateAction<[] | File[]>>;
  openDialog: () => void;
}) {
  const [text, setText] = useState("");

  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [channel] = useChannel(`conversationChanel`, () => true);

  const createMessage = api.conversation.createMessage.useMutation({
    onSuccess: (newMessage) => {
      channel.publish("message", newMessage);
    },
  });
  /*
  bugged code, can't figure why
  const [shiftEnter, setShiftEnter] = useState(false);
  useEffect(() => {
    const enterKeyListener = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.shiftKey) {
        setShiftEnter(true);
      } else if (e.key === 'Enter' && !shiftEnter) {
        console.log('?');
        handleSubmit();
      } else if (e.key === 'Enter' && shiftEnter) {
        if (!text.includes('\n')) {
          setShiftEnter(false);
          handleSubmit();
        }
      }
    };

    document.addEventListener('keydown', enterKeyListener);
    return () => document.removeEventListener('keydown', enterKeyListener);
  }, [text, shiftEnter]);
*/
  const handleSubmit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (text.length === 0 || text.trim().length === 0) return;

    createMessage.mutate({ conversationId, content: text });

    setText("");
    if (textRef.current) {
      textRef.current.selectionStart = 0;
      textRef.current.selectionEnd = 0;
    }
  };

  return (
    <>
      {fullScreenImage && (
        <div className="fixed z-10 flex h-screen w-screen items-center justify-center bg-indigo-950 bg-opacity-70 backdrop-blur-md">
          <div className="absolute">
            <Image
              className=""
              src={fullScreenImage}
              width={600}
              height={600}
              quality={1000}
              alt="full screen image"
            />
            <IoMdClose
              onClick={() => setFullScreenImage(null)}
              className="absolute right-4 top-2 cursor-pointer hover:scale-110"
            />
          </div>
        </div>
      )}
      <div className="relative  mt-1 flex w-full flex-wrap items-stretch gap-2 self-end bg-indigo-700 p-2">
        <FilePreview
          files={files}
          setFiles={setFiles}
          setFullScreenImage={setFullScreenImage}
        />
        <div className="flex w-full flex-nowrap">
          <textarea
            ref={textRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mx-2 max-h-[80px] min-h-[80px] w-full resize-none rounded p-2 text-black outline-none transition-all duration-200 dark:bg-indigo-400 dark:focus:bg-indigo-300 lg:ml-auto lg:w-[60%]"
          />
          <div className="flex flex-wrap lg:mr-auto">
            <button
              onClick={handleSubmit}
              className="w-full self-start rounded-sm bg-indigo-950 p-2"
            >
              <IoMdSend className="m-auto" />
            </button>
            <button
              onClick={openDialog}
              className="w-full self-start rounded-sm bg-indigo-950 p-2"
            >
              <IoMdAttach className="m-auto" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
