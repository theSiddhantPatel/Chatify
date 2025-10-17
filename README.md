<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/283ab749-1be1-46d1-93bb-c8ec404aefbc" /><div align="center">

# 💬 𝗠𝗘𝗥𝗡 𝗥𝗲𝗮𝗹-𝗧𝗶𝗺𝗲 𝗖𝗵𝗮𝘁 𝗔𝗽𝗽 

A modern full-stack **real-time chat application** built with the **𝗠𝗘𝗥𝗡** stack and **𝗦𝗼𝗰𝗸𝗲𝘁.𝗶𝗼**.  
It features secure **JWT authentication**, **Cloudinary image uploads**, **online presence indicators**,  
and a **beautiful responsive UI** built with React, Tailwind, and DaisyUI.



</div>

---

## 🌟 𝗛𝗶𝗴𝗵𝗹𝗶𝗴𝗵𝘁𝘀

🔐 **Custom JWT Authentication** (no third-party auth)  
⚡ **Real-time Messaging** via Socket.io  
🟢 **Online / Offline Presence Indicators**  
🔔 **Notification & Typing Sounds** (with toggle)  
📨 **Welcome Emails** on signup (via Resend API)  
🗂️ **Image Uploads** using Cloudinary  
🧰 **REST API** built with Node.js & Express  
🧱 **MongoDB** for persistent storage  
🚦 **API Rate-Limiting** powered by Arcjet  
🎨 **Modern UI** with React + Tailwind CSS + DaisyUI  
🧠 **Zustand** for state management  
🧑‍💻 **GitHub Workflow** (branches, PRs, merges)  
🚀 **Easy Deployment** (Sevalla / Render / Vercel)  
🧪 **Environment Setup** using `.env` file  

---

## ⚙️ 𝗕𝗮𝗰𝗸𝗲𝗻𝗱 𝗦𝗲𝘁𝘂𝗽 (`/backend`)

📁 Create a `.env` file inside the backend folder:

```bash
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
▶️ Run the backend:

bash
Copy code
cd backend
npm install
npm run dev
💻 𝗙𝗿𝗼𝗻𝘁𝗲𝗻𝗱 𝗦𝗲𝘁𝘂𝗽 (/frontend)
bash
Copy code
cd frontend
npm install
npm run dev
🔗 Open your browser and visit:
👉 http://localhost:5173

🧩 𝗧𝗲𝗰𝗵 𝗦𝘁𝗮𝗰𝗸
Layer	Technology
🖥️ Frontend	React, Tailwind CSS, DaisyUI
⚙️ Backend	Node.js, Express.js
💾 Database	MongoDB
🔄 Realtime	Socket.io
🔐 Auth	Custom JWT
🗂️ File Storage	Cloudinary
🧠 State Management	Zustand
🚀 Deployment	Sevalla / Render / Vercel

🧠 𝗙𝘂𝘁𝘂𝗿𝗲 𝗘𝗻𝗵𝗮𝗻𝗰𝗲𝗺𝗲𝗻𝘁𝘀
🔎 Message Search & Filters
🧵 Group Chats & Channels
🌐 Dark / Light Mode Toggle
📱 Mobile-friendly PWA support

<div align="center">
🖤 𝗕𝘂𝗶𝗹𝘁 𝘄𝗶𝘁𝗵 𝗟𝗼𝘃𝗲 𝗮𝗻𝗱 𝗠𝗘𝗥𝗡 𝗦𝘁𝗮𝗰𝗸
</div> ```
