# Real-Time Chat Application

## Overview
This is a **real-time chat application** built with **Node.js**, **Express**, and **Socket.IO**. Users can join chat rooms, send instant messages, see who is online, and view typing indicators. The app features modern chat bubbles, user avatars (initials), and system notifications.

---

## Features

- Real-time messaging using **WebSockets (Socket.IO)**  
- **Multiple chat rooms** support  
- **User avatars** with initials  
- **Online users list** per room  
- **Typing indicators** to show when someone is typing  
- **System messages** (user joined/left notifications)  
- **Chat bubble styling** similar to WhatsApp/Slack  
- **Enter key support** to send messages  
- Fully responsive and styled with **CSS gradients**  

---

## Project Structure

chat-app/
│
├─ server.js # Node.js server with Socket.IO
├─ package.json # Project dependencies & scripts
├─ package-lock.json
├─ public/
│ ├─ index.html # Frontend HTML
│ ├─ style.css # CSS styles
│ └─ script.js # Frontend JS (Socket.IO client)

---

## Installation & Setup

1. **Clone the repository**
   
git clone <your-repo-url>
cd chat-app

Install dependencies
npm install


Start the server

npm start


Open the app

Go to http://localhost:3000 in your browser

Open multiple tabs to test real-time chat

Usage

1.Enter a username and room name to join

2.Type messages in the input box and press Enter or click Send

3.See online users on the right sidebar

4.Typing indicators show when someone is typing

5.System messages appear when users join or leave

Deployment

1.The app can be deployed on platforms like Render.com, Railway.app, or Fly.io

2.Make sure to set process.env.PORT || 3000 in server.js for dynamic port binding

3.Push your code to GitHub and connect it to the platform for continuous deployment

Technology Stack

Backend: Node.js, Express

Frontend: HTML, CSS, Vanilla JavaScript

Realtime Communication: Socket.IO

Deployment Platforms: Render, Railway, Fly.io
