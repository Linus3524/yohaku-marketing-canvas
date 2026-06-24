import React, { useState, useRef, useEffect } from 'react';
import { ContentPlan, ContentItem } from '../types';
import { useImageGeneration } from '../hooks/useImageGeneration';
import { useImageUpload } from '../hooks/useImageUpload';
import { Spinner } from './Spinner';
import { ImageModal } from './ImageModal';
import { downloadAllImages, downloadSingleImage } from '../utils/imageDownloader';
import { generateImageFileName } from '../utils/imageNaming';
import { FileText, Download, RefreshCw, Play, FileUp, Sparkles, Layout, HelpCircle, Eye, Check, Maximize2 } from 'lucide-react';

interface ContentSuiteProps {
  plan: ContentPlan;
  onPlanUpdate: (updatedItems: ContentItem[]) => void; // Callback to update parent with edited text
  onDownloadReport?: () => void; // Callback for download report button
  onImagesGenerated?: (generatedImages: Map<string, string>) => void; // Callback when images are generated
  productImageBase64?: string; // 使用者上傳的產品原圖，作為預設參考圖
}

// --- SUB-COMPONENT: Script Editor Row ---
const ScriptEditorRow: React.FC<{ 
  item: ContentItem; 
  onChange: (id: string, field: keyof ContentItem, value: string) => void 
}> = ({ item, onChange }) => {
  return (
    <div className="bg-white/70 border border-slate-200/50 backdrop-blur-md rounded-2xl p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border ${item.ratio === '1:1' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-pink-50 text-pink-600 border-pink-200'}`}>
          {item.ratio} | {item.type.replace('_', ' ')}
        </span>
        <span className="text-xs text-slate-400">ID: {item.id}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Text Content */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">標題 (Headline)</label>
            <input 
              type="text" 
              value={item.title_zh}
              onChange={(e) => onChange(item.id, 'title_zh', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">內文 (Copy)</label>
            <textarea 
              value={item.copy_zh}
              onChange={(e) => onChange(item.id, 'copy_zh', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-sm resize-none h-20"
            />
          </div>
        </div>

        {/* Visual Prompt */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">視覺提示詞 (Prompt)</label>
          <textarea 
            value={item.visual_prompt_en}
            onChange={(e) => onChange(item.id, 'visual_prompt_en', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono shadow-sm resize-none h-36"
          />
          <p className="text-[10px] text-slate-400 mt-1.5 font-medium">摘要: {item.visual_summary_zh}</p>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: Production Card ---
const ProductionCard: React.FC<{ 
  item: ContentItem;
  index: number; // 在 items 陣列中的索引
  onImageChange?: (itemId: string, imageData: string | null) => void;
  defaultRefImage?: string; // 產品原圖作為預設參考圖
}> = ({ item, index, onImageChange, defaultRefImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storyAspectRatio, setStoryAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  
  // Determine the actual ratio to use
  const actualRatio = item.type === 'story_slide' ? storyAspectRatio : item.ratio;
  
  // 使用自訂 Hooks
  const { image, loading, error, generateImage, clearImage } = useImageGeneration();
  const { image: refImage, error: refImageError, uploadImage: uploadRefImage, clearImage: clearRefImage } = useImageUpload();

  // 當圖片改變時，通知父組件
  useEffect(() => {
    if (onImageChange) {
      onImageChange(item.id, image);
    }
  }, [image, item.id, onImageChange]);

  // 使用使用者手動上傳的參考圖，若無則自動使用產品原圖
  const effectiveRefImage = refImage || defaultRefImage;

  const handleGenerate = async () => {
    await generateImage(item.visual_prompt_en, actualRatio, effectiveRefImage || undefined);
  };

  const handleRefUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadRefImage(e.target.files[0]);
    }
  };
  
  const handleClearRefImage = () => {
    clearRefImage();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Styling based on ratio
  const getContainerClass = () => {
    if (actualRatio === '1:1') return "aspect-square w-full";
    if (actualRatio === '9:16') return "aspect-[9/16] w-full";
    if (actualRatio === '16:9') return "aspect-[16/9] w-full";
    return "aspect-[9/16] w-full";
  };
  
  const containerClass = getContainerClass();
  const labelClass = actualRatio === '1:1' ? "bg-blue-50 text-blue-600 border-blue-200 shadow-sm" : "bg-pink-50 text-pink-600 border-pink-200 shadow-sm";

  return (
    <div className="flex flex-col gap-3 group relative bg-white/70 border border-slate-200/50 backdrop-blur-md rounded-2xl p-4 shadow-sm">
        {/* Image Display Area */}
        <div className={`relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 ${containerClass}`}>
            {image ? (
                <div className="relative w-full h-full">
                    <img src={image} alt={item.title_zh} className="w-full h-full object-cover" />
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
                               if (image) {
                                 const fileName = generateImageFileName(item, index);
                                 downloadSingleImage(image, fileName);
                               }
                             }}
                             className="p-2 bg-white/30 hover:bg-white/50 rounded-full text-white backdrop-blur-md transition-colors" 
                             title="下載單張"
                         >
                             <Download className="w-5 h-5" />
                         </button>
                         <button onClick={handleGenerate} className="p-2 bg-white/30 hover:bg-white/50 rounded-full text-white backdrop-blur-md transition-colors" title="重繪">
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
                    
                    {loading ? (
                        <Spinner className="w-8 h-8 text-blue-600 relative z-10" />
                    ) : (
                        <button 
                            onClick={handleGenerate}
                            className="w-12 h-12 rounded-full bg-white/85 hover:bg-white hover:text-blue-600 text-slate-500 border border-slate-200 flex items-center justify-center transition-all relative z-10 shadow-sm"
                        >
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                        </button>
                    )}
                </div>
            )}
            <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm z-20 ${labelClass}`}>
                {actualRatio}
            </div>
        </div>

        {/* Controls Area */}
        <div className="space-y-2">
            <div className="flex justify-between items-start gap-2">
                <h4 className="text-sm font-bold text-slate-800 leading-tight line-clamp-1">{item.title_zh}</h4>
                {/* Individual Ref Upload */}
                <div className="relative shrink-0">
                    <input type="file" ref={fileInputRef} onChange={handleRefUpload} className="hidden" accept="image/*" />
                    <button 
                        onClick={() => refImage ? handleClearRefImage() : fileInputRef.current?.click()}
                        className={`text-[10px] font-medium flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-colors shadow-xs ${
                          refImage 
                            ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100' 
                            : defaultRefImage 
                              ? 'border-green-200 bg-green-50 text-green-700' 
                              : 'border-slate-200 bg-white/60 text-slate-500 hover:text-slate-800 hover:border-slate-300'
                        }`}
                        title={refImage ? "移除自訂參考圖" : defaultRefImage ? "已自動使用產品原圖，點擊可替換" : "上傳參考圖 (Logo/風格)"}
                    >
                        <FileUp className="w-2.5 h-2.5" />
                        {refImage ? '已參考' : defaultRefImage ? '產品圖' : '參考圖'}
                    </button>
                </div>
            </div>
            
            {/* Aspect Ratio Selection for Story Slides */}
            {item.type === 'story_slide' && (
                <div className="bg-slate-100/75 rounded-xl p-2 border border-slate-200/50">
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">圖片比例</label>
                    <div className="flex gap-1">
                        <button
                            onClick={() => {
                                if (storyAspectRatio !== '9:16') {
                                    setStoryAspectRatio('9:16');
                                    // 清除已生成的圖片，因為比例改變了
                                    clearImage();
                                }
                            }}
                            className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold border transition-colors ${
                                storyAspectRatio === '9:16' 
                                    ? 'bg-pink-600 text-white border-pink-600 shadow-xs' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            9:16
                        </button>
                        <button
                            onClick={() => {
                                if (storyAspectRatio !== '16:9') {
                                    setStoryAspectRatio('16:9');
                                    clearImage();
                                }
                            }}
                            className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold border transition-colors ${
                                storyAspectRatio === '16:9' 
                                    ? 'bg-pink-600 text-white border-pink-600 shadow-xs' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            16:9
                        </button>
                    </div>
                </div>
            )}
            
            <p className="text-xs text-slate-500 line-clamp-2" title={item.copy_zh}>{item.copy_zh}</p>
            {(error || refImageError) && <p className="text-[10px] text-red-500 font-medium">{error || refImageError}</p>}
        </div>

        {/* Image Modal */}
        <ImageModal
            isOpen={isModalOpen}
            imageUrl={image}
            onClose={() => setIsModalOpen(false)}
            title={item.title_zh}
        />
    </div>
  );
};

// --- MAIN COMPONENT ---
export const ContentSuite: React.FC<ContentSuiteProps> = ({ plan, onPlanUpdate, onDownloadReport, onImagesGenerated, productImageBase64 }) => {
  const [mode, setMode] = useState<'review' | 'production'>('review');
  const [items, setItems] = useState<ContentItem[]>(plan.items);
  // 追蹤所有已生成的圖片：Map<itemId, base64ImageData>
  const [generatedImages, setGeneratedImages] = useState<Map<string, string>>(new Map());
  const [isDownloading, setIsDownloading] = useState(false);

  // Sync with props if plan changes completely
  useEffect(() => {
    setItems(plan.items);
    setMode('review');
    setGeneratedImages(new Map()); // 重置圖片追蹤
  }, [plan]);

  // 處理單個圖片的狀態變化
  const handleImageChange = (itemId: string, imageData: string | null) => {
    setGeneratedImages(prev => {
      const newMap = new Map(prev);
      if (imageData) {
        newMap.set(itemId, imageData);
      } else {
        newMap.delete(itemId);
      }
      // 通知父組件圖片狀態變化
      if (onImagesGenerated) {
        onImagesGenerated(newMap);
      }
      return newMap;
    });
  };

  // 批次下載所有圖片
  const handleDownloadAll = async () => {
    if (generatedImages.size === 0) {
      alert('目前沒有已生成的圖片可下載');
      return;
    }

    setIsDownloading(true);
    try {
      // 使用企劃名稱作為 ZIP 檔名（清理特殊字元）
      const zipFileName = plan.plan_name
        .replace(/[^\w\s-]/g, '') // 移除特殊字元
        .replace(/\s+/g, '-') // 空格轉換為連字號
        .toLowerCase() || 'marketing-assets';
      
      await downloadAllImages(generatedImages, items, zipFileName);
    } catch (error) {
      console.error('下載失敗:', error);
      alert(error instanceof Error ? error.message : '下載失敗，請稍候再試');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleItemChange = (id: string, field: keyof ContentItem, value: string) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(newItems);
    onPlanUpdate(newItems); // Propagate changes up to App for export
  };

  const mainImages = items.filter(i => i.ratio === '1:1');
  const storySlides = items.filter(i => i.ratio === '9:16');

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Header & Mode Switch */}
        <div className="flex flex-col mb-8 gap-4 border-b border-slate-200 pb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1 font-semibold">
                    {plan.plan_name}
                </h2>
                <p className="text-slate-500 text-sm">Content Suite Plan ({items.length} Assets)</p>
            </div>
            
            {/* 三個按鈕水平對齊排列 */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="bg-slate-200/50 p-1 rounded-xl flex items-center border border-slate-200/40">
                    <button 
                        onClick={() => setMode('review')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'review' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        1. 腳本審閱 (Script)
                    </button>
                    <button 
                        onClick={() => setMode('production')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'production' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        2. 圖片製作 (Production)
                    </button>
                </div>
                
                {onDownloadReport && (
                    <button 
                        onClick={onDownloadReport}
                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-800 transition-all shadow-xs"
                    >
                        <FileText className="w-4 h-4 text-slate-500" />
                        下載全案策略報告 (.txt)
                    </button>
                )}
                
                {/* 一鍵下載所有圖片按鈕（僅在 Production 模式顯示） */}
                {mode === 'production' && (
                    <button 
                        onClick={handleDownloadAll}
                        disabled={isDownloading || generatedImages.size === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all font-semibold border ${
                            isDownloading || generatedImages.size === 0
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-200'
                                : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-md shadow-blue-500/10'
                        }`}
                        title={generatedImages.size === 0 ? '請先生成圖片' : `下載 ${generatedImages.size} 張圖片`}
                    >
                        {isDownloading ? (
                            <>
                                <Spinner className="w-4 h-4" />
                                打包中...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                下載所有圖片 {generatedImages.size > 0 && `(${generatedImages.size})`}
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>

        {/* MODE: SCRIPT REVIEW */}
        {mode === 'review' && (
            <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl mb-6 flex items-start gap-3 text-left">
                    <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-blue-700 text-sm font-bold mb-1">腳本審閱模式</p>
                        <p className="text-blue-600/80 text-xs">請在此階段確認並編輯所有圖片的文案與 AI 提示詞。確認無誤後，點擊右上角切換至「圖片製作」模式開始生成。</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">A. 主圖規劃 (Square 1:1)</h3>
                    {mainImages.map(item => (
                        <ScriptEditorRow key={item.id} item={item} onChange={handleItemChange} />
                    ))}
                </div>
                
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">B. 內容長圖規劃 (Stories 9:16)</h3>
                    {storySlides.map(item => (
                        <ScriptEditorRow key={item.id} item={item} onChange={handleItemChange} />
                    ))}
                </div>
                
                <div className="flex justify-end pt-4">
                    <button 
                        onClick={() => setMode('production')}
                        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-blue-500/10"
                    >
                        <span>確認定稿，進入製作</span>
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                </div>
            </div>
        )}

        {/* MODE: PRODUCTION */}
        {mode === 'production' && (
            <div>
                {/* Section 1: Main Images */}
                <div className="mb-12">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-5 bg-blue-600 rounded-full shadow-xs shadow-blue-500/20"></span>
                        方形主圖 (Main Visuals)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {mainImages.map((item, idx) => {
                            const globalIndex = items.findIndex(i => i.id === item.id);
                            return (
                                <ProductionCard 
                                    key={item.id} 
                                    item={item} 
                                    index={globalIndex >= 0 ? globalIndex : idx}
                                    onImageChange={handleImageChange}
                                    defaultRefImage={productImageBase64}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Section 2: Story Slides */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-5 bg-pink-500 rounded-full shadow-xs shadow-pink-500/20"></span>
                        內容介紹組圖 (Story Suite)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {storySlides.map((item, idx) => {
                            const globalIndex = items.findIndex(i => i.id === item.id);
                            return (
                                <ProductionCard 
                                    key={item.id} 
                                    item={item} 
                                    index={globalIndex >= 0 ? globalIndex : idx}
                                    onImageChange={handleImageChange}
                                    defaultRefImage={productImageBase64}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
