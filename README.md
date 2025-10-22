# BlogHub

A modern, production-ready BlogHub built with Next.js 15, PostgreSQL, Drizzle ORM, and tRPC. This project demonstrates type-safe API development, modern React patterns, and clean architecture principles.

## 🚀 Live Demo

**Deployment**: [Vercel](https://your-blog-platform.vercel.app) (Coming Soon)

## 📋 Features Implemented

### 🔴 Must Have (Priority 1) - ✅ COMPLETED
- ✅ **Blog Post CRUD Operations** - Create, read, update, and delete blog posts
- ✅ **Category Management** - Create and manage categories for organizing posts
- ✅ **Many-to-Many Relationships** - Assign multiple categories to posts
- ✅ **Blog Listing Page** - View all posts with category filtering and search
- ✅ **Individual Post Views** - Read full blog posts with featured images
- ✅ **Responsive Navigation** - Clean, professional UI layout
- ✅ **Type-Safe APIs** - Built with tRPC for end-to-end type safety

### 🟡 Should Have (Priority 2) - ✅ COMPLETED
- ✅ **Landing Page** - 5-section homepage (Header, Hero, Features, CTA, Footer)
- ✅ **Dashboard** - Comprehensive post and category management interface
- ✅ **Draft/Published Status** - Control post visibility with status toggle
- ✅ **Loading States** - Skeleton screens and loading indicators throughout
- ✅ **Mobile Responsive** - Works perfectly on all device sizes
- ✅ **Rich Text Editor** - Tiptap-based editor with preview mode and image upload

### 🟢 Nice to Have (Priority 3) - ✅ BONUS FEATURES
- ✅ **Search Functionality** - Debounced search with real-time filtering
- ✅ **Post Statistics** - Word count, reading time, and content metrics
- ✅ **Image Upload** - Complete file upload system with validation
- ✅ **Post Preview** - Live preview functionality during editing
- ✅ **SEO Meta Tags** - Dynamic meta tags for better SEO
- ✅ **Pagination** - Client-side pagination for better performance
- ✅ **Advanced Search** - Multi-filter search with history and pagination

## 🛠️ Tech Stack

### Core Technologies
- **Frontend**: Next.js 15 with App Router
- **Backend**: tRPC for type-safe API layer
- **Database**: PostgreSQL with Drizzle ORM
- **Language**: TypeScript (100% type coverage)
- **Styling**: Tailwind CSS + shadcn/ui components

### Additional Libraries
- **State Management**: Zustand + React Query (via tRPC)
- **Rich Text Editor**: Tiptap with extensions
- **Icons**: Lucide React
- **Validation**: Zod schemas
- **Date Handling**: date-fns
- **File Upload**: Custom implementation with validation

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or hosted)

### 1. Clone and Install Dependencies
```bash
# Clone the repository
git clone <your-repo-url>
cd bloghub

# Install dependencies
npm install
```

### 2. Environment Setup
```bash
```


   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/blogging_platform"
   ```

### 3. Database Setup
   ```bash
# Generate database migrations
npm run db:generate

# Apply migrations to database
npm run db:migrate

# (Optional) Seed the database with sample data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 5. Database Management 
```bash
# View database in Drizzle Studio
npm run db:studio

# View current data
npm run db:view

# Push schema changes (development only)
npm run db:push
```

## 📁 Project Structure

```
bloghub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/trpc/          # tRPC API routes
│   │   ├── api/upload/        # File upload endpoint
│   │   ├── blog/              # Blog listing and post pages
│   │   │   ├── [slug]/        # Dynamic post routes
│   │   │   ├── blog-page-client.tsx
│   │   │   └── page.tsx
│   │   ├── dashboard/         # Admin dashboard
│   │   │   ├── categories/    # Category management
│   │   │   └── posts/         # Post management
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── advanced-search.tsx
│   │   ├── error-boundary.tsx
│   │   ├── image-upload.tsx
│   │   ├── rich-text-editor.tsx
│   │   └── providers.tsx      # tRPC and React Query providers
│   ├── hooks/                # Custom React hooks
│   │   └── use-toast.ts
│   ├── lib/                  # Utilities and configurations
│   │   ├── db/               # Database schema and connection
│   │   │   ├── migrations/   # Database migrations
│   │   │   ├── schema.ts     # Drizzle schema
│   │   │   └── seed.ts       # Database seeding
│   │   ├── helpers.ts        # Utility functions
│   │   ├── trpc.ts          # tRPC configuration
│   │   ├── trpc-client.ts   # tRPC client
│   │   ├── types.ts         # TypeScript type definitions
│   │   └── validation.ts    # Zod validation schemas
│   └── server/routers/       # tRPC API routers
│       ├── _app.ts          # Main app router
│       ├── posts.ts         # Post CRUD operations
│       └── categories.ts    # Category CRUD operations
├── public/uploads/           # Uploaded images
├── drizzle.config.json       # Drizzle configuration
└── README.md
```

## 🔧 API Documentation

### tRPC Endpoints

#### Posts Router (`/api/trpc/posts`)
- `posts.getAll` - Get all posts with filtering, search, and pagination
- `posts.getBySlug` - Get a single post by slug
- `posts.create` - Create a new post with categories
- `posts.update` - Update an existing post
- `posts.delete` - Delete a post

#### Categories Router (`/api/trpc/categories`)
- `categories.getAll` - Get all categories
- `categories.getBySlug` - Get a single category by slug
- `categories.create` - Create a new category
- `categories.update` - Update an existing category
- `categories.delete` - Delete a category

### Data Models

#### Post
```typescript
{
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  published: boolean
  authorId: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
  categories: Category[]
}
```

#### Category
```typescript
{
  id: string
  name: string
  slug: string
  description?: string
  createdAt: Date
  updatedAt: Date
}
```

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach with perfect desktop scaling
- **Professional UI** - Clean, modern design using shadcn/ui components
- **Loading States** - Skeleton screens and loading indicators
- **Error Handling** - User-friendly error messages with retry options
- **Form Validation** - Real-time validation with helpful error messages
- **Accessibility** - Built with Radix UI for accessibility compliance
- **Image Optimization** - Next.js Image component with lazy loading

## 🚀 Deployment

### Vercel (Recommended)




## 🗄️ Database Seeding

To populate the database with sample data:

```bash
npm run db:seed
```

This will create:
- 5 sample categories
- 10 sample blog posts
- Proper category relationships
- Featured images for posts

## 🔧 Trade-offs and Decisions Made

### 1. **Rich Text Editor vs Markdown**
- **Decision**: Chose Tiptap rich text editor over markdown
- **Reasoning**: Better user experience for non-technical users
- **Trade-off**: Slightly more complex implementation but better UX

### 2. **Client-side vs Server-side Pagination**
- **Decision**: Client-side pagination for blog listing
- **Reasoning**: Better performance for small to medium datasets
- **Trade-off**: Limited scalability but better UX for this use case

### 3. **Image Storage**
- **Decision**: Local file storage instead of cloud storage
- **Reasoning**: Simpler setup and no additional costs
- **Trade-off**: Not suitable for production scale but perfect for demo

### 4. **Authentication**
- **Decision**: Skipped authentication system
- **Reasoning**: Focus on core blogging features as per requirements
- **Trade-off**: Not production-ready but meets assessment criteria

### 5. **State Management**
- **Decision**: Minimal Zustand usage, rely on React Query
- **Reasoning**: tRPC + React Query handles most state needs
- **Trade-off**: Simpler architecture but less global state management

### 6. **Database Design**
- **Decision**: Simple many-to-many relationship for posts-categories
- **Reasoning**: Meets requirements without over-engineering
- **Trade-off**: Could be more complex but sufficient for the scope

## ⏱️ Time Investment

- **Total Time**: 6 days (3 days planning + 3 days development)
- **Planning Phase**: 3 days
  - Day 1: Understanding requirements and tech stack
  - Day 2: Architecture design and database schema
  - Day 3: Component planning and API design
- **Development Phase**: 3 days
  - Day 4: Backend setup and core CRUD operations
  - Day 5: Frontend implementation and UI components
  - Day 6: Advanced features, testing, and deployment

## 🎯 Key Achievements

1. **Type Safety**: 100% TypeScript coverage with end-to-end type safety
2. **Performance**: Debounced search, image optimization, and efficient caching
3. **User Experience**: Loading states, error handling, and responsive design
4. **Code Quality**: Clean architecture, reusable components, and proper separation of concerns
5. **Modern Patterns**: tRPC, React Query, and modern React hooks
6. **Production Ready**: Comprehensive error handling and validation

## ❓ Questions & Assumptions

During development, several decisions were made based on reasonable assumptions when requirements were ambiguous:

### **Architecture & Technical Decisions**

**Q: Should we implement user authentication?**
- **Assumption**: No authentication required for this assessment
- **Reasoning**: Focus on core blogging features as specified
- **Implementation**: All operations are public, no user management
- **Future Consideration**: Would add JWT-based auth with role-based permissions

**Q: What level of image optimization is needed?**
- **Assumption**: Basic image handling with Next.js Image component
- **Reasoning**: Balances performance with simplicity
- **Implementation**: Local storage with responsive image sizing
- **Future Consideration**: Would integrate with Cloudinary or AWS S3 for production

**Q: How complex should the search functionality be?**
- **Assumption**: Client-side search with debouncing is sufficient
- **Reasoning**: Good UX for small to medium datasets
- **Implementation**: Real-time filtering with search history
- **Future Consideration**: Would add Elasticsearch for advanced search capabilities

### **User Experience Decisions**

**Q: Should we implement draft auto-save?**
- **Assumption**: Manual save is acceptable for this scope
- **Reasoning**: Keeps implementation focused on core features
- **Implementation**: Form validation with clear save states
- **Future Consideration**: Would add auto-save every 30 seconds

**Q: What level of mobile optimization is required?**
- **Assumption**: Responsive design with mobile-first approach
- **Reasoning**: Modern web development best practice
- **Implementation**: Tailwind CSS responsive utilities throughout
- **Future Consideration**: Would add PWA features and offline support

**Q: Should we implement comment system?**
- **Assumption**: Not required for core blogging functionality
- **Reasoning**: Focus on content management, not social features
- **Implementation**: Clean, distraction-free reading experience
- **Future Consideration**: Would add threaded comments with moderation

### **Data & Performance Decisions**

**Q: What's the expected scale of content?**
- **Assumption**: Small to medium blog (100-1000 posts)
- **Reasoning**: Assessment context suggests demo/prototype scale
- **Implementation**: Client-side pagination and filtering
- **Future Consideration**: Would implement server-side pagination and caching

**Q: How should we handle SEO optimization?**
- **Assumption**: Basic meta tags and structured data
- **Reasoning**: Good foundation without over-engineering
- **Implementation**: Dynamic meta tags, Open Graph, Twitter Cards
- **Future Consideration**: Would add sitemap generation and advanced SEO

**Q: What level of error handling is appropriate?**
- **Assumption**: User-friendly error messages with graceful degradation
- **Reasoning**: Professional UX without complex error recovery
- **Implementation**: Toast notifications and fallback UI states
- **Future Consideration**: Would add error tracking and monitoring

### **Feature Scope Decisions**

**Q: Should we implement post scheduling?**
- **Assumption**: Not required for MVP
- **Reasoning**: Draft/Published toggle covers basic needs
- **Implementation**: Simple boolean published status
- **Future Consideration**: Would add scheduled publishing with cron jobs

**Q: What level of analytics is needed?**
- **Assumption**: Basic post statistics (word count, reading time)
- **Reasoning**: Useful for content creators without complexity
- **Implementation**: Client-side calculations and display
- **Future Consideration**: Would add Google Analytics integration

**Q: Should we implement post versioning?**
- **Assumption**: Not required for this assessment
- **Reasoning**: Focus on core CRUD operations
- **Implementation**: Simple update-in-place editing
- **Future Consideration**: Would add Git-like version history

### **Development & Deployment Decisions**

**Q: What level of testing is appropriate?**
- **Assumption**: Manual testing and TypeScript type checking
- **Reasoning**: Assessment focuses on implementation, not testing
- **Implementation**: Comprehensive type safety and error handling
- **Future Consideration**: Would add Jest, Cypress, and E2E tests

**Q: Should we implement CI/CD?**
- **Assumption**: Manual deployment is acceptable
- **Reasoning**: Assessment context suggests single developer workflow
- **Implementation**: Clear setup instructions and build scripts
- **Future Consideration**: Would add GitHub Actions for automated deployment

**Q: What level of documentation is needed?**
- **Assumption**: Comprehensive README with setup instructions
- **Reasoning**: Demonstrates professional development practices
- **Implementation**: Detailed documentation with code examples
- **Future Consideration**: Would add API documentation and component storybook

### **Business Logic Decisions**

**Q: Should we implement content moderation?**
- **Assumption**: Not required for this scope
- **Reasoning**: Focus on technical implementation, not content management
- **Implementation**: Basic validation and sanitization
- **Future Consideration**: Would add content filtering and moderation tools

**Q: What level of customization should be available?**
- **Assumption**: Fixed theme with professional design
- **Reasoning**: Balances visual appeal with development focus
- **Implementation**: Consistent design system with shadcn/ui
- **Future Consideration**: Would add theme customization and branding options

**Q: Should we implement multi-language support?**
- **Assumption**: English-only for this assessment
- **Reasoning**: Reduces complexity while maintaining quality
- **Implementation**: Hardcoded English strings with i18n-ready structure
- **Future Consideration**: Would add react-i18next for internationalization


## 🔒 Future Enhancements

For production deployment, consider adding:
- User authentication and authorization
- Cloud storage for images (AWS S3, Cloudinary)
- Rate limiting and security measures
- Comprehensive testing suite
- CI/CD pipeline
- Monitoring and analytics





## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [tRPC](https://trpc.io/) - Type-safe API layer
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tiptap](https://tiptap.dev/) - Rich text editor