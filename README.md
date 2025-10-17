<div align="center">
https://img.shields.io/badge/MERN-RealTime_Chat_App-green
https://img.shields.io/badge/Version-1.0.0-blue
https://img.shields.io/badge/License-MIT-yellow

A modern full-stack chat application built using the MERN stack with Socket.io for real-time communication

</div>
✨ Features
<div align="center">
🔐 Authentication	⚡ Real-time	🎨 UI/UX
Custom JWT Auth	Socket.io Messaging	React + Tailwind
No third-party	Online Status	DaisyUI Components
Secure Sessions	Typing Indicators	Fully Responsive
</div>
🌟 Highlighted Features
🔐 Custom JWT Authentication (no third-party auth)

⚡ Real-time Messaging powered by Socket.io

🟢 Online / Offline Presence Indicators

🔔 Notification & Typing Sounds (with toggle option)

📨 Welcome Emails on signup (via Resend API)

🗂️ Image Uploads using Cloudinary

🧰 REST API built with Node.js & Express

🧱 MongoDB for persistent storage

🚦 API Rate-Limiting powered by Arcjet

🎨 Modern UI using React + Tailwind CSS + DaisyUI

🧠 Zustand for state management

🧑‍💻 GitHub Workflow (branches, PRs, merges)

🚀 Easy Deployment (free-tier friendly on Sevalla / Render / Vercel)

🚀 Quick Start
Prerequisites
Node.js (v18 or higher)

MongoDB Atlas account or local MongoDB instance

Cloudinary account for image uploads

Resend account for email services

Arcjet account for rate limiting

⚙️ Backend Setup (/backend)
1. Create Environment File
Create a .env file inside the backend folder:

env
# Server Configuration
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=your_mongo_uri_here

# Authentication
JWT_SECRET=your_jwt_secret

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email_from_address
EMAIL_FROM_NAME=your_email_from_name

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Rate Limiting (Arcjet)
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
2. Install & Run Backend
bash
cd backend
npm install
npm run dev
💻 Frontend Setup (/frontend)
bash
cd frontend
npm install
npm run dev
Then open http://localhost:5173 in your browser.

🛠️ Tech Stack
<div align="center">
Layer	Technology
Frontend	React, Tailwind CSS, DaisyUI
Backend	Node.js, Express.js
Database	MongoDB
Realtime	Socket.io
Auth	Custom JWT
File Storage	Cloudinary
State Management	Zustand
Deployment	Sevalla / Render / Vercel
</div>
📁 Project Structure
text
mern-chat-app/
├── 📂 backend/
│   ├── 📂 controllers/
│   ├── 📂 models/
│   ├── 📂 routes/
│   ├── 📂 middleware/
│   ├── 📂 utils/
│   └── 🚀 server.js
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   ├── 📂 pages/
│   │   ├── 📂 store/
│   │   ├── 📂 hooks/
│   │   └── 📂 utils/
│   └── 📂 public/
└── 📄 README.md
🔧 Environment Variables
Backend Configuration (.env)
Variable	Description	Required
PORT	Server port (default: 3000)	✅
MONGO_URI	MongoDB connection string	✅
JWT_SECRET	Secret key for JWT tokens	✅
RESEND_API_KEY	API key for Resend email service	✅
CLOUDINARY_CLOUD_NAME	Cloudinary cloud name	✅
CLOUDINARY_API_KEY	Cloudinary API key	✅
CLOUDINARY_API_SECRET	Cloudinary API secret	✅
ARCJET_KEY	Arcjet API key for rate limiting	✅
CLIENT_URL	Frontend URL for CORS	✅
EMAIL_FROM	Sender email address	✅
EMAIL_FROM_NAME	Sender display name	✅
🚀 Deployment
Free Tier Deployment Options:
Backend: Render, Sevalla, or Railway

Frontend: Vercel or Netlify

Database: MongoDB Atlas

File Storage: Cloudinary

Email: Resend

Deployment Steps:
Set up environment variables in your deployment platform

Deploy backend first

Update frontend environment variables with backend URL

Deploy frontend

🔮 Future Enhancements
<div align="center">
🎯 Feature	Status	Priority
🔎 Message Search & Filters	Planned	High
🧵 Group Chats & Channels	Planned	High
🌐 Dark/Light Mode Toggle	In Progress	Medium
📱 Mobile PWA Support	Planned	Medium
🔒 End-to-end Encryption	Planned	High
📊 Chat Analytics	Future	Low
🎨 Custom Themes & Emojis	Planned	Medium
🔄 Message Reactions	Planned	Medium
</div>
🤝 Contributing
We love your input! We want to make contributing as easy and transparent as possible.

Development Workflow:
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

Branch Naming Convention:
feature/ - for new features

fix/ - for bug fixes

docs/ - for documentation updates

refactor/ - for code refactoring

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Socket.io for real-time capabilities

Tailwind CSS and DaisyUI for beautiful UI components

Cloudinary for image management

Resend for email services

Arcjet for rate limiting protection

<div align="center">
Built with ❤️ using the MERN Stack

*© 2025 MERN Real-Time Chat App. All rights reserved.*

</div><style> /* Custom styles for better readability */ .markdown-body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; } .markdown-body h1, .markdown-body h2, .markdown-body h3 { border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; } .markdown-body table { border-collapse: collapse; width: 100%; } .markdown-body table th, .markdown-body table td { border: 1px solid #dfe2e5; padding: 6px 13px; text-align: left; } .markdown-body code { background-color: #f6f8fa; border-radius: 3px; padding: 0.2em 0.4em; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; } </style><div align="center">
https://img.shields.io/badge/MERN-RealTime_Chat_App-green
https://img.shields.io/badge/Version-1.0.0-blue
https://img.shields.io/badge/License-MIT-yellow

A modern full-stack chat application built using the MERN stack with Socket.io for real-time communication

</div>
✨ Features
<div align="center">
🔐 Authentication	⚡ Real-time	🎨 UI/UX
Custom JWT Auth	Socket.io Messaging	React + Tailwind
No third-party	Online Status	DaisyUI Components
Secure Sessions	Typing Indicators	Fully Responsive
</div>
🌟 Highlighted Features
🔐 Custom JWT Authentication (no third-party auth)

⚡ Real-time Messaging powered by Socket.io

🟢 Online / Offline Presence Indicators

🔔 Notification & Typing Sounds (with toggle option)

📨 Welcome Emails on signup (via Resend API)

🗂️ Image Uploads using Cloudinary

🧰 REST API built with Node.js & Express

🧱 MongoDB for persistent storage

🚦 API Rate-Limiting powered by Arcjet

🎨 Modern UI using React + Tailwind CSS + DaisyUI

🧠 Zustand for state management

🧑‍💻 GitHub Workflow (branches, PRs, merges)

🚀 Easy Deployment (free-tier friendly on Sevalla / Render / Vercel)

🚀 Quick Start
Prerequisites
Node.js (v18 or higher)

MongoDB Atlas account or local MongoDB instance

Cloudinary account for image uploads

Resend account for email services

Arcjet account for rate limiting

⚙️ Backend Setup (/backend)
1. Create Environment File
Create a .env file inside the backend folder:

env
# Server Configuration
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=your_mongo_uri_here

# Authentication
JWT_SECRET=your_jwt_secret

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email_from_address
EMAIL_FROM_NAME=your_email_from_name

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Rate Limiting (Arcjet)
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
2. Install & Run Backend
bash
cd backend
npm install
npm run dev
💻 Frontend Setup (/frontend)
bash
cd frontend
npm install
npm run dev
Then open http://localhost:5173 in your browser.

🛠️ Tech Stack
<div align="center">
Layer	Technology
Frontend	React, Tailwind CSS, DaisyUI
Backend	Node.js, Express.js
Database	MongoDB
Realtime	Socket.io
Auth	Custom JWT
File Storage	Cloudinary
State Management	Zustand
Deployment	Sevalla / Render / Vercel
</div>
📁 Project Structure
text
mern-chat-app/
├── 📂 backend/
│   ├── 📂 controllers/
│   ├── 📂 models/
│   ├── 📂 routes/
│   ├── 📂 middleware/
│   ├── 📂 utils/
│   └── 🚀 server.js
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   ├── 📂 pages/
│   │   ├── 📂 store/
│   │   ├── 📂 hooks/
│   │   └── 📂 utils/
│   └── 📂 public/
└── 📄 README.md
🔧 Environment Variables
Backend Configuration (.env)
Variable	Description	Required
PORT	Server port (default: 3000)	✅
MONGO_URI	MongoDB connection string	✅
JWT_SECRET	Secret key for JWT tokens	✅
RESEND_API_KEY	API key for Resend email service	✅
CLOUDINARY_CLOUD_NAME	Cloudinary cloud name	✅
CLOUDINARY_API_KEY	Cloudinary API key	✅
CLOUDINARY_API_SECRET	Cloudinary API secret	✅
ARCJET_KEY	Arcjet API key for rate limiting	✅
CLIENT_URL	Frontend URL for CORS	✅
EMAIL_FROM	Sender email address	✅
EMAIL_FROM_NAME	Sender display name	✅
🚀 Deployment
Free Tier Deployment Options:
Backend: Render, Sevalla, or Railway

Frontend: Vercel or Netlify

Database: MongoDB Atlas

File Storage: Cloudinary

Email: Resend

Deployment Steps:
Set up environment variables in your deployment platform

Deploy backend first

Update frontend environment variables with backend URL

Deploy frontend

🔮 Future Enhancements
<div align="center">
🎯 Feature	Status	Priority
🔎 Message Search & Filters	Planned	High
🧵 Group Chats & Channels	Planned	High
🌐 Dark/Light Mode Toggle	In Progress	Medium
📱 Mobile PWA Support	Planned	Medium
🔒 End-to-end Encryption	Planned	High
📊 Chat Analytics	Future	Low
🎨 Custom Themes & Emojis	Planned	Medium
🔄 Message Reactions	Planned	Medium
</div>
🤝 Contributing
We love your input! We want to make contributing as easy and transparent as possible.

Development Workflow:
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

Branch Naming Convention:
feature/ - for new features

fix/ - for bug fixes

docs/ - for documentation updates

refactor/ - for code refactoring

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Socket.io for real-time capabilities

Tailwind CSS and DaisyUI for beautiful UI components

Cloudinary for image management

Resend for email services

Arcjet for rate limiting protection

<div align="center">
Built with ❤️ using the MERN Stack

*© 2025 MERN Real-Time Chat App. All rights reserved.*

</div><style> /* Custom styles for better readability */ .markdown-body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; } .markdown-body h1, .markdown-body h2, .markdown-body h3 { border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; } .markdown-body table { border-collapse: collapse; width: 100%; } .markdown-body table th, .markdown-body table td { border: 1px solid #dfe2e5; padding: 6px 13px; text-align: left; } .markdown-body code { background-color: #f6f8fa; border-radius: 3px; padding: 0.2em 0.4em; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; } </style>
