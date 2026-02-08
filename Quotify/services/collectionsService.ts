import { supabase } from '../utils/supabase';
import { Quote } from './quoteService';

export interface Collection {
  id: number;
  user_id: string;
  title: string;
  created_at: string;
}

export interface CollectionWithQuotes extends Collection {
  quotes: Quote[];
  quoteCount: number;
}

// Create a new collection
export const createCollection = async (
  userId: string,
  title: string
): Promise<{ data: Collection | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .insert({ user_id: userId, title })
      .select()
      .single();

    if (error) {
      console.error('Error creating collection:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in createCollection:', error);
    return { data: null, error };
  }
};

// Get all collections for a user
export const getUserCollections = async (
  userId: string
): Promise<{ data: Collection[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user collections:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserCollections:', error);
    return { data: null, error };
  }
};

// Get collection with quotes
export const getCollectionWithQuotes = async (
  collectionId: number,
  userId: string
): Promise<{ data: CollectionWithQuotes | null; error: any }> => {
  try {
    // First get the collection
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('*')
      .eq('id', collectionId)
      .eq('user_id', userId)
      .single();

    if (collectionError) {
      console.error('Error fetching collection:', collectionError);
      return { data: null, error: collectionError };
    }

    // Then get the quotes in the collection
    const { data: collectionQuotes, error: quotesError } = await supabase
      .from('collection_quotes')
      .select(`
        quotes!inner (
          id,
          text,
          author,
          category,
          created_at
        )
      `)
      .eq('collection_id', collectionId);

    if (quotesError) {
      console.error('Error fetching collection quotes:', quotesError);
      return { data: null, error: quotesError };
    }

    const quotes: Quote[] = collectionQuotes?.map((item: any) => ({
      id: item.quotes.id,
      text: item.quotes.text,
      author: item.quotes.author,
      category: item.quotes.category,
      created_at: item.quotes.created_at,
    })) || [];

    const collectionWithQuotes: CollectionWithQuotes = {
      ...collection,
      quotes,
      quoteCount: quotes.length,
    };

    return { data: collectionWithQuotes, error: null };
  } catch (error) {
    console.error('Error in getCollectionWithQuotes:', error);
    return { data: null, error };
  }
};

// Add quote to collection
export const addQuoteToCollection = async (
  collectionId: number,
  quoteId: number,
  userId: string
): Promise<{ success: boolean; error: any }> => {
  try {
    // First verify the collection belongs to the user
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id')
      .eq('id', collectionId)
      .eq('user_id', userId)
      .single();

    if (collectionError || !collection) {
      console.error('Collection not found or access denied');
      return { success: false, error: 'Collection not found or access denied' };
    }

    // Add the quote to collection
    const { error } = await supabase
      .from('collection_quotes')
      .insert({ collection_id: collectionId, quote_id: quoteId });

    if (error) {
      console.error('Error adding quote to collection:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error in addQuoteToCollection:', error);
    return { success: false, error };
  }
};

// Remove quote from collection
export const removeQuoteFromCollection = async (
  collectionId: number,
  quoteId: number,
  userId: string
): Promise<{ success: boolean; error: any }> => {
  try {
    // First verify the collection belongs to the user
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id')
      .eq('id', collectionId)
      .eq('user_id', userId)
      .single();

    if (collectionError || !collection) {
      console.error('Collection not found or access denied');
      return { success: false, error: 'Collection not found or access denied' };
    }

    // Remove the quote from collection
    const { error } = await supabase
      .from('collection_quotes')
      .delete()
      .match({ collection_id: collectionId, quote_id: quoteId });

    if (error) {
      console.error('Error removing quote from collection:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error in removeQuoteFromCollection:', error);
    return { success: false, error };
  }
};

// Delete collection
export const deleteCollection = async (
  collectionId: number,
  userId: string
): Promise<{ success: boolean; error: any }> => {
  try {
    // Delete the collection (cascade will handle collection_quotes)
    const { error } = await supabase
      .from('collections')
      .delete()
      .match({ id: collectionId, user_id: userId });

    if (error) {
      console.error('Error deleting collection:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error in deleteCollection:', error);
    return { success: false, error };
  }
};

// Update collection title
export const updateCollectionTitle = async (
  collectionId: number,
  newTitle: string,
  userId: string
): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase
      .from('collections')
      .update({ title: newTitle })
      .match({ id: collectionId, user_id: userId });

    if (error) {
      console.error('Error updating collection title:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error in updateCollectionTitle:', error);
    return { success: false, error };
  }
};

// Check if quote is in collection
export const isQuoteInCollection = async (
  collectionId: number,
  quoteId: number,
  userId: string
): Promise<{ isInCollection: boolean; error: any }> => {
  try {
    // First verify the collection belongs to the user
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id')
      .eq('id', collectionId)
      .eq('user_id', userId)
      .single();

    if (collectionError || !collection) {
      return { isInCollection: false, error: 'Collection not found or access denied' };
    }

    // Check if quote is in collection
    const { data, error } = await supabase
      .from('collection_quotes')
      .select('id')
      .match({ collection_id: collectionId, quote_id: quoteId })
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is expected
      console.error('Error checking quote in collection:', error);
      return { isInCollection: false, error };
    }

    return { isInCollection: !!data, error: null };
  } catch (error) {
    console.error('Error in isQuoteInCollection:', error);
    return { isInCollection: false, error };
  }
};