# 🎓 AxiomAI

> **Next-Generation AI-Powered Educational Platform**  
> Transforming how students learn, collaborate, and manage their academic journey through intelligent automation and seamless integrations.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-axiomai.space-blue?style=for-the-badge)](https://axiomai.space)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## 🚀 **Overview**

AxiomAI is a comprehensive educational technology platform that leverages cutting-edge AI to revolutionize the student experience. Built with a modern, scalable architecture, it seamlessly integrates with existing educational tools while providing powerful AI-driven features for learning, collaboration, and academic management.

### ✨ **Key Highlights**

- 🤖 **Multi-Model AI Integration** - Access to multiple AI models via OpenRouter API
- 📚 **LMS Integration** - Seamless Canvas LMS connectivity for course management
- 🎨 **Modern UI/UX** - Beautiful, responsive design built with Next.js and Tailwind CSS
- 🔐 **Enterprise Authentication** - Secure authentication with Clerk
- 📊 **Real-time Analytics** - Advanced course and performance tracking
- 🌐 **Cloud-Native** - Fully deployed and scalable architecture

---

## 🛠️ **Tech Stack**

### **Frontend**

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and interactions
- **React Query** - Efficient data fetching and state management

### **Backend**

- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - End-to-end type safety
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Robust relational database
- **Zod** - Runtime type validation

### **Infrastructure & Services**

- **Supabase** - Database hosting and real-time features
- **Clerk** - Authentication and user management
- **OpenRouter** - Multi-model AI API access
- **Vercel** - Frontend deployment and edge functions
- **Railway/AWS** - Backend hosting and scaling

### **Developer Experience**

- **ESLint & Prettier** - Code quality and formatting
- **Husky** - Git hooks for quality gates
- **Jest** - Comprehensive testing suite
- **Docker** - Containerized development

---

## 🎯 **Core Features**

### 🧠 **AI-Powered Learning Assistant**

- Interactive chat interface with multiple AI models (GPT-4, Claude, Llama, etc.)
- Context-aware responses based on course materials
- Real-time resource generation (mind maps, flashcards, study guides)

### 📋 **Intelligent Course Management**

- **Canvas LMS Integration** - Automatic sync of courses, assignments, and grades
- **Google Calendar Integration** - Smart scheduling and deadline management
- **Custom Course Pages** - Notion-like customization for personal organization

### 👥 **Social Learning Platform**

- Share and collaborate on course materials
- Study group formation and management
- Peer-to-peer knowledge sharing

### 💳 **Flexible Credit System**

- Usage-based pricing model
- Premium subscriptions for unlimited access
- Transparent credit tracking and management

---

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│  (Express.js)   │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ • React Query   │    │ • Prisma ORM    │    │ • Supabase      │
│ • Tailwind CSS  │    │ • TypeScript    │    │ • Row Level     │
│ • Framer Motion │    │ • Zod Validation│    │   Security      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│  External APIs  │◄─────────────┘
                        │                 │
                        │ • OpenRouter    │
                        │ • Canvas LMS    │
                        │ • Google Cal    │
                        │ • Clerk Auth    │
                        └─────────────────┘
```

---

## 🚦 **Quick Start**

### **Prerequisites**

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- Clerk account for authentication

### **Environment Setup**

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/axiomai.git
   cd axiomai
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd backend && npm install

   # Install frontend dependencies
   cd ../frontend && npm install
   ```

3. **Configure environment variables**

   **Backend** (`backend/.env`):

   ```env
   DATABASE_URL="your_supabase_connection_string"
   DIRECT_URL="your_supabase_direct_url"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   OPENROUTER_API_KEY="your_openrouter_key"
   NODE_ENV="development"
   ```

   **Frontend** (`frontend/.env.local`):

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   NEXT_PUBLIC_API_URL="http://localhost:8000"
   ```

4. **Initialize the database**

   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development servers**

   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

6. **Open your browser**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

---

## 📡 **API Documentation**

### **Core Endpoints**

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| `GET`  | `/api/health`         | System health check    |
| `GET`  | `/api/courses`        | Fetch user courses     |
| `POST` | `/api/users/sync`     | Sync user with Clerk   |
| `GET`  | `/api/canvas/courses` | Canvas LMS integration |

### **Authentication**

All protected endpoints require a valid Clerk session token:

```typescript
headers: {
  'Authorization': `Bearer ${sessionToken}`
}
```

---

## 🚀 **Deployment**

### **Production Environment**

The application is deployed with the following architecture:

- **Frontend**: Vercel (with edge functions)
- **Backend**: Railway/AWS (with auto-scaling)
- **Database**: Supabase (with connection pooling)

### **Environment Variables**

Ensure all production environment variables are set:

- `NODE_ENV="production"`
- `DATABASE_URL` (with SSL configuration)
- `CORS_ORIGIN` (your frontend domain)

---

## 🧪 **Testing**

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit
npm run test:integration
```

---

## 📈 **Performance & Monitoring**

- **Cold Start Optimization**: Prisma binary targets configured for minimal bundle size
- **Database Optimization**: Connection pooling and query optimization
- **Caching Strategy**: Redis for session management and API response caching
- **Error Tracking**: Comprehensive logging and monitoring

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **OpenRouter** for multi-model AI access
- **Supabase** for reliable database infrastructure
- **Clerk** for seamless authentication
- **Vercel** for exceptional deployment experience

---

<div align="center">

**Built with ❤️ by [Naman Rusia](https://github.com/namanrusia)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/namanrusia)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://namanrusia.com)

</div>
