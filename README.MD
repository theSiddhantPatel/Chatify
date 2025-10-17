💬 MERN Real-Time Chat App

A modern full-stack chat application built using the MERN stack with Socket.io for real-time communication. It features secure JWT authentication, cloud image uploads, online status indicators, and a beautiful responsive UI.

🌟 Highlights

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

🧪 Environment Variable Setup via .env file

⚙️ Backend Setup (/backend)

Create a .env file inside the backend folder:

PORT=3000
MONGO_URI=your_mongo_uri_here
NODE_ENV=development
JWT_SECRET=your_jwt_secret

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email_from_address
EMAIL_FROM_NAME=your_email_from_name

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

Run the backend:

cd backend
npm install
npm run dev

💻 Frontend Setup (/frontend)
cd frontend
npm install
npm run dev

Then open http://localhost:5173
in your browser.

🧩 Tech Stack
Layer Technology
Frontend React, Tailwind CSS, DaisyUI
Backend Node.js, Express.js
Database MongoDB
Realtime Socket.io
Auth Custom JWT
File Storage Cloudinary
State Management Zustand
Deployment Sevalla / Render / Vercel
🧠 Future Enhancements

🔎 Message Search & Filters

🧵 Group Chats & Channels

🌐 Dark / Light Mode Toggle

📱 Mobile-friendly PWA support
