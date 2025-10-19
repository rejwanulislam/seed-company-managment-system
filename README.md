# 🪑 Seat Company Management System

A full-stack business management system for seat companies with complete inventory, sales, and customer management.

> 🤖 **Built with Vibe Coding:** This project was developed using AI assistance from Claude AI and ChatGPT, demonstrating rapid full-stack development.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://seed-company-managment-system.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![AI Assisted](https://img.shields.io/badge/AI-Assisted-purple)](https://claude.ai)

## 🚀 [Live Demo](https://seed-company-managment-system.vercel.app)

## ✨ Features

- **📊 Dashboard** - Real-time analytics and business overview
- **👥 Customer Management** - Add, edit, search customers (by name, email, phone)
- **📦 Product Management** - Inventory control with stock monitoring
- **💰 Sales System** - Create sales, track payments, auto stock deduction
- **📄 Invoice Generator** - Download professional PDF invoices
- **📈 Analytics** - Daily, monthly, yearly sales reports
- **⚠️ Low Stock Alerts** - Get notified when inventory is low
- **🔍 Advanced Search** - Filter by date, month, year

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB (Mongoose)
- **PDF:** jsPDF, html2canvas
- **Deployment:** Vercel

## 🤖 Vibe Coding

This entire project was built using **vibe coding** with:
- **Claude AI** (Anthropic)
- **ChatGPT** (OpenAI)

**Development Time:** ~2 hours ⚡  
**Traditional Estimate:** 2-3 weeks 🐌

## 🔧 Quick Start
```bash
# Clone repository
git clone https://github.com/RejwanulIslam/seed-company-managment-system

# Install dependencies
npm install

# Create .env.local
MONGODB_URI=your_mongodb_uri

# Seed database (optional)
npm run seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure
```
├── app/              # Pages and API routes
├── components/       # Reusable UI components
├── lib/              # Database connection
├── models/           # MongoDB schemas
├── utils/            # Helper functions
└── public/           # Static files
```

## 🌐 API Endpoints

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/customers` | GET, POST | Customer operations |
| `/api/products` | GET, POST | Product operations |
| `/api/sales` | GET, POST | Sales operations |
| `/api/payments` | POST | Add payments |

## 🎯 Key Features

### Sales Flow
1. Select customer & product
2. Enter quantity (stock auto-decrements)
3. Add payment (full or partial)
4. Download invoice instantly

### Search & Filter
- Search customers by name, email, phone
- Filter sales by day, month, year
- Real-time results

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add `MONGODB_URI` environment variable
4. Deploy! 🎉

## 📊 Database Models

**Customer:** name, email, phone, address  
**Product:** name, category, price, stock  
**Sale:** customer, product, quantity, amounts, status, payments

## 💡 About This Project

Built entirely through AI-assisted development (vibe coding) using Claude AI and ChatGPT. This showcases:
- Rapid prototyping with AI
- Production-ready code generation
- Modern full-stack architecture
- Best practices implementation

**Human:** Provided vision and requirements  
**AI:** Generated complete codebase

## 👨‍💻 Author

**Rejwanul Isalm**
- Linkdin: [@Rejwanul Isalm](https://www.linkedin.com/in/rejwanul-islam-b07aa0325)
- GitHub: [@Rejwanul Isalm](https://github.com/RejwanulIslam)
- Email: rejwanul.islam22@gmail.com

## 🙏 Credits

- **Claude AI** & **ChatGPT** - AI development partners
- Next.js, MongoDB, Vercel, Tailwind CSS

## 📝 License

MIT License - feel free to use for your projects!

---

⭐ **Star this repo if you like it!**

🤖 **Built with Vibe Coding • Powered by Claude AI & ChatGPT • Made in 2 hours** ⚡

---

*Demonstrating the future of AI-assisted software development* 🚀