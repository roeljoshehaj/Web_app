//This is not finished.
const inbox = document.getElementById("inbox");
const chatView = document.getElementById("chatView");
const chatHeader = document.getElementById("chatHeader");
const chatMessages = document.getElementById("chatMessages");
const chatInputBox = document.getElementById("chatInputBox");
const sendBtn = document.getElementById("sendBtn");
const backBtn = document.getElementById("backBtn");

const allMessagesLink = document.querySelector(".sidebar ul li");

const messages = [
  { sender: "Alice", subject: "Meeting Reminder", body: "Don't forget our meeting tomorrow at 10 AM." },
  { sender: "Bob", subject: "Weekend Plans", body: "Are you free this weekend? Let's catch up!" },
  { sender: "Charlie", subject: "Project Update", body: "The latest update is ready for review." },
  { sender: "Diana", subject: "Invoice", body: "Please find attached the invoice for last month." },
];

let currentChat = null;

function renderInbox() {
  inbox.innerHTML = "";
  messages.forEach((msg) => {
    const el = document.createElement("div");
    el.className = "message";
    el.innerHTML = `
      <h4>${msg.sender} - ${msg.subject}</h4>
      <p>${msg.body}</p>
    `;
    el.addEventListener("click", () => openChat(msg));
    inbox.appendChild(el);
  });
}

renderInbox();

function openChat(msg) {
  currentChat = msg;
  inbox.style.display = "none";
  chatView.style.display = "flex";
  chatHeader.textContent = `Chat with ${msg.sender}`;
  chatMessages.innerHTML = "";
  addBubble(msg.body, "received", msg.sender);
}

function addBubble(text, type, senderName) {
  const bubbleWrapper = document.createElement("div");
  bubbleWrapper.className = `bubble-wrapper ${type}`;

  const fromText = document.createElement("div");
  fromText.className = "from-label";
  fromText.textContent = type === "sent" ? "From You" : `From ${senderName}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  const time = document.createElement("div");
  time.className = "timestamp";
  time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  bubbleWrapper.appendChild(fromText);
  bubbleWrapper.appendChild(bubble);
  bubbleWrapper.appendChild(time);

  chatMessages.appendChild(bubbleWrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendBtn.addEventListener("click", () => {
  const msg = chatInputBox.value.trim();
  if (msg && currentChat) {
    addBubble(msg, "sent", "You");
    chatInputBox.value = "";
  }
});

allMessagesLink.addEventListener("click", () => {
  inbox.style.display = "block";
  chatView.style.display = "none";
});

backBtn.addEventListener("click", () => {
  inbox.style.display = "block";
  chatView.style.display = "none";
});
