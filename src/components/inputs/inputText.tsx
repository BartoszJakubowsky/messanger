import { type ChangeEventHandler } from 'react';

interface InputTextProps {
    value?: string,
    onChange: ChangeEventHandler<HTMLInputElement>;
    className?: string; 
    placeholder?: string; 
    autoFocus?: boolean;
}

const InputText: React.FC<InputTextProps> = ({value, onChange, className, placeholder, autoFocus = false }) => {
    return (
        <input
            value={value}
            onChange={onChange}
            className={`w-full bg-indigo-400 focus-within:bg-indigo-200 border-none outline-none text-white focus:placeholder:text-slate-100 transition-colors duration-200 placeholder:text-slate-200 p-1 ${className}`}
            type="text"
            placeholder={placeholder}
            autoFocus={autoFocus}
        />
    );
};

export default InputText;
