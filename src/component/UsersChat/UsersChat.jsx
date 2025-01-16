import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Typography, Box, List, ListItem, ListItemText,Avatar } from "@mui/material";
import { collection, query, orderBy, onSnapshot, doc, getDoc, addDoc, serverTimestamp, where } from "firebase/firestore";
import { FIREBASE_DB as db } from "../../config/firebase";

const Chat = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.userEmail;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const messagesEndRef = useRef(null);

  // Φόρτωση συνομιλιών του χρήστη
  useEffect(() => {
    if (!userEmail) return;

    const chatsQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", userEmail) // Εξασφαλίζει ότι το chat είναι ιδιωτικό
    );
    const unsubscribeChats = onSnapshot(chatsQuery, (snapshot) => {
      setChats(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribeChats();
  }, [userEmail]);

  // Φόρτωση μηνυμάτων και παραλήπτη
  useEffect(() => {
    if (!chatId || !userEmail) return;

    // Φόρτωση μηνυμάτων
    const messagesQuery = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("timestamp", "asc")
    );
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Φόρτωση παραλήπτη
    const fetchRecipient = async () => {
        try {
          const chatDoc = await getDoc(doc(db, "chats", chatId));
          if (chatDoc.exists()) {
            const chatData = chatDoc.data();
            const recipientEmail = chatData.participants.find(
              (email) => email !== userEmail // Βρίσκει τον παραλήπτη
            );
            setRecipient(recipientEmail || "Unknown");
          } else {
            setRecipient("Unknown");
          }
        } catch (error) {
          console.error("Error fetching recipient:", error);
          setRecipient("Unknown");
        }
      };
    
      fetchRecipient();

    return () => unsubscribeMessages();
  }, [chatId, userEmail]);

  // Αυτόματο scroll στα νέα μηνύματα
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chatId || !userEmail) {
    return <Typography>Error: Missing chat ID or user email</Typography>;
  }

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    await addDoc(collection(db, `chats/${chatId}/messages`), {
      senderEmail: userEmail,
      content: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };
  return (
    <Box display="flex" height="100vh">
      {/* Αριστερό Πάνελ: Λίστα συνομιλιών */}
      <Box
        width="30%"
        bgcolor="#f4f4f4"
        borderRight="1px solid #ccc"
        overflowY="auto"
        padding="10px"
      >
        <Typography variant="h6" gutterBottom>
          Your Chats
        </Typography>
        <List>
          {chats.map((chat) => {
            const recipient =
              chat.users.parent.email === userEmail
                ? chat.users.babysitter
                : chat.users.parent;
  
            return (
              <ListItem
                key={chat.id}
                button
                selected={chat.id === chatId}
                onClick={() =>
                  navigate(`/chat/${chat.id}`, { state: { userEmail } })
                }
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Avatar
                  src={recipient.photoURL || "default_image.jpg"}
                  alt={recipient.name || "Chat Partner"}
                  sx={{ width: 40, height: 40 }}
                />
                <ListItemText primary={recipient.name || "Chat Partner"} />
              </ListItem>
            );
          })}
        </List>
      </Box>
  
      {/* Κεντρικό Πάνελ: Συνομιλία */}
      {/* Κεντρικό Πάνελ: Συνομιλία */}
<Box flex="1" display="flex" flexDirection="column">
  {/* Επικεφαλίδα: Όνομα και φωτογραφία συνομιλητή */}
  <Box
    bgcolor="#eee"
    padding="10px"
    borderBottom="1px solid #ccc"
    display="flex"
    alignItems="center"
    gap="10px"
  >
    {(() => {
      // Find the currently selected chat based on chatId
      const selectedChat = chats.find((c) => c.id === chatId);

      if (selectedChat) {
        const recipientDetails =
          selectedChat.users.parent.email === userEmail
            ? selectedChat.users.babysitter
            : selectedChat.users.parent;

        return (
          <>
            <Avatar
              src={recipientDetails?.photoURL || "default_image.jpg"}
              alt={recipientDetails?.name || "Chat Partner"}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="h6">
              {recipientDetails?.name || "Chat Partner"}
            </Typography>
          </>
        );
      }
      return null; // If no chat is selected, don't display anything
    })()}
  </Box>

  {/* Μηνύματα */}
  <Box
    flex="1"
    overflowY="auto"
    padding="10px"
    bgcolor="#f9f9f9"
    borderBottom="1px solid #ccc"
  >
    {messages.map((msg) => (
      <div
        key={msg.id}
        style={{
          textAlign: msg.senderEmail === userEmail ? "right" : "left",
          margin: "10px 0",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "10px",
            backgroundColor:
              msg.senderEmail === userEmail ? "#d1ffd6" : "#fff",
            borderRadius: "10px",
          }}
        >
          <div>{msg.content}</div>
          <small
            style={{
              display: "block",
              marginTop: "5px",
              color: "#999",
            }}
          >
            {msg.timestamp?.toDate().toLocaleTimeString() || "Sending..."}
          </small>
        </div>
      </div>
    ))}
    <div ref={messagesEndRef} />
  </Box>

  {/* Πεδία για εισαγωγή μηνυμάτων */}
  <Box padding="10px" display="flex" gap="10px">
    <input
      type="text"
      placeholder="Type a message..."
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      style={{
        flex: "1",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
      }}
    />
    <button
      onClick={sendMessage}
      disabled={newMessage.trim() === ""}
      style={{
        padding: "10px 20px",
        borderRadius: "5px",
        backgroundColor:
          newMessage.trim() === "" ? "#ccc" : "#4CAF50",
        color: "white",
        border: "none",
        cursor: newMessage.trim() === "" ? "not-allowed" : "pointer",
      }}
    >
      Send
    </button>
  </Box>
</Box>

    </Box>
  );
  
  
};

export default Chat;
