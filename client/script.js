const socket = io("http://localhost:3000");

const joinBtn = document.getElementById("joinBtn");
const sendBtn = document.getElementById("sendBtn");

const joinContainer = document.getElementById("join-container");
const chatContainer = document.getElementById("chat-container");

const usernameInput = document.getElementById("username");
const roomInput = document.getElementById("room");
const messageInput = document.getElementById("messageInput");
const messagesDiv = document.getElementById("messages");
const typingIndicatorDiv = document.getElementById("typingIndicator");
let typingTimeout;

let username = "";
let room = "";

// Join room
joinBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  room = roomInput.value.trim();

  if (username === "" || room === "") {
    alert("Please enter username and room");
    return;
  }

  socket.emit("joinRoom", { username, room });

  joinContainer.classList.add("hidden");
  chatContainer.classList.remove("hidden");
});

// Send message function
function sendMessage() {
  const message = messageInput.value.trim();
  if (message === "") return;

  socket.emit("chatMessage", {
    username,
    room,
    message
  });

  messageInput.value = "";
}

// Send button click
sendBtn.addEventListener("click", sendMessage);

// ENTER key support (✅ correct place)
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
// Emit typing event
messageInput.addEventListener("input", () => {
  socket.emit("typing");

  // Clear previous timeout
  clearTimeout(typingTimeout);

  // Stop typing after 1.5 seconds of inactivity
  typingTimeout = setTimeout(() => {
    socket.emit("stopTyping");
  }, 1500);
});

const userListDiv = document.getElementById("user-list");

// Listen for updated users list
socket.on("roomUsers", ({ room, users }) => {
  userListDiv.innerHTML = `<h4>Online Users</h4>`;
  users.forEach(u => {
    const userDiv = document.createElement("div");
    userDiv.innerText = u.username;
    userListDiv.appendChild(userDiv);
  });
});


// Receive message
socket.on("message", (data) => {
     const container = document.createElement("div");
  
  if (data.username === "System") {
    // System messages: no avatar
    container.className = "message system";
    let displayMsg = data.message;
    if (data.message.includes("joined")) displayMsg = `👋 ${data.message}`;
    if (data.message.includes("left")) displayMsg = `🚪 ${data.message}`;
    container.innerText = `${displayMsg} (${data.time})`;
  } else {
    // User messages
    const isSelf = data.username === username;
    
    container.className = "message-container " + (isSelf ? "self" : "other");

    // Avatar
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.innerText = data.username.charAt(0).toUpperCase();

    // Message bubble
    const bubble = document.createElement("div");
    bubble.className = "message " + (isSelf ? "self" : "other");
    bubble.innerHTML = `<strong>${data.username}</strong><br>${data.message}
      <div class="timestamp">${data.time}</div>`;

    // Append bubble + avatar to container
    container.appendChild(avatar);
    container.appendChild(bubble);
  }

  messagesDiv.appendChild(container);
  messagesDiv.scroll({
    top: messagesDiv.scrollHeight,
    behavior: "smooth"
  });
});
// Someone started typing
socket.on("displayTyping", ({ username }) => {
  typingIndicatorDiv.innerText = `${username} is typing...`;
});

// Someone stopped typing
socket.on("hideTyping", ({ username }) => {
  typingIndicatorDiv.innerText = "";
});

