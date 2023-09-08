import { useState, useRef, useLayoutEffect, useCallback } from "react";


export default function TextArea() {
    
    const [textAreaValue, setTextAreaValue] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>();
    const textAreaInputRef = useCallback((textArea: HTMLTextAreaElement) => {
      updateTextAreaSize(textArea);
      textAreaRef.current = textArea;
    }, []);
  
    const handleTextAreaChange = (text: string) => setTextAreaValue(text);
  
    useLayoutEffect(() => {
      updateTextAreaSize(textAreaRef.current);
    }, [textAreaValue]);

    return (
        <textarea
          className="flex-grow resize-none overflow-hidden p-4 outline-none max-h-[200px]"
          ref={textAreaInputRef}
          placeholder="what's happening"
          style={{ height: 0}}
          value={textAreaValue}
          onChange={(event) => handleTextAreaChange(event.target.value)}
        ></textarea>
    )
}


function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if (!textArea) return;
  
    textArea.style.height = "0";
  
    textArea.style.height = `${textArea.scrollHeight}px`;
  }