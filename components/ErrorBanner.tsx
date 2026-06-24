import React from 'react';
import { ErrorType } from '../utils/errorHandler';
import { AppState } from '../types';
import { AlertTriangle, Lightbulb } from 'lucide-react';

interface ErrorBannerProps {
  errorMsg: string;
  errorType: ErrorType | null;
  onReset: () => void;
}

const ERROR_TITLES: Record<ErrorType, string> = {
  [ErrorType.AUTH]: '認證錯誤',
  [ErrorType.NETWORK]: '網路錯誤',
  [ErrorType.RATE_LIMIT]: '請求限制',
  [ErrorType.VALIDATION]: '驗證錯誤',
  [ErrorType.API]: '發生錯誤',
  [ErrorType.UNKNOWN]: '發生錯誤',
};

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ errorMsg, errorType, onReset }) => {
  if (!errorMsg) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl text-left shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-red-200/50 pb-2">
        <h3 className="text-red-700 font-bold flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          {errorType ? ERROR_TITLES[errorType] : '發生錯誤'}
        </h3>
        <button onClick={onReset} className="text-sm text-red-600 hover:text-red-800 underline font-medium">重置並返回首頁</button>
      </div>
      <p className="text-red-800 text-sm leading-relaxed">
        {errorMsg}
      </p>
      {errorType === ErrorType.RATE_LIMIT && (
        <p className="text-red-700/80 text-xs mt-3 flex items-center gap-1.5 font-medium">
          <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
          提示：API 請求次數已達上限，請稍候 1-2 分鐘後再試，或檢查您的 API 配額設定。
        </p>
      )}
    </div>
  );
};
