import { supabase } from '../utils/supabase';

export const seedQuotes = [
  // Motivation (25 quotes)
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Motivation" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Motivation" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Motivation" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "Motivation" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "Motivation" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", category: "Motivation" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", category: "Motivation" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "Motivation" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: "Motivation" },
  { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman", category: "Motivation" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers", category: "Motivation" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "Motivation" },
  { text: "Everything you can imagine is real.", author: "Pablo Picasso", category: "Motivation" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous", category: "Motivation" },
  { text: "Dream it. Wish it. Do it.", author: "Anonymous", category: "Motivation" },
  { text: "Whatever you are, be a good one.", author: "Abraham Lincoln", category: "Motivation" },
  { text: "Never give up on a dream just because of the time it will take to accomplish it.", author: "Anonymous", category: "Motivation" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", category: "Motivation" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", category: "Motivation" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson", category: "Motivation" },
  { text: "Go confidently in the direction of your dreams.", author: "Henry David Thoreau", category: "Motivation" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis", category: "Motivation" },
  { text: "The mind is everything. What you think you become.", author: "Buddha", category: "Motivation" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", category: "Motivation" },

  // Love (20 quotes)
  { text: "Love is not just looking at each other, it's looking in the same direction.", author: "Antoine de Saint-Exupéry", category: "Love" },
  { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn", category: "Love" },
  { text: "Love recognizes no barriers.", author: "Maya Angelou", category: "Love" },
  { text: "Where there is love there is life.", author: "Mahatma Gandhi", category: "Love" },
  { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle", category: "Love" },
  { text: "The greatest happiness of life is the conviction that we are loved.", author: "Victor Hugo", category: "Love" },
  { text: "Love is when the other person's happiness is more important than your own.", author: "H. Jackson Brown Jr.", category: "Love" },
  { text: "A successful marriage requires falling in love many times, always with the same person.", author: "Mignon McLaughlin", category: "Love" },
  { text: "Love doesn't make the world go 'round. Love is what makes the ride worthwhile.", author: "Franklin P. Jones", category: "Love" },
  { text: "Being deeply loved by someone gives you strength.", author: "Lao Tzu", category: "Love" },
  { text: "Love is the only force capable of transforming an enemy into a friend.", author: "Martin Luther King Jr.", category: "Love" },
  { text: "The heart has its reasons which reason knows not.", author: "Blaise Pascal", category: "Love" },
  { text: "Love cures people—both the ones who give it and the ones who receive it.", author: "Karl A. Menninger", category: "Love" },
  { text: "True love is eternal, infinite, and always like itself.", author: "Honore de Balzac", category: "Love" },
  { text: "Love is friendship that has caught fire.", author: "Joseph Campbell", category: "Love" },
  { text: "The most important thing in life is to learn how to give out love, and to let it come in.", author: "Morrie Schwartz", category: "Love" },
  { text: "Love is not finding someone to live with, it's finding someone you can't live without.", author: "Rafael Ortiz", category: "Love" },
  { text: "There is no remedy for love but to love more.", author: "Henry David Thoreau", category: "Love" },
  { text: "Love makes your soul crawl out from its hiding place.", author: "Zora Neale Hurston", category: "Love" },
  { text: "To love and be loved is to feel the sun from both sides.", author: "David Viscott", category: "Love" },

  // Success (20 quotes)
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Success" },
  { text: "The road to success and the road to failure are almost exactly the same.", author: "Colin R. Davis", category: "Success" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", category: "Success" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", category: "Success" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson", category: "Success" },
  { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon", category: "Success" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill", category: "Success" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer", category: "Success" },
  { text: "Success consists of going from failure to failure without loss of enthusiasm.", author: "Winston Churchill", category: "Success" },
  { text: "The secret of success is to do the common thing uncommonly well.", author: "John D. Rockefeller", category: "Success" },
  { text: "Success is not in what you have, but who you are.", author: "Bo Bennett", category: "Success" },
  { text: "Try not to become a man of success. Rather become a man of value.", author: "Albert Einstein", category: "Success" },
  { text: "Success is liking yourself, liking what you do, and liking how you do it.", author: "Maya Angelou", category: "Success" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee", category: "Success" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier", category: "Success" },
  { text: "Success is not measured by what you accomplish, but by the opposition you have encountered.", author: "Anonymous", category: "Success" },
  { text: "The difference between a successful person and others is not a lack of strength.", author: "Anonymous", category: "Success" },
  { text: "Success is peace of mind which is a direct result of self-satisfaction in knowing you did your best.", author: "John Wooden", category: "Success" },
  { text: "Success is getting what you want. Happiness is wanting what you get.", author: "Dale Carnegie", category: "Success" },
  { text: "The key to success is to focus our conscious mind on things we desire.", author: "Brian Tracy", category: "Success" },

  // Wisdom (20 quotes)
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "Wisdom" },
  { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix", category: "Wisdom" },
  { text: "The wise man does not lay up his own treasures.", author: "Anonymous", category: "Wisdom" },
  { text: "Wisdom is the right use of knowledge. To know is not to be wise.", author: "Charles Spurgeon", category: "Wisdom" },
  { text: "The fool wonders, the wise man asks.", author: "Benjamin Disraeli", category: "Wisdom" },
  { text: "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.", author: "Albert Einstein", category: "Wisdom" },
  { text: "The wise learn many things from their enemies.", author: "Aristophanes", category: "Wisdom" },
  { text: "It is wiser to find out than to suppose.", author: "Mark Twain", category: "Wisdom" },
  { text: "Wisdom begins in wonder.", author: "Socrates", category: "Wisdom" },
  { text: "The wise man sees in the misfortune of others what he should avoid.", author: "Anonymous", category: "Wisdom" },
  { text: "Wisdom is the daughter of experience.", author: "Leonardo da Vinci", category: "Wisdom" },
  { text: "A wise man can learn more from a foolish question than a fool can learn from a wise answer.", author: "Bruce Lee", category: "Wisdom" },
  { text: "The wise man does at once what the fool does finally.", author: "Niccolò Machiavelli", category: "Wisdom" },
  { text: "Wisdom is knowing when to speak your mind and when to mind your speech.", author: "Anonymous", category: "Wisdom" },
  { text: "The wiser you get, the less you need to prove.", author: "Anonymous", category: "Wisdom" },
  { text: "Wisdom comes from experience. Experience is often a result of lack of wisdom.", author: "Terry Pratchett", category: "Wisdom" },
  { text: "The heart of the wise is in the house of mourning.", author: "Anonymous", category: "Wisdom" },
  { text: "Wisdom is the power to put our time and our knowledge to the proper use.", author: "Thomas J. Watson", category: "Wisdom" },
  { text: "The wise man avoids evil by anticipating it.", author: "Anonymous", category: "Wisdom" },
  { text: "Wisdom consists of the anticipation of consequences.", author: "Norman Cousins", category: "Wisdom" },

  // Humor (20 quotes)
  { text: "I told my wife she was drawing her eyebrows too high. She looked surprised.", author: "Anonymous", category: "Humor" },
  { text: "I'm reading a book on anti-gravity. It's impossible to put down!", author: "Anonymous", category: "Humor" },
  { text: "I used to play piano by ear, but now I use my hands.", author: "Anonymous", category: "Humor" },
  { text: "Why don't scientists trust atoms? Because they make up everything!", author: "Anonymous", category: "Humor" },
  { text: "I told my computer I needed a break, and now it won't stop sending me Kit Kat ads.", author: "Anonymous", category: "Humor" },
  { text: "Parallel lines have so much in common. It's a shame they'll never meet.", author: "Anonymous", category: "Humor" },
  { text: "I have a joke about trickle-down economics, but 99% of you won't get it.", author: "Anonymous", category: "Humor" },
  { text: "My wife accused me of cheating. I told her she was starting to sound like my phone's predictive text.", author: "Anonymous", category: "Humor" },
  { text: "I'm so good at sleeping that I can do it with my eyes closed.", author: "Anonymous", category: "Humor" },
  { text: "I asked my dog what's two minus two. He said nothing.", author: "Anonymous", category: "Humor" },
  { text: "My therapist says I have a preoccupation with vengeance. We'll see about that.", author: "Anonymous", category: "Humor" },
  { text: "I threw a boomerang at a ghost. It came back to haunt me.", author: "Anonymous", category: "Humor" },
  { text: "I have a joke about trickle-down economics, but 99% of you won't get it.", author: "Anonymous", category: "Humor" },
  { text: "My math teacher called me average. How mean!", author: "Anonymous", category: "Humor" },
  { text: "I used to be a baker, but I couldn't make enough dough.", author: "Anonymous", category: "Humor" },
  { text: "I'm reading a book on teleportation. It's bound to take me places.", author: "Anonymous", category: "Humor" },
  { text: "I told my wife she was drawing her eyebrows too high. She looked surprised.", author: "Anonymous", category: "Humor" },
  { text: "Why did the scarecrow win an award? Because he was outstanding in his field!", author: "Anonymous", category: "Humor" },
  { text: "I have a joke about trickle-down economics, but 99% of you won't get it.", author: "Anonymous", category: "Humor" },
  { text: "Time flies like an arrow; fruit flies like a banana.", author: "Groucho Marx", category: "Humor" }
];

// Function to seed the database
export const seedDatabase = async () => {
  try {
    console.log('Seeding quotes database...');

    // Insert quotes in batches to avoid timeout
    const batchSize = 10;
    for (let i = 0; i < seedQuotes.length; i += batchSize) {
      const batch = seedQuotes.slice(i, i + batchSize);
      const { error } = await supabase
        .from('quotes')
        .insert(batch);

      if (error) {
        console.error(`Error seeding batch ${i / batchSize + 1}:`, error);
        return false;
      }

      console.log(`Seeded batch ${i / batchSize + 1}/${Math.ceil(seedQuotes.length / batchSize)}`);
    }

    console.log('Database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};

// Uncomment the line below to run seeding (run this in development only)
// seedDatabase();