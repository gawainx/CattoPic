// 通用类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse {
  data?: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
  };
}

// 标签类型
export interface Tag {
  name: string;
  count: number;
}

// 图片相关类型
export interface ImageFile {
  id: string;
  originalName: string;
  uploadTime: string;
  expiryTime?: string;
  orientation: 'landscape' | 'portrait';
  tags: string[];
  format: string;
  width: number;
  height: number;
  paths: {
    original: string;
    webp: string;
    avif: string;
  };
  sizes: {
    original: number;
    webp: number;
    avif: number;
  };
  urls: {
    original: string;
    webp: string;
    avif: string;
  };
}

export interface ImageListResponse {
  images: ImageFile[];
  page: number;
  totalPages: number;
  total: number;
}

export interface ImageFilterState {
  format: string;
  orientation: string;
  tag: string;
}

// 组件 Props 类型
export interface ImageCardProps {
  image: ImageFile;
  onClick: () => void;
}

export interface ImageModalProps {
  image: ImageFile | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

export interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (apiKey: string) => void;
}

export interface ImageFiltersProps {
  onFilterChange: (format: string, orientation: string, tag: string) => void;
}

// 上传结果类型定义
export interface UploadResult {
  id: string;
  status: "success" | "error";
  originalName?: string;
  clientFileId?: string;
  format?: string;
  urls?: {
    original: string;
    webp: string;
    avif: string;
  };
  orientation?: 'landscape' | 'portrait';
  tags?: string[];
  sizes?: {
    original: number;
    webp: number;
    avif: number;
  };
  expiryTime?: string;
  error?: string;
}

export interface UploadResponse {
  results: UploadResult[];
}

// 状态消息类型
export interface StatusMessage {
  type: "success" | "error" | "warning";
  message: string;
}

// 配置类型
export interface ConfigSettings {
  maxUploadCount: number;
  maxFileSize: number;
  supportedFormats: string[];
  imageQuality: number;
}
