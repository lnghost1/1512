import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <input
        className={`w-full px-3 py-2 bg-nexus-800 border border-nexus-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 transition-colors ${error ? 'border-nexus-danger' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-nexus-danger">{error}</p>}
    </div>
  );
};