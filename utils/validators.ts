/**
 * 使用 Zod 進行執行時型別驗證
 */
import { z } from 'zod';
import { ProductAnalysis, MarketingRoute, DirectorOutput, ContentItem, ContentPlan, MarketAnalysis, ContentStrategy } from '../types';
import { AppError, ErrorType } from './errorHandler';

// ProductAnalysis Schema - 使用更寬鬆的驗證
export const ProductAnalysisSchema = z.object({
  name: z.string().min(1, '產品名稱不能為空'),
  visual_description: z.string().min(5, '視覺描述至少需要 5 個字元'), // 降低要求
  key_features_zh: z.string().min(5, '核心賣點至少需要 5 個字元'), // 降低要求
});

// PromptData Schema - 使用更寬鬆的驗證
export const PromptDataSchema = z.object({
  prompt_en: z.string().min(20, '提示詞至少需要 20 個字元'), // 降低要求
  summary_zh: z.string().optional().default(''), // 允許省略或空字串
});

// MarketingRoute Schema - 使用更寬鬆的驗證
export const MarketingRouteSchema = z.object({
  route_name: z.string().min(1).max(50), // 放寬長度限制
  headline_zh: z.string().min(1).max(100), // 放寬長度限制
  subhead_zh: z.string().min(1).max(200), // 放寬長度限制
  style_brief_zh: z.string().min(5), // 降低要求
  target_audience_zh: z.string().optional(),
  visual_elements_zh: z.string().optional(),
  image_prompts: z.array(PromptDataSchema).min(1).max(10), // 允許 1-10 個，不強制恰好 3 個
});

// DirectorOutput Schema - 使用更寬鬆的驗證
export const DirectorOutputSchema = z.object({
  product_analysis: ProductAnalysisSchema,
  marketing_routes: z.array(MarketingRouteSchema).min(1).max(10), // 允許 1-10 條路線
});

// ContentItem Schema - 使用更寬鬆的驗證
export const ContentItemSchema = z.object({
  id: z.string().min(1), // 放寬 ID 格式要求，只要非空即可
  type: z.enum(['main_white', 'main_lifestyle', 'story_slide']),
  ratio: z.enum(['1:1', '9:16', '16:9']),
  title_zh: z.string().min(1).max(100), // 放寬長度限制
  copy_zh: z.string().min(1).max(500), // 放寬長度限制
  visual_prompt_en: z.string().min(20).max(1000), // 放寬長度限制
  visual_summary_zh: z.string().min(1).max(200).optional().default(''), // 允許空字串或省略
});

// ContentPlan Schema - 使用更寬鬆的驗證
export const ContentPlanSchema = z.object({
  plan_name: z.string().min(1).max(200), // 放寬長度限制
  reference_analysis_summary: z.string().optional().default(''),
  items: z.array(ContentItemSchema).min(1).max(20), // 允許 1-20 個項目，不強制恰好 8 個
});

/**
 * 驗證並解析 DirectorOutput
 * 使用 safeParse 並嘗試修復常見問題
 */
export const validateDirectorOutput = (data: unknown): DirectorOutput => {
  // 先嘗試直接解析
  const result = DirectorOutputSchema.safeParse(data);
  
  if (result.success) {
    return result.data;
  }
  
  // 如果失敗，嘗試修復常見問題
  if (typeof data === 'object' && data !== null) {
    const fixed = { ...data } as Record<string, unknown>;
    
    // 確保 marketing_routes 是陣列
    if (!Array.isArray(fixed.marketing_routes)) {
      fixed.marketing_routes = [];
    }
    
    // 確保每個 route 都有 image_prompts
    if (Array.isArray(fixed.marketing_routes)) {
      fixed.marketing_routes = fixed.marketing_routes.map((route: unknown) => {
        if (typeof route === 'object' && route !== null) {
          const routeObj = route as Record<string, unknown>;
          if (!Array.isArray(routeObj.image_prompts)) {
            routeObj.image_prompts = [];
          }
          // 確保每個 prompt 都有 summary_zh
          if (Array.isArray(routeObj.image_prompts)) {
            routeObj.image_prompts = routeObj.image_prompts.map((prompt: unknown) => {
              if (typeof prompt === 'object' && prompt !== null) {
                const promptObj = prompt as Record<string, unknown>;
                if (!promptObj.summary_zh) {
                  promptObj.summary_zh = '';
                }
                return promptObj;
              }
              return prompt;
            });
          }
          return routeObj;
        }
        return route;
      });
    }
    
    // 再次嘗試解析修復後的資料
    const retryResult = DirectorOutputSchema.safeParse(fixed);
    if (retryResult.success) {
      console.warn('驗證失敗後成功修復資料格式');
      return retryResult.data;
    }
  }
  
  // 如果還是失敗，記錄詳細錯誤並拋出
  const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
  console.error('API 回應格式驗證失敗：', result.error);
  console.error('原始資料：', JSON.stringify(data, null, 2));
  throw new Error(`API 回應格式驗證失敗：\n${errors}`);
};

/**
 * 驗證並解析 ContentPlan
 * 使用 safeParse 並嘗試修復常見問題
 */
export const validateContentPlan = (data: unknown): ContentPlan => {
  // 先嘗試直接解析
  const result = ContentPlanSchema.safeParse(data);
  
  if (result.success) {
    return result.data;
  }
  
  // 如果失敗，嘗試修復常見問題
  if (typeof data === 'object' && data !== null) {
    const fixed = { ...data } as Record<string, unknown>;
    
    // 確保 items 是陣列
    if (!Array.isArray(fixed.items)) {
      fixed.items = [];
    }
    
    // 修復每個 item 的常見問題
    if (Array.isArray(fixed.items)) {
      fixed.items = fixed.items.map((item: unknown, index: number) => {
        if (typeof item === 'object' && item !== null) {
          const itemObj = item as Record<string, unknown>;
          
          // 如果沒有 id，自動生成
          if (!itemObj.id || typeof itemObj.id !== 'string') {
            const typeMap: Record<string, string> = {
              'main_white': 'white',
              'main_lifestyle': 'lifestyle',
              'story_slide': index === 0 ? 'hook' : 
                            index === 1 ? 'problem' :
                            index === 2 ? 'solution' :
                            index === 3 ? 'features' :
                            index === 4 ? 'trust' : 'cta'
            };
            const itemType = (itemObj.type as string) || 'story_slide';
            itemObj.id = `img_${index + 1}_${typeMap[itemType] || 'item'}`;
          }
          
          // 確保 type 存在
          if (!itemObj.type || !['main_white', 'main_lifestyle', 'story_slide'].includes(itemObj.type as string)) {
            // 根據 index 推斷 type
            if (index === 0) itemObj.type = 'main_white';
            else if (index === 1) itemObj.type = 'main_lifestyle';
            else itemObj.type = 'story_slide';
          }
          
          // 確保 ratio 存在
          if (!itemObj.ratio || !['1:1', '9:16', '16:9'].includes(itemObj.ratio as string)) {
            itemObj.ratio = itemObj.type === 'story_slide' ? '9:16' : '1:1';
          }
          
          // 確保字串欄位存在且非空
          if (!itemObj.title_zh || typeof itemObj.title_zh !== 'string') {
            itemObj.title_zh = `項目 ${index + 1}`;
          }
          if (!itemObj.copy_zh || typeof itemObj.copy_zh !== 'string') {
            itemObj.copy_zh = '';
          }
          if (!itemObj.visual_prompt_en || typeof itemObj.visual_prompt_en !== 'string') {
            itemObj.visual_prompt_en = '';
          }
          if (!itemObj.visual_summary_zh || typeof itemObj.visual_summary_zh !== 'string') {
            itemObj.visual_summary_zh = '';
          }
          
          return itemObj;
        }
        return item;
      });
    }
    
    // 確保 plan_name 存在
    if (!fixed.plan_name || typeof fixed.plan_name !== 'string') {
      fixed.plan_name = '內容企劃';
    }
    
    // 再次嘗試解析修復後的資料
    const retryResult = ContentPlanSchema.safeParse(fixed);
    if (retryResult.success) {
      console.warn('內容企劃驗證失敗後成功修復資料格式');
      return retryResult.data;
    }
  }
  
  // 如果還是失敗，記錄詳細錯誤並拋出
  const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
  console.error('內容企劃格式驗證失敗：', result.error);
  console.error('原始資料：', JSON.stringify(data, null, 2));
  throw new Error(`內容企劃格式驗證失敗：\n${errors}`);
};

/**
 * 驗證使用者輸入
 */
export const validateProductName = (name: string): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: '產品名稱不能為空' };
  }
  if (name.length > 100) {
    return { valid: false, error: '產品名稱不能超過 100 個字元' };
  }
  return { valid: true };
};

export const validateBrandContext = (context: string): { valid: boolean; error?: string } => {
  if (context.length > 5000) {
    return { valid: false, error: '品牌資訊不能超過 5000 個字元' };
  }
  return { valid: true };
};

export const validateRefCopy = (copy: string): { valid: boolean; error?: string } => {
  if (copy.length > 10000) {
    return { valid: false, error: '參考文案不能超過 10000 個字元' };
  }
  return { valid: true };
};

// --- Phase 3: Market Analysis Schemas ---

const ProductCoreValueSchema = z.object({
  mainFeatures: z.array(z.string().min(5)).min(3).max(10),
  coreAdvantages: z.array(z.string().min(5)).min(3).max(10),
  painPointsSolved: z.array(z.string().min(5)).min(3).max(10),
});

const MarketPositioningSchema = z.object({
  culturalInsights: z.string().min(50).max(500),
  consumerHabits: z.string().min(50).max(500),
  languageNuances: z.string().min(20).max(300),
  searchTrends: z.array(z.string().min(1)).min(3).max(15),
});

const CompetitorSchema = z.object({
  brandName: z.string().min(1).max(100),
  marketingStrategy: z.string().min(20).max(300),
  advantages: z.array(z.string().min(5)).min(2).max(10),
  weaknesses: z.array(z.string().min(5)).min(2).max(10),
});

const BuyerPersonaSchema = z.object({
  name: z.string().min(1).max(50),
  demographics: z.string().min(20).max(300),
  interests: z.array(z.string().min(1)).min(3).max(15),
  painPoints: z.array(z.string().min(5)).min(2).max(10),
  searchKeywords: z.array(z.string().min(1)).min(3).max(15),
});

const MarketAnalysisSchema = z.object({
  productCoreValue: ProductCoreValueSchema,
  marketPositioning: MarketPositioningSchema,
  competitors: z.array(CompetitorSchema).min(2).max(5),
  buyerPersonas: z.array(BuyerPersonaSchema).min(2).max(5),
});

// --- Phase 4: Content Strategy Schemas ---

const SEOGuidanceSchema = z.object({
  keywordDensity: z.string().min(1).max(100).optional().default('2-3%'),
  semanticKeywords: z.array(z.string()).optional().default([]),
  internalLinks: z.array(z.string()).optional().default([]),
  externalLinks: z.array(z.string()).optional().default([]),
});

const ContentTopicSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().min(1).max(3000),
  focusKeyword: z.string().min(1).max(200).optional().default(''),
  longTailKeywords: z.array(z.string()).optional().default([]),
  seoGuidance: SEOGuidanceSchema.optional().default({}),
});

const InteractiveElementSchema = z.object({
  type: z.string().min(1).max(300),
  description: z.string().min(1).max(2000),
});

const ContentStrategySchema = z.object({
  contentTopics: z.array(ContentTopicSchema).min(1).max(15),
  interactiveElements: z.array(InteractiveElementSchema).min(1).max(15),
  ctaSuggestions: z.array(z.string().min(1).max(300)).min(1).max(15),
  aiStudioPrompts: z.array(z.string().min(1).max(20000)).min(1).max(15),
  gammaPrompts: z.array(z.string().min(1).max(20000)).min(1).max(15),
});

/**
 * 驗證並解析 MarketAnalysis
 */
export const validateMarketAnalysis = (data: unknown): MarketAnalysis => {
  const result = MarketAnalysisSchema.safeParse(data);
  
  if (result.success) {
    return result.data;
  }
  
  // 嘗試修復常見問題
  if (typeof data === 'object' && data !== null) {
    const fixed = { ...data } as Record<string, unknown>;
    
    // 確保陣列存在
    if (!Array.isArray(fixed.competitors)) fixed.competitors = [];
    if (!Array.isArray(fixed.buyerPersonas)) fixed.buyerPersonas = [];
    
    // 確保 productCoreValue 存在
    if (!fixed.productCoreValue || typeof fixed.productCoreValue !== 'object') {
      fixed.productCoreValue = {
        mainFeatures: [],
        coreAdvantages: [],
        painPointsSolved: [],
      };
    }
    
    // 確保 marketPositioning 存在
    if (!fixed.marketPositioning || typeof fixed.marketPositioning !== 'object') {
      fixed.marketPositioning = {
        culturalInsights: '',
        consumerHabits: '',
        languageNuances: '',
        searchTrends: [],
      };
    }
    
    const retryResult = MarketAnalysisSchema.safeParse(fixed);
    if (retryResult.success) {
      console.warn('市場分析驗證失敗後成功修復資料格式');
      return retryResult.data;
    }
  }
  
  const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
  throw new AppError({
    type: ErrorType.VALIDATION,
    message: `市場分析格式驗證失敗：\n${errors}`,
    userMessage: "市場分析格式不正確，請再試一次。如問題持續發生，請聯繫技術支援。",
    originalError: result.error,
  });
};

/**
 * 驗證並解析 ContentStrategy
 */
export const validateContentStrategy = (data: unknown): ContentStrategy => {
  // 先嘗試直接解析
  const result = ContentStrategySchema.safeParse(data);
  
  if (result.success) {
    return result.data;
  }
  
  // 嘗試修復常見問題
  if (typeof data === 'object' && data !== null) {
    const fixed = { ...data } as Record<string, unknown>;
    
    // 欄位名稱大小寫/底線轉換相容
    if (!fixed.contentTopics && fixed.content_topics) fixed.contentTopics = fixed.content_topics;
    if (!fixed.contentTopics && fixed.topics) fixed.contentTopics = fixed.topics;

    if (!fixed.interactiveElements && fixed.interactive_elements) fixed.interactiveElements = fixed.interactive_elements;

    if (!fixed.ctaSuggestions && fixed.cta_suggestions) fixed.ctaSuggestions = fixed.cta_suggestions;
    if (!fixed.ctaSuggestions && fixed.ctas) fixed.ctaSuggestions = fixed.ctas;

    if (!fixed.aiStudioPrompts && fixed.ai_studio_prompts) fixed.aiStudioPrompts = fixed.ai_studio_prompts;
    if (!fixed.aiStudioPrompts && fixed.aiStudioPrompt) fixed.aiStudioPrompts = fixed.aiStudioPrompt;

    if (!fixed.gammaPrompts && fixed.gamma_prompts) fixed.gammaPrompts = fixed.gamma_prompts;
    if (!fixed.gammaPrompts && fixed.gammaPrompt) fixed.gammaPrompts = fixed.gammaPrompt;

    // 確保陣列存在
    if (!Array.isArray(fixed.contentTopics)) fixed.contentTopics = [];
    if (!Array.isArray(fixed.interactiveElements)) fixed.interactiveElements = [];
    if (!Array.isArray(fixed.ctaSuggestions)) fixed.ctaSuggestions = [];
    if (!Array.isArray(fixed.aiStudioPrompts)) fixed.aiStudioPrompts = [];
    if (!Array.isArray(fixed.gammaPrompts)) fixed.gammaPrompts = [];
    
    // 修復 contentTopics
    fixed.contentTopics = fixed.contentTopics.map((topic: any, idx: number) => {
      if (typeof topic !== 'object' || topic === null) {
        topic = {};
      }
      const t = { ...topic };
      
      // 屬性蛇形轉駝峰相容
      if (!t.focusKeyword && t.focus_keyword) t.focusKeyword = t.focus_keyword;
      if (!t.longTailKeywords && t.long_tail_keywords) t.longTailKeywords = t.long_tail_keywords;
      if (!t.seoGuidance && t.seo_guidance) t.seoGuidance = t.seo_guidance;

      if (typeof t.title !== 'string' || t.title.trim().length === 0) t.title = `主題 ${idx + 1}`;
      if (typeof t.description !== 'string' || t.description.trim().length === 0) t.description = `這是主題 ${idx + 1} 的行銷與內容方向描述，請參考。`;
      if (typeof t.focusKeyword !== 'string' || t.focusKeyword.trim().length === 0) t.focusKeyword = '熱門商品';
      if (!Array.isArray(t.longTailKeywords)) t.longTailKeywords = [];
      if (t.longTailKeywords.length === 0) t.longTailKeywords = ['行銷企劃', '推薦推薦'];
      
      // 確保 seoGuidance 存在
      if (typeof t.seoGuidance !== 'object' || t.seoGuidance === null) {
        t.seoGuidance = {};
      }
      const seo = { ...t.seoGuidance };
      
      if (!seo.keywordDensity && seo.keyword_density) seo.keywordDensity = seo.keyword_density;
      if (!seo.semanticKeywords && seo.semantic_keywords) seo.semanticKeywords = seo.semantic_keywords;
      if (!seo.internalLinks && seo.internal_links) seo.internalLinks = seo.internal_links;
      if (!seo.externalLinks && seo.external_links) seo.externalLinks = seo.external_links;

      if (typeof seo.keywordDensity !== 'string') seo.keywordDensity = '2-3%';
      if (!Array.isArray(seo.semanticKeywords)) seo.semanticKeywords = [];
      if (seo.semanticKeywords.length === 0) seo.semanticKeywords = ['內容行銷', 'SEO優化', '促銷方案'];
      if (!Array.isArray(seo.internalLinks)) seo.internalLinks = [];
      if (seo.internalLinks.length === 0) seo.internalLinks = ['/products', '/about'];
      if (!Array.isArray(seo.externalLinks)) seo.externalLinks = [];
      if (seo.externalLinks.length === 0) seo.externalLinks = ['https://google.com', 'https://facebook.com'];
      t.seoGuidance = seo;
      
      return t;
    });

    if (fixed.contentTopics.length === 0) {
      fixed.contentTopics = [
        {
          title: '精選商品內容策略',
          description: '專為目標受眾設計的精選商品內容，涵蓋核心價值與主要特色。',
          focusKeyword: '熱門商品',
          longTailKeywords: ['行銷企劃', '推薦推薦'],
          seoGuidance: {
            keywordDensity: '2-3%',
            semanticKeywords: ['內容行銷', 'SEO優化', '促銷方案'],
            internalLinks: ['/products', '/about'],
            externalLinks: ['https://google.com', 'https://facebook.com']
          }
        }
      ];
    }

    // 修復 interactiveElements
    fixed.interactiveElements = fixed.interactiveElements.map((elem: any, idx: number) => {
      if (typeof elem !== 'object' || elem === null) {
        elem = {};
      }
      const e = { ...elem };
      if (!e.type && e.element_type) e.type = e.element_type;
      if (typeof e.type !== 'string' || e.type.trim().length === 0) e.type = '互動小遊戲';
      if (typeof e.description !== 'string' || e.description.trim().length === 0) e.description = '提供消費者有趣的互動體驗以增加轉換率。';
      return e;
    });
    if (fixed.interactiveElements.length === 0) {
      fixed.interactiveElements = [{ type: '互動問答', description: '透過簡單的問答遊戲，幫助顧客找出最適合自己的商品規格。' }];
    }

    // 修復 ctaSuggestions
    fixed.ctaSuggestions = fixed.ctaSuggestions.map((cta: any) => {
      if (typeof cta !== 'string' || cta.trim().length === 0) return '立即購買';
      return cta;
    });
    if (fixed.ctaSuggestions.length === 0) {
      fixed.ctaSuggestions = ['立即購買', '點此了解更多', '限時優惠中'];
    }

    // 修復 aiStudioPrompts
    fixed.aiStudioPrompts = fixed.aiStudioPrompts.map((p: any) => {
      if (typeof p !== 'string' || p.trim().length < 5) return '建立一個響應式的 Landing Page，展示產品的核心賣點，包含 Hero 區塊與 CTA 按鈕。';
      return p;
    });
    if (fixed.aiStudioPrompts.length === 0) {
      fixed.aiStudioPrompts = ['建立一個響應式的 Landing Page，展示產品的核心賣點，包含 Hero 區塊與 CTA 按鈕。', '建立一個商品特點與細節說明的 Landing Page。'];
    }

    // 修復 gammaPrompts
    fixed.gammaPrompts = fixed.gammaPrompts.map((p: any) => {
      if (typeof p !== 'string' || p.trim().length < 5) return '建立一個簡報，主題為該商品在目標市場的推廣計畫，包含市場分析、競品分析與產品優勢。';
      return p;
    });
    if (fixed.gammaPrompts.length === 0) {
      fixed.gammaPrompts = ['建立一個簡報，主題為該商品在目標市場的推廣計畫，包含市場分析、競品分析與產品優勢。', '建立一個簡報，包含內容策略與社群行銷的完整規劃。'];
    }
    
    const retryResult = ContentStrategySchema.safeParse(fixed);
    if (retryResult.success) {
      console.warn('內容策略驗證失敗後成功修復資料格式');
      return retryResult.data;
    } else {
      const errors = retryResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
      console.error('內容策略自動修復後仍然驗證失敗：', retryResult.error);
      throw new AppError({
        type: ErrorType.VALIDATION,
        message: `內容策略格式驗證失敗：\n${errors}`,
        userMessage: "內容策略格式不正確，請再試一次。如問題持續發生，請聯繫技術支援。",
        originalError: retryResult.error,
      });
    }
  }
  
  const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
  throw new AppError({
    type: ErrorType.VALIDATION,
    message: `內容策略格式驗證失敗：\n${errors}`,
    userMessage: "內容策略格式不正確，請再試一次。如問題持續發生，請聯繫技術支援。",
    originalError: result.error,
  });
};
