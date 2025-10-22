import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from 'dotenv'
import { categories, posts, postCategories } from './schema'

// Load environment variables
config()

const connectionString = process.env.DATABASE_URL!

// Create the connection
const client = postgres(connectionString, { prepare: false })
const db = drizzle(client)

async function seed() {
  try {
    console.log('🌱 Seeding database with sample data...')

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
    ]

    console.log('📂 Creating categories...')
    const createdCategories = await db.insert(categories).values(sampleCategories).returning()
    console.log(`✅ Created ${createdCategories.length} categories`)

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
        title: '10 Essential Cooking Tips for Beginners',
        slug: 'essential-cooking-tips-beginners',
        content: `# 10 Essential Cooking Tips for Beginners

Cooking can seem intimidating when you're just starting out, but with these essential tips, you'll be creating delicious meals in no time!

## 1. Read the Recipe Completely First
Before you start cooking, read through the entire recipe to understand all the steps and ingredients needed.

## 2. Mise en Place
"Mise en place" is French for "put in place." Prepare all your ingredients before you start cooking.

## 3. Use the Right Tools
Invest in quality kitchen tools - a good chef's knife, cutting board, and pots/pans make all the difference.

## 4. Season as You Go
Don't save all the seasoning for the end. Layer flavors throughout the cooking process.

## 5. Taste and Adjust
Always taste your food as you cook and adjust seasoning as needed.

## 6. Don't Overcrowd the Pan
When sautéing or frying, give your ingredients space to cook properly.

## 7. Rest Your Meat
Let cooked meat rest before cutting to retain juices.

## 8. Clean as You Go
Keep your workspace clean to make cooking more enjoyable.

## 9. Learn Basic Knife Skills
Proper knife skills make cooking safer and more efficient.

## 10. Practice Makes Perfect
Don't get discouraged if your first attempts aren't perfect. Keep practicing!

## Bonus Tip: Keep it Simple
Start with simple recipes and gradually work your way up to more complex dishes.`,
        excerpt: 'Essential cooking tips for beginners to help build confidence in the kitchen and create delicious meals.',
        published: true,
        authorId: 'chef-admin'
      },
      {
        title: 'My Journey Through Southeast Asia',
        slug: 'journey-southeast-asia',
        content: `# My Journey Through Southeast Asia

Three months, five countries, countless memories. Here's my adventure through Southeast Asia.

## Thailand: The Land of Smiles
Bangkok welcomed me with its vibrant street food scene and bustling markets. The Grand Palace left me in awe of Thai architecture and history.

## Vietnam: From North to South
Ha Long Bay's emerald waters and limestone karsts were breathtaking. Ho Chi Minh City showed me the resilience and energy of the Vietnamese people.

## Cambodia: Ancient Wonders
Angkor Wat at sunrise was a spiritual experience I'll never forget. The Khmer people's warmth and hospitality touched my heart.

## Malaysia: Cultural Melting Pot
Kuala Lumpur's Petronas Towers pierced the sky, while Penang's street art told stories of the city's diverse cultural heritage.

## Singapore: The Garden City
This modern metropolis showed me how tradition and innovation can coexist beautifully.

## Reflections
Southeast Asia taught me that travel is about connections - with people, with cultures, and with yourself. Each country offered unique lessons and unforgettable experiences that changed my perspective on the world.`,
        excerpt: 'A personal travelogue through Thailand, Vietnam, Cambodia, Malaysia, and Singapore, sharing cultural insights and memorable experiences.',
        published: true,
        authorId: 'travel-blogger'
      },
      {
        title: 'Building Mental Resilience: A Guide',
        slug: 'building-mental-resilience-guide',
        content: `# Building Mental Resilience: A Guide

Mental resilience is the ability to bounce back from adversity. Here's how to cultivate this essential life skill.

## Understanding Resilience
Resilience isn't about avoiding stress or hardship - it's about learning to thrive despite challenges.

## Daily Practices for Building Resilience

### 1. Practice Mindfulness
Being present helps you respond rather than react to difficult situations.

### 2. Build Strong Relationships
A support network provides perspective and encouragement during tough times.

### 3. Set Realistic Goals
Achievable goals build confidence and momentum.

### 4. Take Care of Your Body
Physical health directly impacts mental resilience.

### 5. Learn from Setbacks
View failures as learning opportunities rather than defeats.

### 6. Practice Self-Compassion
Be kind to yourself, especially when things are difficult.

### 7. Maintain Perspective
Keep the big picture in mind when facing challenges.

## The Role of Habits
Consistent small actions compound over time to build significant mental strength.

## Professional Help
Sometimes building resilience requires professional support - and that's okay.

## Conclusion
Mental resilience is a skill that can be developed with practice and patience. Start small, be consistent, and celebrate your progress along the way.`,
        excerpt: 'A comprehensive guide to building mental resilience through daily practices, mindfulness, and healthy habits.',
        published: true,
        authorId: 'wellness-coach'
      },
      {
        title: 'The Future of Artificial Intelligence in Healthcare',
        slug: 'future-ai-healthcare',
        content: `# The Future of Artificial Intelligence in Healthcare

Artificial Intelligence is revolutionizing healthcare in ways we never imagined possible. From diagnosis to treatment, AI is becoming an invaluable tool for medical professionals.

## Current Applications

### Diagnostic Imaging
AI algorithms can now detect abnormalities in X-rays, MRIs, and CT scans with accuracy rivaling experienced radiologists.

### Drug Discovery
Machine learning is accelerating the drug discovery process, reducing development time from years to months.

### Personalized Medicine
AI analyzes genetic data and medical history to create personalized treatment plans.

## Emerging Trends

### Predictive Analytics
Hospitals use AI to predict patient deterioration and prevent complications.

### Virtual Health Assistants
AI-powered chatbots provide 24/7 medical advice and symptom checking.

### Robotic Surgery
AI-enhanced robots assist surgeons with precision and consistency.

## Challenges and Considerations

### Data Privacy
Protecting patient data while leveraging AI capabilities remains a critical concern.

### Bias in Algorithms
Ensuring AI systems are trained on diverse datasets to avoid biased outcomes.

### Human-AI Collaboration
Finding the right balance between AI assistance and human judgment.

## The Road Ahead

The future of AI in healthcare is bright, but it requires careful implementation, ethical considerations, and ongoing collaboration between technologists and healthcare professionals.

## Conclusion
AI has the potential to make healthcare more accessible, efficient, and personalized. As we move forward, the focus should be on responsible AI development that benefits all patients.`,
        excerpt: 'Exploring how artificial intelligence is transforming healthcare through diagnostic imaging, drug discovery, and personalized medicine.',
        published: false,
        authorId: 'tech-writer'
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

### 3. Template Literal Types
Create complex string literal types:

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type MouseEvent = EventName<'click'>; // 'onClick'
\`\`\`

## Utility Types Deep Dive

### Pick and Omit
Selectively choose or exclude properties:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Omit<User, 'password'>;
type UserSummary = Pick<User, 'id' | 'name'>;
\`\`\`

### Record and Partial
Create object types with specific keys:

\`\`\`typescript
type Theme = 'light' | 'dark';
type ColorScheme = Record<Theme, string>;
\`\`\`

## Advanced Generic Patterns

### Generic Constraints
Limit what types can be used with generics:

\`\`\`typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
\`\`\`

### Generic Defaults
Provide default types for generics:

\`\`\`typescript
interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
}
\`\`\`

## Best Practices

### 1. Use Strict Mode
Enable strict mode for better type safety:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
\`\`\`

### 2. Prefer Interfaces for Object Shapes
Use interfaces for object types and type aliases for unions:

\`\`\`typescript
interface User {
  id: string;
  name: string;
}

type Status = 'pending' | 'approved' | 'rejected';
\`\`\`

### 3. Use Discriminated Unions
Create type-safe state machines:

\`\`\`typescript
type LoadingState = { status: 'loading' };
type SuccessState = { status: 'success'; data: any };
type ErrorState = { status: 'error'; error: string };

type AsyncState = LoadingState | SuccessState | ErrorState;
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

### Time Blocking
Schedule specific time slots for different activities:
- Deep work sessions
- Meetings and calls
- Email and communication
- Administrative tasks

## Communication Best Practices

### 1. Over-communicate
In remote work, it's better to over-communicate than under-communicate:
- Share regular updates on your progress
- Ask questions when you need clarification
- Use video calls for complex discussions

### 2. Choose the Right Channel
- Email for formal communication
- Instant messaging for quick questions
- Video calls for complex discussions
- Project management tools for task updates

## Maintaining Work-Life Balance

### 1. Set Clear Boundaries
- Define your work hours
- Create physical boundaries
- Communicate your availability

### 2. Take Regular Breaks
- Step away from your computer
- Get some fresh air
- Practice mindfulness or meditation

### 3. End Your Day Properly
- Close your laptop
- Tidy your workspace
- Plan for the next day

## Staying Motivated

### 1. Set Daily Goals
Start each day with 3-5 specific goals:
- Make them achievable
- Write them down
- Celebrate when you complete them

### 2. Connect with Colleagues
- Schedule virtual coffee chats
- Participate in team building activities
- Join online communities

### 3. Continuous Learning
- Take online courses
- Read industry blogs
- Attend virtual conferences

## Tools and Apps

### Project Management
- Trello for task organization
- Asana for team collaboration
- Notion for documentation

### Communication
- Slack for team chat
- Zoom for video calls
- Loom for screen recordings

### Productivity
- RescueTime for time tracking
- Forest for focus sessions
- Todoist for task management

## Common Challenges and Solutions

### Distractions at Home
- Use noise-canceling headphones
- Create a "do not disturb" sign
- Use website blockers during work hours

### Feeling Isolated
- Schedule regular check-ins with colleagues
- Join virtual coworking sessions
- Participate in online communities

### Overworking
- Set strict work hours
- Use time tracking apps
- Take regular breaks

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

### 3. Optimize Heating and Cooling
- Set thermostat 2-3 degrees higher in summer
- Use fans to circulate air
- Seal windows and doors

## Water Conservation

### 1. Fix Leaks Immediately
- A dripping faucet can waste 3,000 gallons per year
- Check toilets for silent leaks
- Repair dripping showerheads

### 2. Reduce Shower Time
- Take 5-minute showers
- Install low-flow showerheads
- Turn off water while lathering

### 3. Water-Smart Landscaping
- Choose native plants
- Use drip irrigation
- Collect rainwater for plants

## Waste Reduction

### 1. Embrace the 3 R's
- **Reduce**: Buy only what you need
- **Reuse**: Find new purposes for old items
- **Recycle**: Properly sort recyclables

### 2. Compost Food Scraps
- Reduces methane emissions
- Creates nutrient-rich soil
- Reduces waste sent to landfills

### 3. Choose Reusable Over Disposable
- Use cloth shopping bags
- Carry a reusable water bottle
- Bring your own coffee cup

## Sustainable Transportation

### 1. Walk or Bike
- For short distances
- Reduces carbon footprint
- Improves physical health

### 2. Use Public Transportation
- Reduces individual car emissions
- Often more cost-effective
- Reduces traffic congestion

### 3. Carpool or Rideshare
- Share rides with colleagues
- Use rideshare apps
- Plan errands efficiently

## Conscious Consumption

### 1. Buy Quality Over Quantity
- Invest in durable items
- Choose timeless designs
- Support ethical brands

### 2. Shop Secondhand
- Reduces demand for new products
- Often more affordable
- Gives items a second life

### 3. Support Local Businesses
- Reduces transportation emissions
- Supports local economy
- Often higher quality products

## Food Choices

### 1. Reduce Meat Consumption
- Try Meatless Mondays
- Explore plant-based alternatives
- Choose sustainably sourced meat

### 2. Buy Local and Seasonal
- Reduces transportation emissions
- Supports local farmers
- Often fresher and more nutritious

### 3. Minimize Food Waste
- Plan meals in advance
- Store food properly
- Use leftovers creatively

## Getting Started

### Week 1: Energy
- Switch to LED bulbs
- Unplug unused electronics
- Adjust thermostat settings

### Week 2: Water
- Fix any leaks
- Reduce shower time
- Install low-flow fixtures

### Week 3: Waste
- Start composting
- Use reusable bags
- Sort recyclables properly

### Week 4: Transportation
- Walk or bike for short trips
- Use public transportation
- Plan efficient routes

## Measuring Your Impact

### Track Your Progress
- Monitor energy bills
- Count items recycled
- Note transportation choices

### Celebrate Wins
- Acknowledge your efforts
- Share successes with others
- Inspire friends and family

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

## The Science Behind Morning Routines

### Circadian Rhythms
Your body's natural clock affects:
- Sleep-wake cycles
- Hormone production
- Energy levels
- Cognitive performance

### The Power of Habit
Morning routines work because they:
- Create automatic behaviors
- Reduce mental load
- Build momentum
- Increase self-discipline

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

### 3. Move Your Body
- Even 5-10 minutes of movement helps
- Stretching, yoga, or light exercise
- Increases blood flow and energy
- Improves mood and focus

### 4. Practice Mindfulness
- Meditation, deep breathing, or journaling
- Reduces stress and anxiety
- Improves emotional regulation
- Sets a calm tone for the day

### 5. Eat a Nourishing Breakfast
- Fuel your body and brain
- Include protein, fiber, and healthy fats
- Avoid sugary cereals or pastries
- Take time to enjoy your meal

## Sample Morning Routines

### The Minimalist (15 minutes)
1. Wake up at 6:00 AM
2. Drink a glass of water
3. 5 minutes of stretching
4. 5 minutes of meditation
5. Quick breakfast

### The Energizer (30 minutes)
1. Wake up at 6:00 AM
2. Drink water with lemon
3. 10 minutes of yoga
4. 10 minutes of journaling
5. Healthy breakfast
6. Review daily goals

### The Power Hour (60 minutes)
1. Wake up at 5:30 AM
2. Hydrate and take vitamins
3. 20 minutes of exercise
4. 15 minutes of meditation
5. 15 minutes of reading
6. Nutritious breakfast
7. Plan the day ahead

## Common Mistakes to Avoid

### 1. Being Too Ambitious
- Start small and build gradually
- Don't try to change everything at once
- Focus on consistency over perfection

### 2. Not Planning Ahead
- Prepare the night before
- Set out clothes and supplies
- Have breakfast ingredients ready

### 3. Ignoring Your Chronotype
- Some people are naturally morning people
- Others function better later in the day
- Adjust your routine to your natural rhythm

### 4. Being Rigid
- Allow for flexibility
- Adapt to changing circumstances
- Don't abandon the routine entirely if you miss a day

## Making It Stick

### 1. Start Small
- Begin with just one or two habits
- Master them before adding more
- Celebrate small wins

### 2. Track Your Progress
- Use a habit tracker
- Note how you feel each day
- Adjust as needed

### 3. Prepare the Night Before
- Set out clothes
- Prepare breakfast ingredients
- Charge your phone away from bed

### 4. Create Accountability
- Tell someone about your routine
- Join a morning routine challenge
- Share your progress on social media

## Troubleshooting Common Issues

### "I'm Not a Morning Person"
- Start by going to bed 15 minutes earlier
- Use gradual wake-up lights
- Try the "5-minute rule" - just get up for 5 minutes

### "I Don't Have Time"
- Even 5 minutes makes a difference
- Wake up 15 minutes earlier
- Combine activities (meditate while stretching)

### "I Keep Failing"
- Don't aim for perfection
- Focus on getting back on track
- Analyze what's not working and adjust

## The Evening Connection

Your morning routine starts the night before:
- Set a consistent bedtime
- Create a relaxing evening routine
- Avoid screens 1 hour before bed
- Keep your bedroom cool and dark

## Conclusion

A morning routine is a powerful tool for taking control of your day and your life. Start small, be consistent, and remember that progress, not perfection, is the goal. Your future self will thank you for the investment you make in your mornings.`,
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

### Cultural Considerations
Color meanings vary across cultures:
- White represents purity in Western cultures but mourning in Eastern cultures
- Red symbolizes luck in China but danger in Western contexts
- Purple represents royalty in Europe but mourning in Thailand

## Primary Colors and Their Psychological Effects

### Red
**Emotions**: Energy, passion, urgency, danger
**Use Cases**: Call-to-action buttons, sales, warnings
**Best Practices**: Use sparingly, avoid for large backgrounds
**Examples**: Netflix, YouTube, Coca-Cola

### Blue
**Emotions**: Trust, stability, professionalism, calm
**Use Cases**: Corporate websites, healthcare, technology
**Best Practices**: Great for headers and navigation
**Examples**: Facebook, Twitter, IBM

### Green
**Emotions**: Growth, nature, harmony, money
**Use Cases**: Environmental sites, finance, health
**Best Practices**: Excellent for buttons and accents
**Examples**: Starbucks, Spotify, Whole Foods

### Yellow
**Emotions**: Optimism, creativity, warmth, caution
**Use Cases**: Creative industries, children's sites, warnings
**Best Practices**: Use in small doses, avoid for text
**Examples**: McDonald's, Snapchat, IKEA

### Purple
**Emotions**: Luxury, creativity, mystery, spirituality
**Use Cases**: Beauty, art, luxury brands, creative agencies
**Best Practices**: Works well with gold or silver accents
**Examples**: Cadbury, Hallmark, Yahoo

### Orange
**Emotions**: Enthusiasm, energy, fun, affordability
**Use Cases**: Entertainment, food, sports, call-to-actions
**Best Practices**: Great for CTAs, avoid for large areas
**Examples**: Fanta, Nickelodeon, Home Depot

## Color Combinations and Harmonies

### Complementary Colors
Colors opposite on the color wheel:
- Creates high contrast and energy
- Use for call-to-action buttons
- Examples: Blue and orange, red and green

### Analogous Colors
Colors next to each other on the color wheel:
- Creates harmony and cohesion
- Good for backgrounds and large areas
- Examples: Blue, blue-green, and green

### Triadic Colors
Three colors evenly spaced on the color wheel:
- Creates vibrant, balanced designs
- Use one as dominant, others as accents
- Examples: Red, yellow, and blue

## Practical Application in Web Design

### 1. Brand Identity
Choose colors that align with your brand personality:
- Professional services: Blues and grays
- Creative agencies: Bright, vibrant colors
- Healthcare: Blues and greens
- Food industry: Warm colors (reds, oranges, yellows)

### 2. User Experience
Use color to guide user behavior:
- Make important elements stand out
- Create visual hierarchy
- Indicate interactive elements
- Show system status

### 3. Accessibility
Ensure color choices are accessible:
- Maintain sufficient contrast ratios
- Don't rely solely on color to convey information
- Test with colorblind users
- Use tools like WebAIM's contrast checker

## Color Psychology by Industry

### E-commerce
- Red for urgency and sales
- Green for "go" and money
- Blue for trust and security
- Orange for call-to-actions

### Healthcare
- Blue for trust and professionalism
- Green for health and growth
- White for cleanliness and purity
- Avoid red (associated with danger)

### Technology
- Blue for trust and innovation
- Gray for professionalism
- Accent colors for highlights
- Avoid overwhelming color schemes

### Education
- Blue for focus and learning
- Green for growth and nature
- Yellow for creativity and energy
- Warm colors for younger audiences

## Tools and Resources

### Color Palette Generators
- Coolors.co
- Adobe Color
- Material Design Color Tool
- Paletton

### Accessibility Tools
- WebAIM Contrast Checker
- Color Oracle (colorblind simulator)
- Stark (Figma/Sketch plugin)
- axe DevTools

### Inspiration Sources
- Dribbble
- Behance
- Awwwards
- Color Hunt

## Testing and Optimization

### A/B Testing Colors
- Test different button colors
- Compare conversion rates
- Test different color schemes
- Measure user engagement

### User Feedback
- Conduct user interviews
- Use surveys and polls
- Analyze user behavior
- Gather qualitative feedback

## Common Mistakes to Avoid

### 1. Too Many Colors
- Stick to 2-3 main colors
- Use neutrals for balance
- Create a clear hierarchy

### 2. Poor Contrast
- Ensure text is readable
- Test with accessibility tools
- Consider different devices

### 3. Ignoring Context
- Consider your target audience
- Think about cultural implications
- Align with brand values

### 4. Inconsistent Usage
- Create a style guide
- Use the same colors for similar elements
- Maintain consistency across pages

## Conclusion

Color psychology in web design is about understanding how colors affect users and using that knowledge to create more effective, engaging, and accessible websites. Start with your brand identity, consider your audience, and always prioritize usability and accessibility.`,
        excerpt: 'Understanding how colors influence user behavior and emotions in web design, with practical tips for creating effective color schemes.',
        published: true,
        authorId: 'design-expert'
      }
    ]

    console.log('📝 Creating blog posts...')
    const createdPosts = await db.insert(posts).values(samplePosts).returning()
    console.log(`✅ Created ${createdPosts.length} blog posts`)

    // Link posts to categories (many-to-many relationship)
    console.log('🔗 Creating post-category relationships...')

    // Technology category posts
    const techCategory = createdCategories.find(cat => cat.slug === 'technology')
    const techPosts = createdPosts.filter(post => 
      post.slug === 'getting-started-nextjs-15' || 
      post.slug === 'future-ai-healthcare' ||
      post.slug === 'psychology-color-web-design'
    )

    for (const post of techPosts) {
      if (techCategory) {
        await db.insert(postCategories).values({
          postId: post.id,
          categoryId: techCategory.id
        })
      }
    }

    // Web Development category posts
    const webDevCategory = createdCategories.find(cat => cat.slug === 'web-development')
    const webDevPosts = createdPosts.filter(post => 
      post.slug === 'mastering-typescript-advanced-patterns' ||
      post.slug === 'psychology-color-web-design'
    )

    for (const post of webDevPosts) {
      if (webDevCategory) {
        await db.insert(postCategories).values({
          postId: post.id,
          categoryId: webDevCategory.id
        })
      }
    }

    // Travel category posts
    const travelCategory = createdCategories.find(cat => cat.slug === 'travel')
    const travelPost = createdPosts.find(post => post.slug === 'journey-southeast-asia')

    if (travelCategory && travelPost) {
      await db.insert(postCategories).values({
        postId: travelPost.id,
        categoryId: travelCategory.id
      })
    }

    // Food & Cooking category posts
    const foodCategory = createdCategories.find(cat => cat.slug === 'food-cooking')
    const foodPost = createdPosts.find(post => post.slug === 'essential-cooking-tips-beginners')

    if (foodCategory && foodPost) {
      await db.insert(postCategories).values({
        postId: foodPost.id,
        categoryId: foodCategory.id
      })
    }

    // Health & Fitness category posts
    const healthCategory = createdCategories.find(cat => cat.slug === 'health-fitness')
    const healthPosts = createdPosts.filter(post => 
      post.slug === 'building-mental-resilience-guide' ||
      post.slug === 'building-morning-routine-that-works'
    )

    for (const post of healthPosts) {
      if (healthCategory) {
        await db.insert(postCategories).values({
          postId: post.id,
          categoryId: healthCategory.id
        })
      }
    }

    // Personal Development category posts
    const personalDevCategory = createdCategories.find(cat => cat.slug === 'personal-development')
    const personalDevPosts = createdPosts.filter(post => 
      post.slug === 'building-mental-resilience-guide' ||
      post.slug === 'building-morning-routine-that-works'
    )

    for (const post of personalDevPosts) {
      if (personalDevCategory) {
        await db.insert(postCategories).values({
          postId: post.id,
          categoryId: personalDevCategory.id
        })
      }
    }

    // Lifestyle category posts
    const lifestyleCategory = createdCategories.find(cat => cat.slug === 'lifestyle')
    const lifestylePosts = createdPosts.filter(post => 
      post.slug === 'complete-guide-remote-work-productivity' ||
      post.slug === 'sustainable-living-small-changes-big-impact' ||
      post.slug === 'building-morning-routine-that-works'
    )

    for (const post of lifestylePosts) {
      if (lifestyleCategory) {
        await db.insert(postCategories).values({
          postId: post.id,
          categoryId: lifestyleCategory.id
        })
      }
    }

    console.log('✅ Created post-category relationships')
    console.log('🎉 Database seeded successfully!')

    // Display summary
    const totalLinks = techPosts.length + webDevPosts.length + (travelPost ? 1 : 0) + (foodPost ? 1 : 0) + healthPosts.length + personalDevPosts.length + lifestylePosts.length
    
    console.log('\n📊 Summary:')
    console.log(`   Categories: ${createdCategories.length}`)
    console.log(`   Posts: ${createdPosts.length}`)
    console.log(`   Post-Category Links: ${totalLinks}`)
    console.log('\n📝 Sample Content:')
    console.log('   • Technology & Web Development articles')
    console.log('   • Travel and lifestyle content')
    console.log('   • Health, fitness, and personal development')
    console.log('   • Food & cooking guides')
    console.log('   • Remote work and productivity tips')
    console.log('   • Sustainable living advice')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// Run the seed function
seed()
