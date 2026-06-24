import React, { useState, useEffect, useRef } from 'react';
import { useImageGeneration } from '../hooks/useImageGeneration';
import { useImageUpload } from '../hooks/useImageUpload';
import { Spinner } from './Spinner';
import { PromptData } from '../types';
import { ImageModal } from './ImageModal';
import { downloadSingleImage } from '../utils/imageDownloader';
import { Maximize2, Download, RefreshCw, Play, Image as ImageIcon, FileUp, Sparkles, X } from 'lucide-react';

interface PromptCardProps {
  data: PromptData;
  index: number;
  defaultRefImage?: string; // 產品原圖作為預設參考圖
}

export const PromptCard: React.FC<PromptCardProps> = ({ data, index, defaultRefImage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [promptText, setPromptText] = useState(data.prompt_en);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'>('3:4');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 使用自訂 Hooks
  const { image: generatedImage, loading: isLoading, error, generateImage, clearImage } = useImageGeneration();
  const { image: refImage, error: refImageError, uploadImage: uploadRefImage, clearImage: clearRefImage } = useImageUpload();

  // Reset state when data prop changes (new route selected)
  useEffect(() => {
    setPromptText(data.prompt_en);
    clearImage();
    clearRefImage();
    setIsEditing(false);
    setAspectRatio('3:4');
  }, [data, clearImage, clearRefImage]);

  // 使用使用者手動上傳的參考圖，若無則自動使用產品原圖
  const effectiveRefImage = refImage || defaultRefImage;

  const handleGenerate = async () => {
    await generateImage(promptText, aspectRatio, effectiveRefImage || undefined);
  };

  const handleRefImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadRefImage(e.target.files[0]);
    }
  };

  const handleClearRefImage = () => {
    clearRefImage();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 根據比例獲取容器類別
  const getContainerClass = () => {
    if (aspectRatio === '1:1') return "aspect-square w-full";
    if (aspectRatio === '3:4') return "aspect-[3/4] w-full";
    if (aspectRatio === '4:3') return "aspect-[4/3] w-full";
    if (aspectRatio === '9:16') return "aspect-[9/16] w-full";
    if (aspectRatio === '16:9') return "aspect-[16/9] w-full";
    return "aspect-[3/4] w-full";
  };

  const containerClass = getContainerClass();
  const labelClass = aspectRatio === '9:16' || aspectRatio === '16:9' 
    ? "bg-pink-50 text-pink-600 border-pink-200 shadow-sm" 
    : "bg-blue-50 text-blue-600 border-blue-200 shadow-sm";

  return (
    <div className="flex flex-col gap-3 group relative bg-white/70 border border-slate-200/50 backdrop-blur-md rounded-2xl p-4 shadow-sm">
      {/* Image Display Area */}
      <div className={`relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 ${containerClass}`}>
        {generatedImage ? (
          <div className="relative w-full h-full">
            <img src={generatedImage} alt={`概念圖 ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 bg-white/30 hover:bg-white/50 rounded-full text-white backdrop-blur-md transition-colors"
                title="放大檢視"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (generatedImage) {
                    const fileName = `concept-poster-${index + 1}-${aspectRatio.replace(':', 'x')}.png`;
                    downloadSingleImage(generatedImage, fileName);
                  }
                }}
                className="p-2 bg-white/30 hover:bg-white/50 rounded-full text-white backdrop-blur-md transition-colors" 
                title="下載"
              >
                <Download className="w-5 h-5" />
              </button>
              <button 
                onClick={handleGenerate} 
                className="p-2 bg-white/30 hover:bg-white/50 rounded-full text-white backdrop-blur-md transition-colors" 
                title="重新生成"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center relative">
            {/* Ref Image Background (Blurred) */}
            {refImage && (
              <div className="absolute inset-0 opacity-20">
                <img src={refImage} className="w-full h-full object-cover blur-xs" alt="ref-bg" />
              </div>
            )}
            
            {isLoading ? (
              <Spinner className="w-8 h-8 text-blue-600 relative z-10" />
            ) : (
              <button 
                onClick={handleGenerate}
                className="w-12 h-12 rounded-full bg-white/80 text-slate-600 hover:text-blue-600 hover:bg-white flex items-center justify-center transition-all border border-slate-200 relative z-10 shadow-sm"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            )}
          </div>
        )}
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm z-20 ${labelClass}`}>
          {aspectRatio}
        </div>
      </div>

      {/* Controls Area */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold text-slate-800 leading-tight line-clamp-2">{data.summary_zh || `概念圖 ${index + 1}`}</h4>
          {/* Reference Image Button */}
          <div className="relative flex-shrink-0">
            <input type="file" ref={fileInputRef} onChange={handleRefImageUpload} className="hidden" accept="image/*" />
            <button 
              onClick={() => refImage ? handleClearRefImage() : fileInputRef.current?.click()}
              className={`text-[10px] font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors shadow-xs ${
                refImage 
                  ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100' 
                  : defaultRefImage 
                    ? 'border-green-200 bg-green-50 text-green-700' 
                    : 'border-slate-200 bg-white/60 text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
              title={refImage ? "移除參考圖" : defaultRefImage ? "已自動使用產品原圖，點擊可替換" : "上傳參考圖 (Logo/風格)"}
            >
              <FileUp className="w-3 h-3" />
              {refImage ? '已參考' : defaultRefImage ? '產品圖' : '參考圖'}
            </button>
          </div>
        </div>

        {/* 生成提示詞檢視（執行前可檢視） */}
        <div className="bg-slate-100/70 rounded-xl p-2 border border-slate-200/50">
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">生成提示詞</label>
          <div className="max-h-24 overflow-y-auto rounded-lg bg-white border border-slate-200/60 p-2">
            <pre className="text-[10px] text-slate-600 whitespace-pre-wrap font-mono leading-relaxed">
              {promptText}
            </pre>
          </div>
        </div>

        {/* Aspect Ratio Selection */}
        <div className="bg-slate-100/70 rounded-xl p-2 border border-slate-200/50">
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">圖片比例</label>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => {
                if (aspectRatio !== '3:4') {
                  setAspectRatio('3:4');
                  clearImage();
                }
              }}
              className={`py-1 px-2 rounded text-[10px] font-bold border transition-colors ${
                aspectRatio === '3:4' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              3:4
            </button>
            <button
              onClick={() => {
                if (aspectRatio !== '4:3') {
                  setAspectRatio('4:3');
                  clearImage();
                }
              }}
              className={`py-1 px-2 rounded text-[10px] font-bold border transition-colors ${
                aspectRatio === '4:3' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              4:3
            </button>
            <button
              onClick={() => {
                if (aspectRatio !== '9:16') {
                  setAspectRatio('9:16');
                  clearImage();
                }
              }}
              className={`py-1 px-2 rounded text-[10px] font-bold border transition-colors ${
                aspectRatio === '9:16' 
                  ? 'bg-pink-600 text-white border-pink-600 shadow-xs' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              9:16
            </button>
            <button
              onClick={() => {
                if (aspectRatio !== '16:9') {
                  setAspectRatio('16:9');
                  clearImage();
                }
              }}
              className={`py-1 px-2 rounded text-[10px] font-bold border transition-colors ${
                aspectRatio === '16:9' 
                  ? 'bg-pink-600 text-white border-pink-600 shadow-xs' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              16:9
            </button>
          </div>
        </div>

        {/* Generate Button（提示詞已在上方顯示，執行前可檢視） */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          {isLoading ? (
            <>
              <Spinner className="w-4 h-4" />
              <span>生成中...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {generatedImage ? '重新生成' : '生成視覺圖'}
            </>
          )}
        </button>

        {/* Error Display */}
        {(error || refImageError) && (
          <p className="text-red-500 text-xs text-center font-medium">{error || refImageError}</p>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={generatedImage}
        onClose={() => setIsModalOpen(false)}
        title={`概念圖 ${index + 1}`}
      />
    </div>
  );
};
