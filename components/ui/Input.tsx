
import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { Eye, EyeOff } from 'lucide-react';

// Explicitly export and extend ComponentPropsWithoutRef for native input tag compatibility
export interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  label?: string;
}

// Use forwardRef to allow the component to pass standard input props correctly to the underlying DOM element
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="mb-4">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <div className="relative">
          <input 
            ref={ref}
            type={inputType}
            className={cn(
              "w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 placeholder:text-gray-400 transition-all",
              isPassword ? "pr-10" : "",
              className
            )} 
            {...props} 
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-600 focus:outline-none transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
