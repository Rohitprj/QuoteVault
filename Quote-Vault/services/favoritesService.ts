import { supabase } from '../utils/supabase';
import { Quote } from './quoteService';

export interface Favorite {
  id: number;
  user_id: string;
  quote_id: number;
  created_at: string;
}

// Toggle favorite status for a quote
export const toggleFavorite = async (
  userId: string,
  quoteId: number,
  isCurrentlyFavorited: boolean
): Promise<{ success: boolean; error: any }> => {
  try {
    if (isCurrentlyFavorited) {
      // Remove from favorites
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .match({ user_id: userId, quote_id: quoteId });

      if (error) {
        console.error('Error removing favorite:', error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('user_favorites')
        .insert({ user_id: userId, quote_id: quoteId });

      if (error) {
        console.error('Error adding favorite:', error);
        return { success: false, error };
      }

      return { success: true, error: null };
    }
  } catch (error) {
    console.error('Error in toggleFavorite:', error);
    return { success: false, error };
  }
};

// Check if a quote is favorited by user
export const checkFavoriteStatus = async (
  userId: string,
  quoteId: number
): Promise<{ isFavorited: boolean; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .match({ user_id: userId, quote_id: quoteId })
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is expected
      console.error('Error checking favorite status:', error);
      return { isFavorited: false, error };
    }

    return { isFavorited: !!data, error: null };
  } catch (error) {
    console.error('Error in checkFavoriteStatus:', error);
    return { isFavorited: false, error };
  }
};

// Get all favorited quotes for a user with full quote data
export const getUserFavorites = async (
  userId: string,
  from: number = 0,
  limit: number = 50
): Promise<{ data: Quote[] | null; error: any; hasMore: boolean }> => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        quote_id,
        quotes!inner (
          id,
          text,
          author,
          category,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (error) {
      console.error('Error fetching user favorites:', error);
      return { data: null, error, hasMore: false };
    }

    // Transform the data to match Quote interface
    const favorites: Quote[] = data?.map((item: any) => ({
      id: item.quotes.id,
      text: item.quotes.text,
      author: item.quotes.author,
      category: item.quotes.category,
      created_at: item.quotes.created_at,
    })) || [];

    const hasMore = data && data.length === limit;

    return { data: favorites, error: null, hasMore };
  } catch (error) {
    console.error('Error in getUserFavorites:', error);
    return { data: null, error, hasMore: false };
  }
};

// Get favorite quote IDs for a user (for checking multiple quotes at once)
export const getFavoriteQuoteIds = async (
  userId: string
): Promise<{ data: number[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('quote_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching favorite quote IDs:', error);
      return { data: null, error };
    }

    const quoteIds = data?.map(item => item.quote_id) || [];
    return { data: quoteIds, error: null };
  } catch (error) {
    console.error('Error in getFavoriteQuoteIds:', error);
    return { data: null, error };
  }
};

// Get favorites count for a user
export const getFavoritesCount = async (
  userId: string
): Promise<{ count: number; error: any }> => {
  try {
    const { count, error } = await supabase
      .from('user_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting favorites count:', error);
      return { count: 0, error };
    }

    return { count: count || 0, error: null };
  } catch (error) {
    console.error('Error in getFavoritesCount:', error);
    return { count: 0, error };
  }
};