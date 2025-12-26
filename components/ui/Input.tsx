
import React from 'react';
import { cn } from '../../utils/cn';

// Explicitly export and extend ComponentPropsWithoutRef for native input tag compatibility
export interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  label?: string;
}

// Use forwardRef to allow the component to pass standard input props correctly to the underlying DOM element
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...props }, ref) => (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input 
        ref={ref}
        className={cn(
          "w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 placeholder:text-gray-400 transition-all",
          className
        )} 
        {...props} 
      />
    </div>
  )
);

Input.displayName = 'Input';
