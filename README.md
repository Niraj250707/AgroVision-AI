# AgroVision-AI
AgroVision AI — Empowering 14.6 Crore Indian farmers with AI-driven post-harvest decisions. Our platform calculates real net profit across 4 selling strategies, explains recommendations via voice in local languages, and connects farmers with verified buyers — all in one seamless platform.
<div align="center">

# 🌾 AgroVision AI

### *AI-Powered Post-Harvest Decision & Transaction Platform for Indian Farmers*

[![SIH 2026](https://img.shields.io/badge/SIH-2026-orange?style=for-the-badge&logo=gov)](https://sih.gov.in)
[![PS 132](https://img.shields.io/badge/PS-132-green?style=for-the-badge)](https://sih.gov.in)
[![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**🏆 Smart India Hackathon 2026 | Ministry of Agriculture & Farmers Welfare**

**Problem Statement 132: Strengthening Market Linkages and Price Discovery for Farmers**

[🚀 Live Demo](#demo) • [📖 Documentation](#documentation) • [💻 Installation](#installation) • [🤝 Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [🎯 Problem Statement](#-problem-statement)
- [💡 Our Solution](#-our-solution)
- [✨ Key Features](#-key-features)
- [🎥 Demo](#-demo)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Quick Start](#-quick-start)
- [📊 Impact & Benefits](#-impact--benefits)
- [🆚 Competitive Advantage](#-competitive-advantage)
- [📁 Project Structure](#-project-structure)
- [🔌 API Reference](#-api-reference)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [👥 Team](#-team)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

---

## 🎯 Problem Statement

> **"Small and marginal farmers in India lose ₹92,000 Crore annually due to post-harvest inefficiencies, information asymmetry, and weak market linkages."**

### The Reality

India has **14.6 Crore farming households**, of which **86% are small and marginal farmers**. After harvest, these farmers face a critical decision — but they lack the information and tools to make the right one:

| Challenge | Impact |
|-----------|--------|
| 🚫 **No Price Awareness** | Don't know prices in other mandis |
| 🚫 **No Buyer Awareness** | Unaware of verified buyers (processors, exporters, retailers) |
| 🚫 **No Cost Calculation** | Can't factor transport, storage, and risk costs |
| 🚫 **Weak Bargaining Power** | Middlemen exploit information gaps |
| 🚫 **No Decision Framework** | No tool to compare "Sell Now vs Store vs Transport vs Split" |

### Real-Life Impact

> **Ramesh, a cotton farmer in Anand, Gujarat**, had 10 quintals of cotton. His local trader offered ₹7,200/quintal. Unknown to him, a processor in Vadodara (40 km away) was ready to pay ₹7,800/quintal. After deducting ₹180/quintal transport, his net profit would have been **₹600/quintal higher** — a total gain of **₹6,000** he never realized.
>
> *This story repeats for lakhs of farmers every single season.*

---

## 💡 Our Solution

### 🌟 AgroVision AI

**India's first Net-Profit-First AI platform** that doesn't just show prices — it tells farmers **exactly what to do**, explains **why** in their own language, and helps them **complete the transaction**.

### Core Philosophy

```
📊 Data → 🧠 Decision → 🗣️ Explanation → 🤝 Transaction
```

### One-Line Pitch

> *"We don't give farmers data. We give them decisions. We don't show prices. We show net profit. We don't speak English. We speak the farmer's language."*

---

## ✨ Key Features

### 🎯 Primary Features (Core to PS 132)

| Feature | Description | Status |
|---------|-------------|--------|
| 🤖 **AI Net-Profit Decision Engine** | Compares 4 strategies (Sell Now / Other Market / Store & Wait / Split) with full cost calculation | ✅ Implemented |
| 📈 **Smart Multi-Strategy Recommendation** | Exact "Where + When + How Much + Why" with confidence score | ✅ Implemented |
| 🔗 **Verified Buyer Matching** | AI-powered matching with processors, exporters, institutional buyers by quality specs | ✅ Implemented |
| 🚚 **Logistics & Storage Optimizer** | Real-time transport cost + nearby cold storage availability & booking | ✅ Implemented |
| 🎙️ **AI Chatbot "AgroMitra"** | Voice-first, local-language (Hindi/Gujarati/Marathi) Jarvis-style navigation & explanation | ✅ Implemented |
| 📊 **Real-Time Market Intelligence** | Live mandi prices, arrivals, trends from Agmarknet + e-NAM + sale-window recommendation | ✅ Implemented |
| 🏛️ **FPO Aggregation Mode** | Collective selling, lot creation, and better bargaining power for Farmer Producer Organizations | ✅ Implemented |
| 🛡️ **Trust & Transparency Layer** | Buyer reliability score, payment tracking, quality grading, grievance redressal | ✅ Implemented |

### 🌱 Secondary Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🌾 **Light Pre-Planting Advisory** | Market-demand-based crop suggestions (not full soil advisory) | 🔄 In Progress |
| ⏰ **Harvest Timing Suggestion** | Optimal harvest window based on price trend forecasting | ✅ Implemented |
| 🌐 **Multi-Language + Voice Support** | Hindi, Gujarati, Marathi with full voice input/output | ✅ Implemented |
| 💬 **WhatsApp Integration** | Access key features via WhatsApp Business API for low-bandwidth users | 🔄 In Progress |
| 📴 **Offline Mode** | Basic features work without internet connectivity | 🔄 In Progress |
| 📖 **Farmer Success Stories** | Community-driven testimonials and knowledge sharing | 🔄 In Progress |

---

## 🎥 Demo

### 🎬 Live Application

```
🌐 Web App: https://agrovision-ai.vercel.app
📱 Mobile App: [Download APK](https://github.com/yourteam/agrovision-ai/releases)
💬 WhatsApp Bot: +91-XXXXX-XXXXX
```

### 📸 Screenshots

<div align="center">

| 🏠 Dashboard | 🤖 AI Chatbot | 📊 Market Analysis |
|:---:|:---:|:---:|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Chatbot](docs/screenshots/chatbot.png) | ![Analysis](docs/screenshots/analysis.png) |

| 🚚 Logistics | 🔗 Buyer Matching | 🏛️ FPO Dashboard |
|:---:|:---:|:---:|
| ![Logistics](docs/screenshots/logistics.png) | ![Matching](docs/screenshots/matching.png) | ![FPO](docs/screenshots/fpo.png) |

</div>

### 🎤 Sample Voice Interaction (Gujarati)

```
👨‍🌾 Farmer: "Mara kapas kya vachvu joie?"
🤖 AgroMitra: "Bhai, tame 40 quintal Vadodara ma vacho — vahan kharcho kadhi ne 
    pan ₹7,620 bache. 35 quintal store karo, 10 divas pachi bhav ₹8,100 thase. 
    25 quintal local processor ne vacho. Aam karine tamne ₹45,000 vadhare malse."
```

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER LAYER                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Farmer App  │  │ FPO Dashboard│  │ Buyer Portal │  │  WhatsApp Bot   │  │
│  │ (Flutter/iOS)│  │   (React)    │  │   (React)    │  │ (Low-Bandwidth) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘  │
└─────────┼─────────────────┼─────────────────┼───────────────────┼───────────┘
          │                 │                 │                   │
          └─────────────────┴─────────────────┴───────────────────┘
                                    │
                     ┌──────────────▼──────────────┐
                     │        API GATEWAY          │
                     │   (Auth + Rate Limiting)    │
                     └──────────────┬──────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           │                        │                        │
  ┌────────▼─────────┐   ┌─────────▼──────────┐   ┌─────────▼──────────┐
  │ DECISION ENGINE  │   │  MATCHING ENGINE   │   │ LOGISTICS ENGINE   │
  │ • Price Forecast │   │ • Buyer Matching   │   │ • Transport Cost   │
  │ • Net Profit Calc│   │ • Quality Match    │   │ • Storage Finder   │
  │ • Strategy Comp  │   │ • Digital Offers   │   │ • Route Optimize   │
  └────────┬─────────┘   └─────────┬──────────┘   └─────────┬──────────┘
           │                       │                        │
           └───────────────────────┼────────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │        AI/ML LAYER          │
                    │  ┌─────────────────────┐    │
                    │  │ Price Forecasting   │    │
                    │  │ (Prophet/LightGBM)  │    │
                    │  └─────────────────────┘    │
                    │  ┌─────────────────────┐    │
                    │  │ Recommendation      │    │
                    │  │ Engine + LLM (Groq) │    │
                    │  └─────────────────────┘    │
                    │  ┌─────────────────────┐    │
                    │  │ Voice Processing    │    │
                    │  │ (Whisper + TTS)     │    │
                    │  └─────────────────────┘    │
                    └──────────────┬──────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
┌─────────▼──────────┐  ┌─────────▼──────────┐  ┌─────────▼──────────┐
│   EXTERNAL APIs    │  │     DATABASE       │  │   EXTERNAL APIs    │
│  • Agmarknet       │  │  • PostgreSQL      │  │  • Google Maps     │
│  • e-NAM           │  │  • Redis (Cache)   │  │  • Weather API     │
│  • Govt Portals    │  │  • Firebase Auth   │  │  • Payment Gateway │
└────────────────────┘  └────────────────────┘  └────────────────────┘
```

### Data Flow

```
1. 🎤 Voice Input (Gujarati/Hindi/Marathi)
   ↓
2. 🧠 Whisper STT + LLM Intent Recognition
   ↓
3. 📊 Decision Engine fetches real-time data
   (Agmarknet + e-NAM + Google Maps + Weather)
   ↓
4. 🤖 AI/ML Layer runs forecasting & optimization
   (Prophet/LightGBM + Linear Programming)
   ↓
5. 💡 Recommendation Generated
   (4 strategies with net profit & confidence)
   ↓
6. 🗣️ AgroMitra explains in local language voice
   ↓
7. 🤝 If accepted → Buyer Matching → Logistics → Payment Tracking
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Badge |
|------------|---------|-------|
| **React 18** | Web Dashboard | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) |
| **Next.js 14** | SSR & SEO | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white) |
| **Flutter 3** | Mobile App (Android/iOS) | ![Flutter](https://img.shields.io/badge/Flutter-02569B?style=flat&logo=flutter&logoColor=white) |
| **Tailwind CSS** | Styling | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) |
| **Chart.js** | Data Visualization | ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white) |

### Backend
| Technology | Purpose | Badge |
|------------|---------|-------|
| **FastAPI** | High-performance API | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white) |
| **Python 3.10+** | Core Language | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) |
| **PostgreSQL** | Primary Database | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) |
| **Redis** | Caching & Sessions | ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white) |
| **Firebase** | Authentication | ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black) |
| **AWS S3** | Media Storage | ![AWS](https://img.shields.io/badge/AWS_S3-569A31?style=flat&logo=amazons3&logoColor=white) |

### AI / ML
| Technology | Purpose | Badge |
|------------|---------|-------|
| **Prophet** | Time-Series Price Forecasting | ![Prophet](https://img.shields.io/badge/Prophet-FF6F00?style=flat) |
| **LightGBM** | Gradient Boosting for Price Prediction | ![LightGBM](https://img.shields.io/badge/LightGBM-00BFFF?style=flat) |
| **Scikit-learn** | ML Models | ![Scikit](https://img.shields.io/badge/Scikit--learn-F7931E?style=flat&logo=scikit-learn&logoColor=white) |
| **Groq / Gemini** | LLM for Explainable AI | ![Groq](https://img.shields.io/badge/Groq-FF6B6B?style=flat) |
| **OpenAI Whisper** | Speech-to-Text | ![Whisper](https://img.shields.io/badge/Whisper-412991?style=flat&logo=openai&logoColor=white) |
| **Coqui TTS** | Text-to-Speech (Indic Languages) | ![TTS](https://img.shields.io/badge/Coqui_TTS-00A67E?style=flat) |

### DevOps
| Technology | Purpose | Badge |
|------------|---------|-------|
| **Docker** | Containerization | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) |
| **AWS / Render** | Cloud Deployment | ![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazonaws&logoColor=white) |
| **GitHub Actions** | CI/CD | ![GitHub](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white) |

---

## ⚡ Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- Flutter 3.0+ (for mobile)
- Docker (optional)
- PostgreSQL 14+
- Redis 7+

### 🖥️ Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourteam/agrovision-ai.git
cd agrovision-ai/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys (Agmarknet, Google Maps, Groq, etc.)

# Run database migrations
alembic upgrade head

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 🌐 Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### 📱 Mobile App Setup

```bash
cd ../mobile

# Install dependencies
flutter pub get

# Run on emulator or device
flutter run
```

### 🐳 Docker Setup (Recommended)

```bash
# Build and run all services
docker-compose up --build

# Access services:
# Web App: http://localhost:3000
# API Docs: http://localhost:8000/docs
# Mobile: Build APK from container
```

---

## 📊 Impact & Benefits

### 📈 Economic Impact
| Metric | Value |
|--------|-------|
| 💰 **Farmer Income Increase** | 8-15% better net realization |
| 📉 **Post-Harvest Loss Reduction** | Target 20-25% reduction |
| 💸 **Transaction Cost Savings** | Optimized transport & digital matching |
| 🏦 **Market Efficiency** | Improved price discovery across mandis |

### 👥 Social Impact
| Metric | Value |
|--------|-------|
| 🧑‍🌾 **Farmers Empowered** | 5-8 Lakh active users (3-year target) |
| 🏛️ **FPOs Supported** | 2,000-3,000 organizations |
| 👩 **Gender Inclusion** | Voice-first design includes women farmers |
| 📚 **Digital Literacy** | Voice interface removes literacy barriers |

### 🌍 Environmental Impact
| Metric | Value |
|--------|-------|
| 🚛 **Fuel Reduction** | Route optimization reduces transport emissions |
| 🗑️ **Food Waste Reduction** | Better planning = less rotting produce |
| 🌱 **Sustainable Farming** | Market-demand-based crop diversification |

---

## 🆚 Competitive Advantage

### Comparison with Existing Solutions

| Platform | Price Info | Net Profit Calc | Multi-Strategy | Buyer Matching | Voice Chatbot | Transaction Support | **Overall Gap** |
|----------|:----------:|:---------------:|:--------------:|:--------------:|:-------------:|:-------------------:|:---------------:|
| **e-NAM** | ✅ Strong | ❌ No | ❌ No | ⚠️ Limited | ❌ No | ✅ Strong | Complex for small farmers |
| **Agmarknet** | ✅ Strong | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | Only information |
| **DeHaat** | ✅ Good | ⚠️ Limited | ❌ No | ✅ Yes | ⚠️ Limited | ✅ Yes | Heavy physical network |
| **Ninjacart** | ⚠️ Medium | ❌ No | ❌ No | ✅ B2B | ❌ No | ✅ Strong | B2B focused |
| **Bijak** | ✅ Good | ❌ No | ❌ No | ✅ Strong | ❌ No | ✅ Good | Trading focused |
| **Kisan Suvidha** | ✅ Good | ❌ No | ❌ No | ❌ No | ⚠️ Limited | ❌ No | Basic info only |
| **🌾 AgroVision AI** | ✅ **Strong** | ✅ **Yes** | ✅ **Yes** | ✅ **Yes** | ✅ **Yes** | ✅ **Yes** | **Best Balance** |

### Why We Win

> **"Most platforms either give raw prices OR do full supply-chain. Almost NONE give clear multi-strategy net-profit recommendations with quantity allocation, explain it in simple local language through voice, AND help complete the transaction. We sit exactly in that gap."**

---

## 📁 Project Structure

```
agrovision-ai/
├── 📂 backend/
│   ├── 📂 app/
│   │   ├── 📂 api/              # API Routes
│   │   │   ├── 📄 auth.py
│   │   │   ├── 📄 decision.py
│   │   │   ├── 📄 matching.py
│   │   │   ├── 📄 logistics.py
│   │   │   ├── 📄 chatbot.py
│   │   │   └── 📄 marketplace.py
│   │   ├── 📂 core/             # Core Logic
│   │   │   ├── 📄 config.py
│   │   │   ├── 📄 security.py
│   │   │   └── 📄 dependencies.py
│   │   ├── 📂 models/           # Database Models
│   │   │   ├── 📄 user.py
│   │   │   ├── 📄 crop.py
│   │   │   ├── 📄 market.py
│   │   │   └── 📄 transaction.py
│   │   ├── 📂 services/         # Business Logic
│   │   │   ├── 📄 price_forecast.py
│   │   │   ├── 📄 net_profit.py
│   │   │   ├── 📄 buyer_match.py
│   │   │   ├── 📄 logistics.py
│   │   │   └── 📄 voice.py
│   │   ├── 📂 ml/               # ML Models
│   │   │   ├── 📄 prophet_model.py
│   │   │   ├── 📄 lightgbm_model.py
│   │   │   └── 📄 optimizer.py
│   │   └── 📄 main.py
│   ├── 📂 tests/
│   ├── 📄 Dockerfile
│   ├── 📄 requirements.txt
│   └── 📄 alembic.ini
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/       # Reusable Components
│   │   ├── 📂 pages/            # Next.js Pages
│   │   ├── 📂 hooks/            # Custom Hooks
│   │   ├── 📂 services/         # API Clients
│   │   ├── 📂 store/            # State Management
│   │   └── 📂 styles/
│   ├── 📄 package.json
│   └── 📄 Dockerfile
│
├── 📂 mobile/
│   ├── 📂 lib/
│   │   ├── 📂 screens/
│   │   ├── 📂 widgets/
│   │   ├── 📂 services/
│   │   └── 📂 models/
│   ├── 📄 pubspec.yaml
│   └── 📄 Dockerfile
│
├── 📂 ml-models/
│   ├── 📂 price-forecasting/
│   ├── 📂 recommendation/
│   └── 📂 voice-processing/
│
├── 📂 docs/
│   ├── 📂 screenshots/
│   ├── 📂 architecture/
│   └── 📂 presentations/
│
├── 📄 docker-compose.yml
├── 📄 README.md
├── 📄 LICENSE
└── 📄 CONTRIBUTING.md
```

---

## 🔌 API Reference

### Base URL
```
Production: https://api.agrovision-ai.com/v1
Development: http://localhost:8000/v1
```

### Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer <your_jwt_token>
```

### Core Endpoints

#### 🧠 Decision Engine
```http
POST /v1/decision/analyze
Content-Type: application/json

{
  "crop": "cotton",
  "quantity_kg": 1000,
  "location": {
    "lat": 22.5645,
    "lng": 72.9289,
    "village": "Anand",
    "district": "Anand",
    "state": "Gujarat"
  },
  "quality_grade": "A",
  "harvest_date": "2026-09-01"
}
```

**Response:**
```json
{
  "recommendation": {
    "primary_strategy": "split_allocation",
    "confidence_score": 0.87,
    "expected_net_profit": 485000,
    "currency": "INR"
  },
  "strategies": [
    {
      "type": "sell_now_local",
      "allocation_kg": 250,
      "price_per_kg": 72.00,
      "transport_cost": 0,
      "storage_cost": 0,
      "net_profit": 18000,
      "risk_score": "low"
    },
    {
      "type": "sell_other_market",
      "allocation_kg": 400,
      "market": "Vadodara APMC",
      "price_per_kg": 78.00,
      "transport_cost": 1800,
      "storage_cost": 0,
      "net_profit": 29200,
      "risk_score": "medium"
    },
    {
      "type": "store_and_wait",
      "allocation_kg": 350,
      "predicted_price_per_kg": 81.00,
      "storage_cost": 3500,
      "storage_days": 10,
      "net_profit": 26600,
      "risk_score": "medium-high"
    }
  ],
  "explanation": {
    "hindi": "Aap 400 kg Vadodara bhejein — ₹29,200 fayda...",
    "gujarati": "Tame 400 kg Vadodara ma moklo — ₹29,200 faydo..."
  }
}
```

#### 🎙️ Chatbot (Voice/Text)
```http
POST /v1/chatbot/converse
Content-Type: application/json

{
  "message": "Mara kapas kya vachvu joie?",
  "language": "gujarati",
  "input_mode": "voice",
  "audio_base64": "...",
  "farmer_id": "farmer_123"
}
```

#### 🔗 Buyer Matching
```http
GET /v1/buyers/match?crop=cotton&quantity=1000&quality=A&location=Anand,Gujarat
```

#### 📊 Market Intelligence
```http
GET /v1/market/prices?crop=cotton&mandi=Vadodara&days=7
```

For full API documentation, visit: `http://localhost:8000/docs` (Swagger UI)

---

## 🧪 Testing

```bash
# Run backend tests
cd backend
pytest tests/ -v --cov=app

# Run frontend tests
cd frontend
npm test

# Run mobile tests
cd mobile
flutter test

# Run integration tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### How to Contribute
1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💻 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔃 Open a Pull Request

---

## 👥 Team

<div align="center">

### 🏆 Code Warriors — SIH 2026

| Role | Name | GitHub |
|------|------|--------|
| 👨‍💻 **Team Lead & Backend** | [Prajapati Nilesh] | [@King Nilesh](https://github.com/NileshHI-coder) |
| 🎨 **Frontend Lead** | [Name] | [@github](https://github.com/) |
| 📱 **FullStack Developer** | [Niraj Sharma] | [@github](https://github.com/) |
| 🤖 **ML/AI Engineer** | [Name] | [@github](https://github.com/) |
| 📝 **Research & Documentation** | [Name] | [@github](https://github.com/) |

**Mentor:** [MihirKumar Rabari] | **Institution:** [Madhuben and Bhanubhai Patel Institute of Technology]

</div>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- 🏛️ **Ministry of Agriculture & Farmers Welfare** for the Problem Statement 132
- 🎓 **Smart India Hackathon 2026** for the platform
- 📊 **Agmarknet** & **e-NAM** for open price data
- 🗺️ **Google Maps Platform** for distance and logistics APIs
- 🤖 **Groq** & **Google Gemini** for LLM capabilities
- 🎙️ **OpenAI Whisper** & **Coqui TTS** for voice processing
- 🌾 **NABARD** & **FAO** for agricultural research data

---

<div align="center">

### 🌾 *Empowering Every Farmer, One Decision at a Time* 🌾

**[⬆ Back to Top](#-agrovision-ai)**

Made with ❤️ by **Code Warriors** for **SIH 2026**

</div>
