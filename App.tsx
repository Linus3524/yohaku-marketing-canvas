import React, { useState, useEffect } from 'react';
import { analyzeProductImage, generateContentPlan, generateMarketAnalysis, generateContentStrategy } from './services/geminiService';
import { DirectorOutput, ContentItem, ContentPlan, MarketAnalysis, AppState, ContentStrategy } from './types';
import { GuideModal } from './components/GuideModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ProductCard } from './components/ProductCard';
import { PromptCard } from './components/PromptCard';
import { ErrorBanner } from './components/ErrorBanner';
import { LoadingOverlay } from './components/LoadingOverlay';
import { InputForm } from './components/InputForm';
import { Phase2Section } from './components/Phase2Section';
import { Phase3Section } from './components/Phase3Section';
import { Phase4Section } from './components/Phase4Section';
import { Phase5Section } from './components/Phase5Section';
import { DebugPromptModal } from './components/DebugPromptModal';
import { LockedPhaseCard } from './components/LockedPhaseCard';
import { AppError, ErrorType } from './utils/errorHandler';
import { validateProductName, validateBrandContext, validateRefCopy } from './utils/validators';
import { LanguageMode, getLanguageMode, setLanguageMode, isChineseMode } from './utils/languageMode';
import { generateImageDescriptionMap } from './utils/imageMapping';
import { generateFileNameMap } from './utils/imageNaming';
import { generatePhase1Report, generatePhase3Report, generatePhase4Report } from './utils/reportGenerator';
import { generateFullReport } from './services/geminiService';
import { downloadTextFile } from './utils/downloadHelper';
import { FILE_LIMITS } from './utils/constants';
import { FileText, Download, Lock, Sparkles, Search, Globe, Users, Copy, Layout, CheckCircle, ArrowRight, Star } from 'lucide-react';

// --- High-Fidelity Mock UI Previews for Locked Phases ---

const Phase1Preview: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {['品牌故事感 (Route A)', '自然極簡留白 (Route B)', '日常溫馨實境 (Route C)'].map((route, i) => (
        <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white/40 text-slate-400">
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">視覺定位策略</div>
          <div className="font-bold text-sm text-slate-500 mt-1">{route}</div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((idx) => (
        <div key={idx} className="bg-white/40 border border-slate-200/50 rounded-2xl p-4 flex flex-col min-h-[220px]">
          <div className="w-full h-32 bg-slate-100/50 rounded-xl mb-3 flex items-center justify-center border border-slate-200/40">
            <Layout className="w-8 h-8 text-slate-300" />
          </div>
          <div className="h-4 bg-slate-200/60 rounded-full w-2/3 mb-2 animate-pulse"></div>
          <div className="h-3 bg-slate-200/40 rounded-full w-5/6 mb-4"></div>
          <div className="mt-auto flex justify-between gap-2">
            <div className="h-8 bg-slate-200/50 rounded-lg w-16"></div>
            <div className="h-8 bg-slate-200/50 rounded-lg w-20"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Phase2Preview: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-white/40 border border-slate-200/50 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-slate-200/60 rounded-full w-32 mb-2"></div>
        <div className="h-16 bg-white/60 border border-slate-200/40 rounded-xl p-3"></div>
      </div>
      <div className="md:w-56 flex flex-col justify-end">
        <div className="h-10 bg-slate-200/60 rounded-xl w-full"></div>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {['主圖 - 質感商品照', '細節圖 - 產品特色', '痛點圖 - 解決方案', '情境圖 - 使用情境'].map((title, i) => (
        <div key={i} className="bg-white/40 border border-slate-200/40 rounded-xl p-4 flex flex-col min-h-[160px]">
          <div className="w-8 h-8 rounded-lg bg-slate-100/70 border border-slate-200/30 flex items-center justify-center font-bold text-xs text-slate-400 mb-2">
            {i + 1}
          </div>
          <div className="font-bold text-xs text-slate-500 mb-1">{title}</div>
          <div className="h-2.5 bg-slate-200/50 rounded-full w-5/6 mb-1.5"></div>
          <div className="h-2 bg-slate-200/30 rounded-full w-2/3"></div>
          <div className="w-full h-16 bg-slate-100/40 border border-slate-200/20 rounded-lg mt-auto flex items-center justify-center">
            <Layout className="w-5 h-5 text-slate-300" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Phase3Preview: React.FC = () => (
  <div className="space-y-6">
    <div className="flex flex-wrap gap-2">
      {['台灣', '亞洲', '北美', '全球'].map((r, i) => (
        <div key={i} className={`px-3 py-1.5 rounded-lg text-xs border border-slate-200/50 ${i === 0 ? 'bg-slate-200 text-slate-600 font-semibold' : 'bg-white/40 text-slate-400'}`}>
          {r}
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/40 border border-slate-200/40 rounded-xl p-4 md:col-span-2 space-y-4">
        <div className="font-bold text-xs text-slate-500 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" /> 競品行銷策略分析
        </div>
        <div className="border border-slate-200/35 rounded-lg overflow-hidden text-[11px]">
          <div className="grid grid-cols-3 bg-slate-100/60 p-2 font-bold text-slate-500 border-b border-slate-200/30">
            <div>品牌 / 競品</div>
            <div>優勢優特</div>
            <div>行銷漏洞/策略</div>
          </div>
          {[
            { name: '競品 A 品牌', adv: '聲量高、通路廣', strategy: '大量找KOL開箱、折價行銷' },
            { name: '競品 B 品牌', adv: '天然無毒成分', strategy: '社群視覺精美，強調功能' }
          ].map((c, i) => (
            <div key={i} className="grid grid-cols-3 p-2 text-slate-400 border-b border-slate-200/20">
              <div className="font-medium">{c.name}</div>
              <div>{c.adv}</div>
              <div>{c.strategy}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white/40 border border-slate-200/40 rounded-xl p-4 space-y-3">
        <div className="font-bold text-xs text-slate-500 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" /> 目標人物誌 (Persona)
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-200/80 animate-pulse"></div>
          <div>
            <div className="h-3 bg-slate-200/60 rounded-full w-20 mb-1"></div>
            <div className="h-2 bg-slate-200/30 rounded-full w-12"></div>
          </div>
        </div>
        <div className="h-2.5 bg-slate-200/45 rounded-full w-full"></div>
        <div className="h-2 bg-slate-200/30 rounded-full w-5/6"></div>
      </div>
    </div>
  </div>
);

const Phase4Preview: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {['為什麼你的商品需要減法？', '辦公室冷氣房必備！神物保養開箱'].map((topic, i) => (
        <div key={i} className="bg-white/40 border border-slate-200/40 rounded-xl p-4 space-y-3">
          <div className="font-bold text-xs text-slate-500">{topic}</div>
          <div className="h-2.5 bg-slate-200/50 rounded-full w-full"></div>
          <div className="h-2 bg-slate-200/30 rounded-full w-3/4"></div>
          <div className="flex gap-2 mt-2 pt-2 border-t border-slate-200/20">
            <span className="px-2 py-0.5 rounded bg-blue-50/50 text-[10px] text-blue-500 font-semibold border border-blue-100">主要關鍵字: 保濕</span>
            <span className="px-2 py-0.5 rounded bg-slate-100/50 text-[10px] text-slate-400 font-medium">長尾字: 鎖水推薦</span>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-white/40 border border-slate-200/40 rounded-xl p-4 flex justify-between items-center text-xs text-slate-400">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-slate-300" />
        <span>生成 AI Studio (React + Tailwind) 提示詞及簡報提示詞</span>
      </div>
      <div className="h-7 bg-slate-200/50 rounded-lg w-20"></div>
    </div>
  </div>
);

const Phase5Preview: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-white/40 border border-slate-200/40 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
        <Layout className="w-4 h-4 text-slate-400" /> 
        <span>電商 Landing Page 視覺及程式碼結構</span>
      </div>
      <div className="border border-slate-200/35 rounded-xl overflow-hidden p-4 space-y-3 bg-slate-100/20">
        <div className="h-4 bg-slate-200/70 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="h-10 bg-slate-200/45 rounded"></div>
          <div className="h-10 bg-slate-200/45 rounded"></div>
          <div className="h-10 bg-slate-200/45 rounded"></div>
        </div>
        <div className="h-8 bg-orange-600/30 border border-orange-500/20 rounded w-full flex items-center justify-center text-[10px] font-bold text-orange-600">
          請至 Ultra 商業版本體驗智能配圖與部署
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  // --- Core State ---
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- PRO Inputs ---
  const [productName, setProductName] = useState("");
  const [brandContext, setBrandContext] = useState("");
  const [refCopy, setRefCopy] = useState("");

  // --- Phase 1 Results ---
  const [analysisResult, setAnalysisResult] = useState<DirectorOutput | null>(null);
  const [activeRouteIndex, setActiveRouteIndex] = useState<number>(0);

  // --- Phase 2 Data ---
  const [contentPlan, setContentPlan] = useState<ContentPlan | null>(null);
  const [editedPlanItems, setEditedPlanItems] = useState<ContentItem[]>([]);
  const [phase2GeneratedImages, setPhase2GeneratedImages] = useState<Map<string, string>>(new Map());

  // --- Phase 3 & 4 Data ---
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null);
  const [marketRegion, setMarketRegion] = useState<string>("台灣");
  const [contentStrategy, setContentStrategy] = useState<ContentStrategy | null>(null);

  // --- UI State ---
  const [debugModalPhase, setDebugModalPhase] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [inputErrors, setInputErrors] = useState<{ productName?: string; brandContext?: string; refCopy?: string }>({});
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [languageMode, setLanguageModeState] = useState<LanguageMode>(getLanguageMode());
  const [isInputExpanded, setIsInputExpanded] = useState(true);

  // --- Check for API Key on mount ---
  useEffect(() => {
    const key = localStorage.getItem('gemini_api_key');
    if (!key) {
      setIsKeyModalOpen(true);
    } else {
      setHasKey(true);
    }
  }, []);

  // --- Error & Reset Helpers ---
  const handleError = (e: unknown, fallbackMsg: string, fallbackState?: AppState) => {
    console.error(e);
    if (e instanceof AppError) {
      setErrorMsg(e.userMessage);
      setErrorType(e.type);
      if (e.type === ErrorType.AUTH) setIsKeyModalOpen(true);
    } else {
      setErrorMsg(fallbackMsg);
      setErrorType(ErrorType.UNKNOWN);
    }
    if (fallbackState !== undefined) setAppState(fallbackState);
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setAnalysisResult(null);
    setContentPlan(null);
    setEditedPlanItems([]);
    setMarketAnalysis(null);
    setContentStrategy(null);
    setErrorMsg("");
    setErrorType(null);
    setIsInputExpanded(true);
  };

  // --- File Handler ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > FILE_LIMITS.MAX_IMAGE_SIZE) {
        setErrorMsg(`檔案大小超過限制（最大 ${FILE_LIMITS.MAX_IMAGE_SIZE_MB}MB），請壓縮圖片後再試。`);
        setErrorType(ErrorType.VALIDATION);
        return;
      }

      if (!(FILE_LIMITS.ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
        setErrorMsg(`不支援的檔案類型。請上傳 JPG、PNG 或 WebP 格式的圖片。`);
        setErrorType(ErrorType.VALIDATION);
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setImagePreview(ev.target.result as string);
      };
      reader.onerror = () => {
        setErrorMsg('圖片讀取失敗，請稍候再試。');
        setErrorType(ErrorType.VALIDATION);
      };
      reader.readAsDataURL(file);

      // Reset results but keep inputs
      setAnalysisResult(null);
      setContentPlan(null);
      setEditedPlanItems([]);
      setMarketAnalysis(null);
      setContentStrategy(null);
      setAppState(AppState.IDLE);
      setErrorMsg("");
      setErrorType(null);
      setIsInputExpanded(true);
    }
  };

  // --- Phase 1: Analyze ---
  const handleAnalyze = async () => {
    if (!selectedFile) return;
    if (!hasKey) { setIsKeyModalOpen(true); return; }

    const nameValidation = validateProductName(productName);
    const contextValidation = validateBrandContext(brandContext);
    if (!nameValidation.valid || !contextValidation.valid) {
      setInputErrors({ productName: nameValidation.error, brandContext: contextValidation.error });
      return;
    }

    setInputErrors({});
    setErrorMsg("");
    setErrorType(null);
    setAppState(AppState.ANALYZING);

    try {
      const result = await analyzeProductImage(selectedFile, productName, brandContext);
      setAnalysisResult(result);
      setAppState(AppState.RESULTS);
      setIsInputExpanded(false);
    } catch (e) {
      handleError(e, "分析過程中發生了意外錯誤，請稍候再試。", AppState.ERROR);
    }
  };

  // --- Phase 2: Generate Plan ---
  const handleGeneratePlan = async () => {
    if (!analysisResult) return;
    const route = analysisResult.marketing_routes[activeRouteIndex];
    const analysis = analysisResult.product_analysis;

    const refCopyValidation = validateRefCopy(refCopy);
    if (!refCopyValidation.valid) {
      setInputErrors({ refCopy: refCopyValidation.error });
      return;
    }

    setInputErrors({});
    setErrorMsg("");
    setErrorType(null);
    setAppState(AppState.PLANNING);

    try {
      const plan = await generateContentPlan(route, analysis, refCopy, brandContext);
      setContentPlan(plan);
      setEditedPlanItems(plan.items);
      setAppState(AppState.SUITE_READY);
    } catch (e) {
      handleError(e, "內容規劃失敗，請稍候再試。", AppState.RESULTS);
    }
  };

  // --- Phase 3: Market Analysis ---
  const handleGenerateMarketAnalysis = async () => {
    if (!analysisResult || !imagePreview) return;

    setErrorMsg("");
    setErrorType(null);
    setAppState(AppState.ANALYZING_MARKET);

    try {
      const selectedRoute = analysisResult.marketing_routes[activeRouteIndex];
      const analysis = await generateMarketAnalysis(productName, selectedRoute, imagePreview, marketRegion);
      setMarketAnalysis(analysis);
      setAppState(AppState.MARKET_READY);
    } catch (e) {
      handleError(e, "市場分析失敗，請稍候再試。", AppState.SUITE_READY);
    }
  };

  // --- Phase 4: Content Strategy ---
  const handleGenerateContentStrategy = async () => {
    if (!marketAnalysis) return;

    setErrorMsg("");
    setErrorType(null);
    setAppState(AppState.ANALYZING_CONTENT);

    try {
      const selectedRoute = analysisResult!.marketing_routes[activeRouteIndex];

      let imageFileNames: Map<string, string> | undefined;
      let imageDescriptions: Map<string, string> | undefined;

      if (phase2GeneratedImages.size > 0 && editedPlanItems.length > 0) {
        const generatedImageIds = new Set(phase2GeneratedImages.keys());
        imageFileNames = generateFileNameMap(editedPlanItems);
        imageDescriptions = generateImageDescriptionMap(editedPlanItems, generatedImageIds);

        const filteredFileNames = new Map<string, string>();
        imageFileNames.forEach((filename, itemId) => {
          if (generatedImageIds.has(itemId)) filteredFileNames.set(itemId, filename);
        });
        imageFileNames = filteredFileNames;
      }

      const strategy = await generateContentStrategy(
        marketAnalysis, productName, selectedRoute, imageFileNames, imageDescriptions
      );
      setContentStrategy(strategy);
      setAppState(AppState.CONTENT_READY);
    } catch (e) {
      handleError(e, "內容策略生成失敗，請稍候再試。", AppState.MARKET_READY);
    }
  };

  // --- Language ---
  const handleLanguageModeChange = (mode: LanguageMode) => {
    if (mode === LanguageMode.EN) return; // English mode is WIP
    setLanguageMode(mode);
    setLanguageModeState(mode);
  };

  // --- Download Handlers (using shared utility) ---
  const handleDownloadReport = () => {
    if (!analysisResult || !contentPlan) return;
    const textReport = generateFullReport(
      analysisResult.product_analysis, analysisResult.marketing_routes,
      activeRouteIndex, contentPlan, editedPlanItems
    );
    downloadTextFile(textReport, `PRO_Strategy_Report_${analysisResult.product_analysis.name.replace(/\s+/g, '_')}.txt`);
  };

  const handleDownloadPhase1Report = () => {
    if (!analysisResult) return;
    const textReport = generatePhase1Report(analysisResult, activeRouteIndex);
    downloadTextFile(textReport, `Phase1_視覺策略報告_${analysisResult.product_analysis.name.replace(/\s+/g, '_')}.txt`);
  };

  const handleDownloadPhase3Report = () => {
    if (!marketAnalysis) return;
    const textReport = generatePhase3Report(marketAnalysis, productName);
    downloadTextFile(textReport, `Phase3_市場分析報告_${productName.replace(/\s+/g, '_')}.txt`);
  };

  const handleDownloadPhase4Report = () => {
    if (!contentStrategy) return;
    const textReport = generatePhase4Report(contentStrategy, productName);
    downloadTextFile(textReport, `Phase4_內容策略報告_${productName.replace(/\s+/g, '_')}.txt`);
  };

  // --- Route Selection ---
  const handleRouteChange = (idx: number) => {
    setActiveRouteIndex(idx);
    setContentPlan(null);
    setEditedPlanItems([]);
    setMarketAnalysis(null);
    setContentStrategy(null);
    if (appState === AppState.SUITE_READY) setAppState(AppState.RESULTS);
  };

  // --- Phase visibility checks ---
  const isPhaseResultsVisible = appState === AppState.RESULTS || appState === AppState.PLANNING ||
    appState === AppState.SUITE_READY || appState === AppState.ANALYZING_MARKET ||
    appState === AppState.MARKET_READY || appState === AppState.ANALYZING_CONTENT ||
    appState === AppState.CONTENT_READY;

  const isPhase3Visible = (appState === AppState.SUITE_READY || appState === AppState.ANALYZING_MARKET ||
    appState === AppState.MARKET_READY || appState === AppState.ANALYZING_CONTENT ||
    appState === AppState.CONTENT_READY) && contentPlan;

  const isPhase4Visible = (appState === AppState.MARKET_READY || appState === AppState.ANALYZING_CONTENT ||
    appState === AppState.CONTENT_READY) && marketAnalysis;

  const isPhase5Visible = appState === AppState.CONTENT_READY && contentStrategy;

  // --- Render Phase 1 Results ---
  const renderPhase1Results = () => {
    if (!analysisResult || !imagePreview) return null;
    const activeRoute = analysisResult.marketing_routes[activeRouteIndex];

    return (
      <div className="w-full max-w-6xl mx-auto px-4 pb-20">
        <ProductCard analysis={analysisResult.product_analysis} imageSrc={imagePreview} />

        {/* Route Selection */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex-1">
                Phase 1: 視覺策略選擇 / Select Concept
              </h2>
              {analysisResult?._debugPrompt && (
                <button
                  onClick={() => setDebugModalPhase(1)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1 border border-slate-200"
                >
                  <FileText className="w-3.5 h-3.5" />
                  檢視提示詞
                </button>
              )}
            </div>
            <button
              onClick={handleDownloadPhase1Report}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              下載策略報告
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysisResult.marketing_routes.map((route, idx) => (
              <button
                key={idx}
                onClick={() => handleRouteChange(idx)}
                className={`p-4 rounded-xl border text-left transition-all duration-300 ${activeRouteIndex === idx
                    ? 'bg-white text-slate-900 border-slate-300 shadow-sm scale-[1.02]'
                    : 'bg-white/60 text-slate-500 border-slate-200/50 hover:bg-white hover:text-slate-800'
                  }`}
              >
                <div className="text-xs font-bold uppercase opacity-70">Route {String.fromCharCode(65 + idx)}</div>
                <div className="font-bold text-lg">{route.route_name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Phase 1 Concept Posters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {activeRoute.image_prompts.map((promptItem, idx) => (
            <PromptCard 
              key={`p1-${activeRouteIndex}-${idx}`} 
              data={promptItem} 
              index={idx} 
              defaultRefImage={imagePreview || undefined}
            />
          ))}
        </div>

        {/* Phase 2 */}
        <Phase2Section
          activeRoute={activeRoute}
          refCopy={refCopy}
          inputErrors={inputErrors}
          appState={appState}
          contentPlan={contentPlan}
          productImageBase64={imagePreview || undefined}
          onRefCopyChange={(val) => {
            setRefCopy(val);
            if (inputErrors.refCopy) setInputErrors({ ...inputErrors, refCopy: undefined });
          }}
          onGeneratePlan={handleGeneratePlan}
          onPlanUpdate={(newItems) => setEditedPlanItems(newItems)}
          onDownloadReport={handleDownloadReport}
          onImagesGenerated={(images) => setPhase2GeneratedImages(images)}
          onOpenDebug={() => setDebugModalPhase(2)}
          debugPromptAvailable={!!contentPlan?._debugPrompt}
        />

        {/* Phase 3 */}
        {isPhase3Visible ? (
          <Phase3Section
            appState={appState}
            marketAnalysis={marketAnalysis}
            onGenerateMarketAnalysis={handleGenerateMarketAnalysis}
            onOpenDebug={() => setDebugModalPhase(3)}
            debugPromptAvailable={!!marketAnalysis?._debugPrompt}
            productName={productName}
            region={marketRegion}
            onRegionChange={setMarketRegion}
            onDownloadPhase3Report={handleDownloadPhase3Report}
          />
        ) : (
          <LockedPhaseCard
            phaseNumber={3}
            title="本地市場定位與競品分析"
            description="採用即時 Google 搜尋檢索特定市場的競品動態，解讀在地文化洞察，明確產品核心優勢與買家人物誌（Buyer Persona）。"
            isLoading={appState === AppState.ANALYZING_MARKET}
            loadingMessage="正在透過 Google Search 檢索並分析本地市場數據..."
            previewContent={<Phase3Preview />}
          />
        )}

        {/* Phase 4 */}
        {isPhase4Visible ? (
          <Phase4Section
            appState={appState}
            contentStrategy={contentStrategy}
            onGenerateContentStrategy={handleGenerateContentStrategy}
            onOpenDebug={() => setDebugModalPhase(4)}
            debugPromptAvailable={!!contentStrategy?._debugPrompt}
            productName={productName}
            onDownloadPhase4Report={handleDownloadPhase4Report}
          />
        ) : (
          <LockedPhaseCard
            phaseNumber={4}
            title="內容行銷與 SEO 優化"
            description="基於市場分析結果，生成 3 個行銷內容主題、長尾關鍵字佈局、互動元素建議、以及網頁生成（React + Tailwind）和簡報製作（Gamma.app）的提示詞。"
            isLoading={appState === AppState.ANALYZING_CONTENT}
            loadingMessage="正在生成專業內容策略與 SEO 優化方案..."
            previewContent={<Phase4Preview />}
          />
        )}

        {/* Phase 5 */}
        {isPhase5Visible ? (
          <Phase5Section
            productName={productName}
          />
        ) : (
          <LockedPhaseCard
            phaseNumber={5}
            title="電商 Landing Page 生成 (Ultra 限定)"
            description="電商落地頁一鍵智能配圖與 HTML 原始碼導出，為所規劃的內容策略完成最後的視覺生產落地（商業版專屬）。"
            previewContent={<Phase5Preview />}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-slate-800 selection:bg-blue-500 selection:text-white font-sans flex flex-col">
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <ApiKeyModal isOpen={isKeyModalOpen} onSave={(key: string) => { setIsKeyModalOpen(false); setHasKey(true); }} />

      {/* Header */}
      <header className="w-full py-4 border-b border-slate-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setAppState(AppState.IDLE)}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/10">
              <span className="text-white font-bold">YH</span>
            </div>
            <h1 className="text-lg font-bold text-slate-800 hidden md:block">
              YOHAKU 電商設計大師 <span className="text-blue-600 text-xs align-top ml-1">PRO</span>
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            <button onClick={() => setIsGuideOpen(true)} className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">功能導覽 v0.8</button>

            {/* Language Mode Switcher */}
            <div className="flex items-center gap-2 bg-slate-200/50 rounded-lg p-1 border border-slate-200/40">
              <button
                onClick={() => handleLanguageModeChange(LanguageMode.ZH_TW)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${languageMode === LanguageMode.ZH_TW ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
              >
                繁體中文
              </button>
              <button
                onClick={() => handleLanguageModeChange(LanguageMode.EN)}
                disabled
                className={`px-3 py-1 rounded text-xs font-bold transition-colors relative ${languageMode === LanguageMode.EN ? 'bg-blue-600 text-white' : 'text-slate-400 cursor-not-allowed opacity-50'}`}
                title="英文模式開發中"
              >
                英文
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-[8px] text-black font-bold px-1 rounded">開發中</span>
              </button>
            </div>

            <button onClick={() => setIsKeyModalOpen(true)} className="text-blue-600 hover:text-blue-500 text-sm font-bold">
              {hasKey ? '更換 API Key' : '設定 API Key'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        {/* Global Error */}
        <ErrorBanner errorMsg={errorMsg} errorType={errorType} onReset={handleReset} />

        {/* 頂部產品資料卡片 */}
        <div className="w-full max-w-4xl mx-auto mb-8 bg-white/70 rounded-3xl p-8 border border-slate-200/50 backdrop-blur-md shadow-sm">
          {!analysisResult ? (
            <div className="text-center">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
                v0.8
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 serif mb-3 leading-tight">
                打造完整的品牌視覺與電商行銷資產
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
                結合產品識別、品牌故事與競品策略。一鍵分析解鎖<br />
                視覺策略定位、社群行銷套圖企劃、本地市場分析與內容 SEO 方案。
              </p>
              <InputForm
                productName={productName}
                brandContext={brandContext}
                selectedFile={selectedFile}
                imagePreview={imagePreview}
                inputErrors={inputErrors}
                appState={appState}
                onProductNameChange={(val) => {
                  setProductName(val);
                  if (inputErrors.productName) setInputErrors({ ...inputErrors, productName: undefined });
                }}
                onBrandContextChange={(val) => {
                  setBrandContext(val);
                  if (inputErrors.brandContext) setInputErrors({ ...inputErrors, brandContext: undefined });
                }}
                onFileChange={handleFileChange}
                onAnalyze={handleAnalyze}
              />
            </div>
          ) : (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-14 h-14 object-contain bg-white border border-slate-200/60 rounded-2xl p-1.5 shadow-xs" />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">已分析產品：{productName}</h3>
                    <p className="text-xs text-slate-500 max-w-md truncate">品牌背景：{brandContext || '未提供'}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsInputExpanded(!isInputExpanded)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200/85 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-colors shadow-xs self-start sm:self-auto"
                >
                  {isInputExpanded ? '收起產品資料' : '編輯產品資料'}
                </button>
              </div>

              {isInputExpanded && (
                <div className="mt-6 pt-6 border-t border-slate-200/60">
                  <InputForm
                    productName={productName}
                    brandContext={brandContext}
                    selectedFile={selectedFile}
                    imagePreview={imagePreview}
                    inputErrors={inputErrors}
                    appState={appState}
                    onProductNameChange={(val) => {
                      setProductName(val);
                      if (inputErrors.productName) setInputErrors({ ...inputErrors, productName: undefined });
                    }}
                    onBrandContextChange={(val) => {
                      setBrandContext(val);
                      if (inputErrors.brandContext) setInputErrors({ ...inputErrors, brandContext: undefined });
                    }}
                    onFileChange={handleFileChange}
                    onAnalyze={handleAnalyze}
                  />
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleAnalyze}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10"
                    >
                      重新執行 AI 分析
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5 階段工作流看板 (5-Phase Workflow Board) */}
        
        {/* Phase 1: 視覺策略定位 */}
        {analysisResult && imagePreview ? (
          renderPhase1Results()
        ) : (
          <LockedPhaseCard
            phaseNumber={1}
            title="視覺策略定位"
            description="分析上傳的產品圖片與品牌背景，AI 總監將自動生成 3 條不同的視覺策略路線，包含主標題、副標題、風格簡報與配圖繪圖提示詞。"
            isLoading={appState === AppState.ANALYZING}
            loadingMessage="AI 總監正在分析產品，解讀品牌視覺特徵與商業語意..."
            previewContent={<Phase1Preview />}
          />
        )}

        {/* Phase 2: 社群行銷套圖企劃 */}
        {!analysisResult && (
          <LockedPhaseCard
            phaseNumber={2}
            title="社群行銷套圖企劃"
            description="依據選定的視覺路線，一鍵規劃並生成包含 8 張社群行銷套圖的完整腳本（主圖、情境圖、痛點圖、特色圖等）與相應的英文繪圖提示詞。"
            previewContent={<Phase2Preview />}
          />
        )}

        {/* Phase 3: 本地市場定位與競品分析 */}
        {!analysisResult && (
          <LockedPhaseCard
            phaseNumber={3}
            title="本地市場分析與定位"
            description="採用即時 Google 搜尋檢索特定市場的競品動態，解讀在地文化洞察，明確產品核心優勢與買家人物誌（Buyer Persona）。"
            previewContent={<Phase3Preview />}
          />
        )}

        {/* Phase 4: 內容行銷與 SEO 優化 */}
        {!analysisResult && (
          <LockedPhaseCard
            phaseNumber={4}
            title="內容行銷與 SEO 優化"
            description="基於市場分析結果，生成 3 個行銷內容主題、長尾關鍵字佈局、互動元素建議、以及網頁生成（React + Tailwind）和簡報製作（Gamma.app）的提示詞。"
            previewContent={<Phase4Preview />}
          />
        )}

        {/* Phase 5: 電商 Landing Page 生成 (Ultra 限定) */}
        {!analysisResult && (
          <LockedPhaseCard
            phaseNumber={5}
            title="電商 Landing Page 生成 (Ultra 限定)"
            description="電商落地頁一鍵智能配圖與 HTML 原始碼導出，為所規劃的內容策略完成最後的視覺生產落地（商業版專屬）。"
            previewContent={<Phase5Preview />}
          />
        )}
      </main>

      <footer className="w-full py-6 text-center border-t border-slate-200/50 text-xs text-slate-400">
        © 2026 <span className="font-bold text-slate-500">LINUS Nice Day Japan (CHANG CHIN WEI) @linus3524</span> All Rights Reserved.
      </footer>

      <DebugPromptModal 
        isOpen={debugModalPhase !== null}
        promptContent={
          debugModalPhase === 1 ? analysisResult?._debugPrompt || null :
          debugModalPhase === 2 ? contentPlan?._debugPrompt || null :
          debugModalPhase === 3 ? marketAnalysis?._debugPrompt || null :
          debugModalPhase === 4 ? contentStrategy?._debugPrompt || null :
          null
        }
        phaseName={`Phase ${debugModalPhase}`}
        onClose={() => setDebugModalPhase(null)}
      />
    </div>
  );
};

export default App;
