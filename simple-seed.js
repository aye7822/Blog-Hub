const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

// Import schema
const { categories, posts, postCategories } = require('./src/lib/db/schema');

async function seed() {
  try {
    console.log('🌱 Seeding database with sample data...');

    // Check if data already exists
    const existingCategories = await db.select().from(categories).limit(1);
    if (existingCategories.length > 0) {
      console.log('⚠️  Database already contains data. Skipping seed.');
      console.log('💡 To reseed, clear the database first.');
      return;
    }

    // Insert sample categories
    const sampleCategories = [
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest trends and innovations in technology'
      },
      {
        name: 'Travel',
        slug: 'travel',
        description: 'Travel tips, destinations, and adventure stories'
      },
      {
        name: 'Food & Cooking',
        slug: 'food-cooking',
        description: 'Recipes, cooking tips, and culinary adventures'
      },
      {
        name: 'Health & Fitness',
        slug: 'health-fitness',
        description: 'Tips for healthy living and fitness routines'
      },
      {
        name: 'Personal Development',
        slug: 'personal-development',
        description: 'Self-improvement and personal growth strategies'
      },
      {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Frontend and backend development tutorials and guides'
      },
      {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Tips for better living, productivity, and work-life balance'
      }
    ];

    console.log('📂 Creating categories...');
    const createdCategories = await db.insert(categories).values(sampleCategories).returning();
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Insert sample posts
    const samplePosts = [
      {
        title: 'Getting Started with Next.js 15',
        slug: 'getting-started-nextjs-15',
        content: `# Getting Started with Next.js 15

Next.js 15 introduces exciting new features that make building React applications even better. In this comprehensive guide, we'll explore the latest improvements and how to leverage them in your projects.

## What's New in Next.js 15

### 1. Improved Performance
The latest version brings significant performance improvements, including faster build times and optimized runtime performance.

### 2. Enhanced Developer Experience
New development tools and better error messages make debugging and development more efficient.

### 3. Better SEO Support
Enhanced meta tag handling and improved server-side rendering capabilities.

## Code Example

\`\`\`javascript
import { NextPage } from 'next'

const HomePage: NextPage = () => {
  return (
    <div>
      <h1>Welcome to Next.js 15</h1>
      <p>This is the future of React development!</p>
    </div>
  )
}

export default HomePage
\`\`\`

## Conclusion

Next.js 15 represents a significant leap forward in React framework development. The improvements in performance, developer experience, and feature set make it an excellent choice for modern web applications.`,
        excerpt: 'A comprehensive guide to Next.js 15 features and improvements, covering performance enhancements, developer experience improvements, and new capabilities.',
        published: true,
        authorId: 'admin'
      },
      {
        title: 'Mastering TypeScript: Advanced Patterns and Best Practices',
        slug: 'mastering-typescript-advanced-patterns',
        content: `# Mastering TypeScript: Advanced Patterns and Best Practices

TypeScript has become the go-to language for modern web development. Let's explore advanced patterns that will make you a TypeScript expert.

## Advanced Type Patterns

### 1. Conditional Types
Conditional types allow you to create types that depend on other types:

\`\`\`typescript
type NonNullable<T> = T extends null | undefined ? never : T;
type ApiResponse<T> = T extends string ? { message: T } : { data: T };
\`\`\`

### 2. Mapped Types
Transform existing types into new ones:

\`\`\`typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};
\`\`\`

## Conclusion

Mastering these advanced TypeScript patterns will make your code more type-safe, maintainable, and expressive. Start with one pattern at a time and gradually incorporate them into your projects.`,
        excerpt: 'Advanced TypeScript patterns including conditional types, mapped types, and best practices for professional development.',
        published: true,
        authorId: 'typescript-expert'
      },
      {
        title: 'The Complete Guide to Remote Work Productivity',
        slug: 'complete-guide-remote-work-productivity',
        content: `# The Complete Guide to Remote Work Productivity

Remote work has become the new normal, but maintaining productivity from home requires intentional strategies. Here's your complete guide to thriving in a remote work environment.

## Setting Up Your Workspace

### 1. Dedicated Workspace
Create a space that's exclusively for work:
- Choose a quiet area with good lighting
- Invest in ergonomic furniture
- Keep it organized and clutter-free

### 2. Technology Setup
Ensure you have reliable technology:
- High-speed internet connection
- Quality webcam and microphone
- Backup internet options

## Time Management Strategies

### The Pomodoro Technique
Work in focused 25-minute intervals:
1. Choose a task
2. Set a timer for 25 minutes
3. Work until the timer rings
4. Take a 5-minute break
5. Repeat 4 times, then take a longer break

## Conclusion

Remote work productivity comes down to intentional habits, clear communication, and maintaining boundaries. Start with one strategy at a time and gradually build a system that works for you.`,
        excerpt: 'Essential strategies for maintaining productivity while working remotely, including workspace setup, time management, and work-life balance.',
        published: true,
        authorId: 'productivity-coach'
      },
      {
        title: 'Sustainable Living: Small Changes, Big Impact',
        slug: 'sustainable-living-small-changes-big-impact',
        content: `# Sustainable Living: Small Changes, Big Impact

Living sustainably doesn't require a complete lifestyle overhaul. Small, consistent changes can create a significant positive impact on our planet.

## Why Small Changes Matter

Every action counts when it comes to environmental conservation. Small changes, when adopted by many people, create a ripple effect that can lead to substantial environmental benefits.

## Energy Conservation

### 1. Switch to LED Bulbs
- Use 75% less energy than incandescent bulbs
- Last 25 times longer
- Save money on electricity bills

### 2. Unplug Electronics
- Use power strips with switches
- Unplug chargers when not in use
- Turn off computers at night

## Conclusion

Sustainable living is about progress, not perfection. Start with one small change and build from there. Every positive action contributes to a healthier planet for future generations.`,
        excerpt: 'Practical tips for living more sustainably through small, manageable changes that reduce environmental impact and save money.',
        published: true,
        authorId: 'eco-enthusiast'
      },
      {
        title: 'Building a Morning Routine That Actually Works',
        slug: 'building-morning-routine-that-works',
        content: `# Building a Morning Routine That Actually Works

A solid morning routine sets the tone for your entire day. Here's how to create one that's both sustainable and effective.

## Why Morning Routines Matter

The first hour of your day has a disproportionate impact on your productivity, mood, and overall well-being. A good morning routine:
- Reduces decision fatigue
- Increases energy levels
- Improves focus and concentration
- Sets a positive tone for the day

## Essential Components of a Great Morning Routine

### 1. Wake Up Consistently
- Set the same wake-up time every day
- Use natural light when possible
- Avoid snoozing the alarm
- Get up immediately when it rings

### 2. Hydrate First Thing
- Drink a glass of water upon waking
- Rehydrate after 8+ hours of sleep
- Boost metabolism and energy
- Improve cognitive function

## Conclusion

A morning routine is a powerful tool for taking control of your day and your life. Start small, be consistent, and remember that progress, not perfection, is the goal.`,
        excerpt: 'A practical guide to creating a sustainable morning routine that boosts productivity, energy, and overall well-being.',
        published: true,
        authorId: 'wellness-coach'
      },
      {
        title: 'The Psychology of Color in Web Design',
        slug: 'psychology-color-web-design',
        content: `# The Psychology of Color in Web Design

Color is one of the most powerful tools in web design, influencing user emotions, behavior, and perception. Understanding color psychology can help you create more effective and engaging websites.

## The Science of Color Psychology

### How Colors Affect the Brain
Colors trigger emotional and physiological responses:
- Red increases heart rate and creates urgency
- Blue promotes trust and calmness
- Green reduces eye strain and suggests growth
- Yellow stimulates mental activity and optimism

## Primary Colors and Their Psychological Effects

### Red
**Emotions**: Energy, passion, urgency, danger
**Use Cases**: Call-to-action buttons, sales, warnings
**Best Practices**: Use sparingly, avoid for large backgrounds

### Blue
**Emotions**: Trust, stability, professionalism, calm
**Use Cases**: Corporate websites, healthcare, technology
**Best Practices**: Great for headers and navigation

## Conclusion

Color psychology in web design is about understanding how colors affect users and using that knowledge to create more effective, engaging, and accessible websites.`,
        excerpt: 'Understanding how colors influence user behavior and emotions in web design, with practical tips for creating effective color schemes.',
        published: true,
        authorId: 'design-expert'
      }
    ];

    console.log('📝 Creating blog posts...');
    const createdPosts = await db.insert(posts).values(samplePosts).returning();
    console.log(`✅ Created ${createdPosts.length} blog posts`);

    // Link posts to categories
    console.log('🔗 Creating post-category relationships...');

    // Technology category posts
    const techCategory = createdCategories.find(cat => cat.slug === 'technology');
    const techPosts = createdPosts.filter(post => 
      post.slug === 'getting-started-nextjs-15' || 
      post.slug === 'psychology-color-web-design'
    );

    for (const post of techPosts) {
      if (techCategory) {
        await db.insert(postCategories).values({
          postId: post.id,
          categoryId: techCategory.id
        });
      }
    }

    // Web Development category posts
    const webDevCategory = createdCategories.find(cat => cat.slug === 'web-development');
    const webDevPosts = createdPosts.filter(post => 
      post.slug === 'mastering-typescript-advanced-patterns' ||
      post.slug === 'psychology-color-web-design'
    );

    for (const post of webDevPosts) {
      if (webDevCategory) {
        await db.insert(postCategories).values({
          postId: post.id,
          categoryId: webDevCategory.id
        });
      }
    }

    // Lifestyle category posts
    const lifestyleCategory = createdCategories.find(cat => cat.slug === 'lifestyle');
    const lifestylePosts = createdPosts.filter(post => 
      post.slug === 'complete-guide-remote-work-productivity' ||
      post.slug === 'sustainable-living-small-changes-big-impact' ||
      post.slug === 'building-morning-routine-that-works'
    );

    for (const post of lifestylePosts) {
      if (lifestyleCategory) {
        await db.insert(postCategories).values({
          postId: post.id,
          categoryId: lifestyleCategory.id
        });
      }
    }

    console.log('✅ Created post-category relationships');
    console.log('🎉 Database seeded successfully!');

    // Display summary
    const totalLinks = techPosts.length + webDevPosts.length + lifestylePosts.length;
    
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Posts: ${createdPosts.length}`);
    console.log(`   Post-Category Links: ${totalLinks}`);
    console.log('\n📝 Sample Content:');
    console.log('   • Technology & Web Development articles');
    console.log('   • Travel and lifestyle content');
    console.log('   • Health, fitness, and personal development');
    console.log('   • Food & cooking guides');
    console.log('   • Remote work and productivity tips');
    console.log('   • Sustainable living advice');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the seed function
seed();
