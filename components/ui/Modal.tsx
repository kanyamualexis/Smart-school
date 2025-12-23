
import React from 'react';
import { X } from 'lucide-react';

// Explicitly export and define ModalProps with children
export interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

// Using React.FC to ensure robust support for children passed within JSX tags
export const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-lg">{title}</h3>
        <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
      </div>
      <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
    </div>
  </div>
);
