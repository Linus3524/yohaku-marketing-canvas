import React from 'react';
import { Spinner } from './Spinner';

interface LoadingOverlayProps {
  title: string;
  description: string;
  colorClass?: string; // e.g. 'purple', 'blue', 'green'
}

const COLOR_MAP: Record<string, string> = {
  purple: 'text-blue-600', // Map to blue to maintain consistent Apple theme
  blue: 'text-blue-600',
  green: 'text-blue-600',
};

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  title,
  description,
  colorClass = 'blue',
}) => {
  const spinnerColor = COLOR_MAP[colorClass] || COLOR_MAP.blue;

  return (
    <div className="flex flex-col items-center justify-center mt-20 space-y-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <Spinner className={`w-20 h-20 ${spinnerColor}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-blue-600 rounded-full opacity-10 animate-ping"></div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
