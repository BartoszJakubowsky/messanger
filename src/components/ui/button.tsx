interface ButtonProps {
    onClick : () => void
    text? : string,
    className? : string

}

export default function Button({onClick, className, text}: ButtonProps) {
    return (
        <button 
         onClick={onClick} 
         className={`bg-indigo-950 p-2 rounded-sm outline-none border-indigo-500 ${className}`}>
            {text}
        </button>
    )
};
