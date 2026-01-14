import { supabase } from '../utils/supabase';

export interface Quote {
  id: number;
  text: string;
  author: string | null;
  category: string;
  created_at: string;
}

export interface PaginatedQuotes {
  data: Quote[] | null;
  error: any;
  hasMore: boolean;
}

// Fetch quotes with pagination (cursor-based for infinite scroll)
export const fetchQuotes = async (
  from: number = 0,
  limit: number = 20,
  category?: string
): Promise<PaginatedQuotes> => {
  try {
    let query = supabase
      .from('quotes')
      .select('*')
      .order('id', { ascending: true })
      .range(from, from + limit - 1);

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching quotes:', error);
      return { data: null, error, hasMore: false };
    }

    const hasMore = data && data.length === limit;

    return { data, error: null, hasMore };
  } catch (error) {
    console.error('Error in fetchQuotes:', error);
    return { data: null, error, hasMore: false };
  }
};

// Fetch quotes by category
export const fetchQuotesByCategory = async (
  category: string,
  from: number = 0,
  limit: number = 20
): Promise<PaginatedQuotes> => {
  return fetchQuotes(from, limit, category);
};

// Search quotes by keyword or author
export const searchQuotes = async (
  query: string,
  from: number = 0,
  limit: number = 50
): Promise<PaginatedQuotes> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .or(`text.ilike.%${query}%,author.ilike.%${query}%`)
      .order('id', { ascending: true })
      .range(from, from + limit - 1);

    if (error) {
      console.error('Error searching quotes:', error);
      return { data: null, error, hasMore: false };
    }

    const hasMore = data && data.length === limit;

    return { data, error: null, hasMore };
  } catch (error) {
    console.error('Error in searchQuotes:', error);
    return { data: null, error, hasMore: false };
  }
};

// Get quote of the day (deterministic based on date)
export const getQuoteOfTheDay = async (): Promise<{ data: Quote | null; error: any }> => {
  try {
    // Get total count of quotes
    const { count, error: countError } = await supabase
      .from('quotes')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting quote count:', countError);
      return { data: null, error: countError };
    }

    if (!count || count === 0) {
      return { data: null, error: 'No quotes available' };
    }

    // Deterministic selection based on date
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const quoteIndex = dayIndex % count;

    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('id', { ascending: true })
      .range(quoteIndex, quoteIndex);

    if (error) {
      console.error('Error fetching quote of the day:', error);
      return { data: null, error };
    }

    return { data: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Error in getQuoteOfTheDay:', error);
    return { data: null, error };
  }
};

// Get available categories
export const getCategories = async (): Promise<{ data: string[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('category')
      .order('category');

    if (error) {
      console.error('Error fetching categories:', error);
      return { data: null, error };
    }

    // Get unique categories
    const categories = [...new Set(data?.map(item => item.category) || [])];
    return { data: categories, error: null };
  } catch (error) {
    console.error('Error in getCategories:', error);
    return { data: null, error };
  }
};

// Get quote by ID
export const getQuoteById = async (id: number): Promise<{ data: Quote | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching quote by ID:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getQuoteById:', error);
    return { data: null, error };
  }
};