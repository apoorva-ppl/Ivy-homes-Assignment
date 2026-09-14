export interface Listing {
  listing_id: string;
  listing_url?: string;
  apartment_name?: string;
  locality?: string;
  property_type?: string;
  bedroom?: number;
  bathroom?: number;
  balcony?: number;
  floor?: number;
  total_floors?: number;
  furnishing?: string;
  facing_direction?: string;
  price?: number;
  carpet_area?: number;
  super_built_up_area?: number;
  latitude?: number;
  longitude?: number;
  posted_by?: string;
  posted_by_name?: string;
  posted_by_contact?: string;
  project_id?: string;
  description?: string;
  posted_at?: string;
  is_verified?: boolean;
  is_live?: boolean;
  [key: string]: unknown;
}

export interface Rental {
  listing_id: string;
  title?: string;
  apartment_name?: string;
  locality?: string;
  bedroom?: number;
  bathroom?: number;
  furnishing?: string;
  price?: number;
  deposit?: number;
  maintenance?: number;
  carpet_area?: number;
  posted_by_contact?: string;
  description?: string;
  posted_at?: string;
  [key: string]: unknown;
}

export interface Project {
  project_id: string;
  apartment_name?: string;
  developer_name?: string;
  locality?: string;
  project_status?: string;
  total_units?: number;
  total_towers?: number;
  launch_date?: string;
  possession_date?: string;
  rera_number?: string;
  min_area_sqft?: number;
  max_area_sqft?: number;
  total_listings?: number;
  price_min?: number;
  price_max?: number;
  amenities?: string[];
  latitude?: number;
  longitude?: number;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  page_size: number;
  results: T[];
}

export interface User {
  [key: string]: unknown;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_url: string;
  user: { email: string };
}

export interface AnalyticsSummary {
  city?: string;
  total_listings?: number;
  median_price?: number;
  median_price_per_sqft?: number;
  by_locality?: {
    locality: string;
    count?: number;
    median_price?: number;
    [k: string]: unknown;
  }[];
  by_bhk?: {
    bhk?: number | string;
    bedroom?: number | string;
    count?: number;
    [k: string]: unknown;
  }[];
  [key: string]: unknown;
}

export interface ApiErrorBody {
  detail?: string;
}
