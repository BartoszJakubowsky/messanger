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
import { IoMdSend, IoMdClose } from "react-icons/io";

export default function TextArea({
  conversationId,
  files,
  setFiles,
}: {
  conversationId: string;
  files: File[];
  setFiles: Dispatch<SetStateAction<[] | File[]>>;
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
      <div className="relative  flex w-full flex-wrap items-stretch gap-2 self-end bg-indigo-700 p-2">
        {files.length > 0 && (
          <div className="flex h-28 w-full justify-start gap-2 overflow-x-auto overflow-y-hidden border-b-2 border-indigo-950 border-opacity-30 bg-indigo-700  p-1 pl-2 lg:justify-center ">
            {files.map((file, index) => {
              const fileExtension = (filePath: string) => {
                const splittedText = filePath.split(".");
                return splittedText[splittedText.length - 1];
              };

              const fileIcon = () => {
                const extension = fileExtension(file.path);
                switch (extension) {
                  case "pdf":
                    return IconPDF;
                  case "docx":
                    return IconWord;
                  case "txt":
                    return IconTxt;
                  case "jpg":
                  case "png":
                  case "svg":
                  case "gif":
                  case "webp":
                    return file.preview;
                  default:
                    return IconFile;
                }
              };

              const handleImageClick = (src: string) => {
                setFullScreenImage(src);
              };

              const deleteFile = (id: string) => {
                setFiles(files.filter((file) => file.id !== id));
              };

              const verifyFullPageImage = (filePath: string) => {
                const fullPageFileExtensions = [
                  "jpg",
                  "png",
                  "svg",
                  "gif",
                  "webp",
                ];

                const extension = fileExtension(filePath);

                if (extension && fullPageFileExtensions.includes(extension))
                  return true;
                return false;
              };

              console.log(file);
              return (
                <div
                  className="relative min-w-[80px] max-w-[80px] cursor-pointer overflow-hidden rounded-md bg-indigo-800"
                  key={index}
                >
                  <div className="relative m-auto h-[55%] w-[75%] overflow-hidden  rounded-md p-1">
                    <Image
                      onClick={
                        verifyFullPageImage(file.path)
                          ? () => handleImageClick(file.preview)
                          : undefined
                      }
                      className="rounded-md"
                      src={fileIcon()}
                      alt="file image"
                      fill
                      // Revoke data uri after image is loaded
                      // onLoad={() => { URL.revokeObjectURL(file.preview) }}
                    />
                  </div>
                  <h3
                    className="z-[2] bg-indigo-800 p-1 text-sm transition-transform duration-1000 ease-in-out hover:-translate-y-[70%]"
                    onClick={() => handleImageClick(file.preview)}
                  >
                    {file.name}
                  </h3>
                  <IoMdClose
                    onClick={() => deleteFile(file.id)}
                    className="absolute right-[2px] top-[2px] cursor-pointer rounded-full  bg-red-950 text-slate-100"
                  />
                </div>
              );
            })}
          </div>
        )}
        <div className=" flex w-full flex-nowrap">
          <textarea
            ref={textRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="max-h-[80px] min-h-[80px] w-full resize-none rounded p-2 text-black outline-none transition-all duration-200 dark:bg-indigo-400 dark:focus:bg-indigo-300 lg:ml-auto lg:w-[60%]"
          />
          <button
            onClick={handleSubmit}
            className="self-start rounded-sm bg-indigo-950 p-2 lg:mr-auto"
          >
            <IoMdSend className="m-auto" />
          </button>
        </div>
        {/* <IoIosAttach className="m-auto"/> */}
      </div>
    </>
  );
}
