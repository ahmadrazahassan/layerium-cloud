<div align="center">
  <img src="public/file.svg" alt="Layerium Cloud Logo" width="120" height="120">
  
  # Layerium Cloud
  
  **Enterprise-grade VPS & RDP hosting platform**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.89-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

  [Demo](https://layerium.com) · [Documentation](docs/) · [Report Bug](https://github.com/yourusername/layerium-cloud/issues) · [Request Feature](https://github.com/yourusername/layerium-cloud/issues)
</div>

---

## 🚀 Overview

Layerium Cloud is a modern, high-performance cloud hosting platform built with Next.js 15, offering VPS and RDP server solutions with enterprise-grade features. The platform features a beautiful, responsive UI inspired by industry leaders like Framer and Linear, with smooth animations and glassmorphism design elements.

### ✨ Key Features

- **🎨 Modern UI/UX** - iOS 18-inspired glassmorphism design with fluid animations
- **⚡ Lightning Fast** - Built on Next.js 15 with optimized performance
- **🔐 Secure Authentication** - Powered by Supabase with email/OAuth support
- **📱 Fully Responsive** - Seamless experience across all devices
- **🌍 Multi-Region Support** - Global datacenter locations with geo-based pricing
- **💳 Flexible Billing** - Support for USD and PKR currencies
- **🎯 Admin Dashboard** - Comprehensive management interface
- **📊 Real-time Analytics** - Live metrics and monitoring
- **🛡️ DDoS Protection** - Enterprise-grade security included
- **🎭 Smooth Animations** - Framer Motion powered interactions

---

## 🛠️ Tech Stack

### Core
- **[Next.js 15.3](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS

### Backend & Database
- **[Supabase](https://supabase.com/)** - Authentication, database, and real-time subscriptions
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database

### UI & Animation
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Lenis](https://lenis.studiofreight.com/)** - Smooth scroll

### Utilities
- **[Zod](https://zod.dev/)** - Schema validation
- **[clsx](https://github.com/lukeed/clsx)** - Conditional classnames
- **[D3.js](https://d3js.org/)** - Data visualization
- **[COBE](https://github.com/shuding/cobe)** - 3D globe visualization

---

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/layerium-cloud.git
   cd layerium-cloud
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-supabase-publishable-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**
   
   Run the migrations in your Supabase SQL editor:
   ```bash
   # Navigate to supabase/migrations and run each file in order:
   # 001_initial_schema.sql
   # 002_rls_policies.sql
   # 003_server_credentials.sql
   # 004_create_admin.sql
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure

```
layerium-cloud/
├── app/                      # Next.js App Router pages
│   ├── (admin)/             # Admin dashboard routes
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # User dashboard routes
│   ├── about/               # Marketing pages
│   ├── pricing/
│   └── ...
├── components/              # React components
│   ├── marketing/          # Landing page components
│   ├── dashboard/          # Dashboard components
│   ├── admin/              # Admin components
│   ├── ui/                 # Reusable UI components
│   └── providers/          # Context providers
├── lib/                     # Utility functions
│   ├── supabase/           # Supabase clients
│   ├── data/               # Data fetching functions
│   ├── utils/              # Helper functions
│   └── validations/        # Zod schemas
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
├── supabase/               # Database migrations
│   └── migrations/
├── public/                  # Static assets
└── docs/                    # Documentation
```

---

## 🎯 Features in Detail

### Authentication
- Email/password authentication
- OAuth providers (Google, GitHub)
- Password reset flow
- Email verification
- Role-based access control (User/Admin)

### User Dashboard
- Server management
- Billing and invoices
- Support tickets
- Account settings
- Real-time server status

### Admin Panel
- User management
- Server provisioning
- Order management
- Plan configuration
- System settings
- Analytics dashboard

### Marketing Site
- Hero section with animated terminal
- Interactive pricing calculator
- Feature showcase with tabs
- Global datacenter map
- Customer testimonials
- FAQ section

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

---

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run migrations from `supabase/migrations/`
3. Enable authentication providers in Supabase dashboard
4. Configure email templates
5. Set up Row Level Security (RLS) policies

### Environment Variables

See `.env.example` for all required environment variables.

---

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 🐛 Known Issues

- Edge runtime warnings for Supabase Realtime (non-critical)
- Some ESLint warnings in development (does not affect build)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Vercel](https://vercel.com/) - Deployment platform
- [Framer](https://www.framer.com/) - Design inspiration
- [Linear](https://linear.app/) - UI/UX inspiration

---

## 📞 Support

- 📧 Email: support@layerium.com
- 💬 Discord: [Join our community](https://discord.gg/layerium)
- 🐦 Twitter: [@layeriumcloud](https://twitter.com/layeriumcloud)
- 📚 Documentation: [docs.layerium.com](https://docs.layerium.com)

---

<div align="center">
  <p>Built with ❤️ by the Layerium Team</p>
  <p>
    <a href="https://layerium.com">Website</a> •
    <a href="https://twitter.com/layeriumcloud">Twitter</a> •
    <a href="https://github.com/yourusername/layerium-cloud">GitHub</a>
  </p>
</div>
