import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { IoMdCloudDownload } from "react-icons/io";
import React from "react";
import { useDropzone } from "react-dropzone";
import { uuid } from "uuidv4";
import RecentMessages from "~/components/conversation/recentMessages";
import TextArea from "~/components/conversation/textArea";
import type { File } from "~/types/FileInterface";

export default function ConversationPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: sessionData } = useSession();

  const [files, setFiles] = useState<File[] | []>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (newFiles) => {
      const oldFiles = [...files];
      const addedFiles = newFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file), id: uuid() })
      );
      const allFiles = [...oldFiles, ...addedFiles];
      setFiles(allFiles as File[]);
    },
  });

  //to avoid memory leaks
  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  if (!id || Array.isArray(id)) return;

  if (!sessionData?.user) void router.push("/");

  const conversationId = id;

  return (
    <div
      {...getRootProps()}
      className="flex h-screen w-full flex-col justify-end overflow-hidden"
    >
      <input {...getInputProps()} className="absolute inset-0" />
      {isDragActive && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-950 bg-opacity-70 backdrop-blur-md">
          <div className=" h-80 w-64 rounded-r-md border-2 border-dashed border-white bg-indigo-950 bg-opacity-30 p-2">
            <IoMdCloudDownload className=" mx-auto mt-4 h-24 w-24 animate-bounce" />
            Drag and drop file you want to share
          </div>
        </div>
      )}
      <RecentMessages conversationId={conversationId} />
      <TextArea
        conversationId={conversationId}
        files={files}
        setFiles={setFiles}
      />
    </div>
  );
}
