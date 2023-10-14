import IconFile from "../../../public/icon_file.png";
import IconPDF from "../../../public/icon_pdf.png";
import IconWord from "../../../public/icon_word.png";
import IconTxt from "../../../public/icon_txt.png";
import type { File } from "~/types/FileInterface";
import type { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";

export default function FilePreview({
  files,
  setFiles,
  setFullScreenImage,
}: {
  files: File[];
  setFiles: Dispatch<SetStateAction<[] | File[]>>;
  setFullScreenImage: Dispatch<string | null>;
}) {
  return (
    <>
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
    </>
  );
}
