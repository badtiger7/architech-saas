# Architech SaaS

A modern SaaS application built with Next.js, React, and Tailwind CSS. This project provides a comprehensive platform for project management, file organization, and team collaboration.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/badtiger7/architech-saas.git
   cd architech-saas
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Launch the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal)

## 📁 Project Structure

```
architech-saas/
├── app/                    # Next.js app directory
│   ├── archive/           # Archive management
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── drive/             # File management
│   ├── journal/           # Task journal
│   ├── notifications/     # Notification center
│   ├── settings/          # User settings
│   └── timeline/          # Project timeline
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   └── navbar.tsx        # Navigation component
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Global styles
```

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🎨 Features

### Core Functionality
- **Dashboard** - Overview and analytics
- **File Management** - Document organization and annotation
- **Project Timeline** - Phase-based project tracking
- **Task Journal** - Task management and tracking
- **Archive** - Project history and storage
- **Notifications** - Real-time updates
- **Settings** - User preferences and configuration

### Technical Features
- **Modern UI** - Built with Tailwind CSS and Shadcn/ui
- **Responsive Design** - Mobile-first approach
- **TypeScript** - Full type safety
- **Next.js 15** - Latest React framework
- **Authentication** - Secure user management
- **Real-time Updates** - Live notifications and sync

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Your app will be available at your Vercel URL

### Manual Deployment
```bash
pnpm build
pnpm start
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Tailwind CSS
The project uses Tailwind CSS with custom configuration. See `tailwind.config.ts` for customization options.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/badtiger7/architech-saas/issues) page
2. Create a new issue with detailed information
3. Include your environment details and error messages

## 🔗 Links

- **Live Demo**: [https://vercel.com/innovationsmastery-gmailcoms-projects/v0-architech](https://vercel.com/innovationsmastery-gmailcoms-projects/v0-architech)
- **Repository**: [https://github.com/badtiger7/architech-saas](https://github.com/badtiger7/architech-saas)
- **v0.dev Project**: [https://v0.dev/chat/projects/Jf79S9J78Jf](https://v0.dev/chat/projects/Jf79S9J78Jf)

---

Built with ❤️ using [Next.js](https://nextjs.org/), [React](https://reactjs.org/), and [Tailwind CSS](https://tailwindcss.com/) 