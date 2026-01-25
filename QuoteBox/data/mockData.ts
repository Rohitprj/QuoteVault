export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  isLiked?: boolean;
  authorImage?: string;
  dateAdded?: string;
}

export interface Collection {
  id: string;
  title: string;
  quoteCount: number;
  image: string;
}

export const mockQuotes: Quote[] = [
  {
    id: '1',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'SUCCESS',
    isLiked: true,
    dateAdded: '2 days ago',
  },
  {
    id: '2',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: 'HISTORICAL',
    isLiked: false,
    dateAdded: '3 days ago',
  },
  {
    id: '3',
    text: 'Your time is limited, so don\'t waste it living someone else\'s life.',
    author: 'Steve Jobs',
    category: 'SUCCESS',
    isLiked: false,
    dateAdded: '5 days ago',
  },
  {
    id: '4',
    text: 'Do what you can, with what you have, where you are.',
    author: 'Theodore Roosevelt',
    category: 'WISDOM',
    isLiked: true,
    dateAdded: '1 week ago',
  },
  {
    id: '5',
    text: 'Very little is needed to make a happy life; it is all within yourself.',
    author: 'Marcus Aurelius',
    category: 'WISDOM',
    isLiked: true,
    dateAdded: '1 week ago',
  },
];

export const mockCollections: Collection[] = [
  {
    id: '1',
    title: 'Morning Motivation',
    quoteCount: 12,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  },
  {
    id: '2',
    title: 'Stoicism',
    quoteCount: 8,
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf29a9e',
  },
  {
    id: '3',
    title: 'Love & Life',
    quoteCount: 24,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  },
  {
    id: '4',
    title: 'Career Growth',
    quoteCount: 15,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
  },
];

export const categories = ['Motivation', 'Love', 'Success', 'Wisdom', 'Life', 'Inspiration'];

export const quoteOfTheDay: Quote = {
  id: 'qotd',
  text: 'The only way to do great work is to love what you do.',
  author: 'Steve Jobs',
  category: 'SUCCESS',
  isLiked: true,
};
