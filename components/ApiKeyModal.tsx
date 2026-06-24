import React, { useState, useEffect } from 'react';
import { validateApiKey } from '../utils/errorHandler';
import { Key, Eye, EyeOff } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>();

  useEffect(() => {
    // Check if key exists in localStorage on mount
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = apiKey.trim();
    
    // 驗證 API Key
    const validation = validateApiKey(trimmedKey);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }
    
    setValidationError(undefined);
    localStorage.setItem('gemini_api_key', trimmedKey);
    onSave(trimmedKey);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="bg-white/80 border border-slate-200/50 rounded-3xl max-w-md w-full p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/10">
            <Key className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">設定 Gemini API</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            為了確保安全，請使用您自己的 API Key。<br/>
            您的 Key 只會儲存在瀏覽器中，不會上傳至伺服器。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gemini API Key</label>
            <div className="relative">
              <input 
                type={isVisible ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  if (validationError) {
                    setValidationError(undefined);
                  }
                }}
                placeholder="AIzaSy..."
                className={`w-full bg-white border rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none transition-colors pr-10 shadow-sm focus:ring-1 focus:ring-blue-500 ${
                  validationError ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
                required
              />
              {validationError && (
                <p className="text-red-500 text-xs mt-1">{validationError}</p>
              )}
              <button 
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {isVisible ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={apiKey.trim().length === 0 || !!validationError}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl hover:opacity-95 transition-opacity shadow-md shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            開始使用
          </button>
        </form>

        <div className="mt-6 text-center">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-500 underline font-medium"
          >
            還沒有 Key? 點此免費獲取
          </a>
        </div>
      </div>
    </div>
  );
};