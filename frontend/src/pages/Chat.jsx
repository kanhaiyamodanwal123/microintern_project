import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import api from "../api/api";
import useAuth from "../context/useAuth";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Chat() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Video call states
  const [inCall, setInCall] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState(null);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const myVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const connectionRef = useRef(null);

  const token = localStorage.getItem("token");

  // Load task info and messages
  useEffect(() => {
    const loadData = async () => {
      try {
        const taskRes = await api.get(`/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(taskRes.data);

        const msgRes = await api.get(`/api/messages/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(msgRes.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load chat");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [taskId]);

  // Socket connection
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    // Register user ID for video calling
    socketRef.current.on("connect", () => {
      socketRef.current?.emit("register", user?.id);
    });

    socketRef.current.emit("joinTask", taskId);

    // Listen for incoming calls
    // Video call events
    socketRef.current.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
      setCallStarted(true);
    });

    socketRef.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      connectionRef.current?.signal(signal);
    });

    socketRef.current.on("callEnded", () => {
      endCall();
    });

    // Note: We don't listen for newMessage here because the message is already
    // added to state from the API response in the send() function

    return () => {
      socketRef.current?.disconnect();
    };
  }, [taskId, user?.id]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Video effects
  useEffect(() => {
    if (inCall && callAccepted) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }
          
          if (connectionRef.current) {
            connectionRef.current.peer?.addStream(stream);
          }
        })
        .catch((err) => console.log("Error accessing media devices:", err));
    }
  }, [inCall, callAccepted]);

  const send = async () => {
    if (!text.trim()) return;

    try {
      const msgData = { taskId, text: text.trim() };
      const res = await api.post("/api/messages", msgData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      socketRef.current?.emit("sendMessage", { taskId, messageId: res.data._id });
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Video call functions
  const startCall = () => {
    setInCall(true);
    setCallStarted(true);
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        });

        peer.on("signal", (data) => {
          socketRef.current?.emit("callUser", {
            userToCall: getOtherUserId(),
            signalData: data,
            from: user?.id,
            taskId,
          });
        });

        peer.on("stream", (stream) => {
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
        });

        socketRef.current?.on("callAccepted", (signal) => {
          setCallAccepted(true);
          peer.signal(signal);
        });

        connectionRef.current = { peer };
      })
      .catch((err) => {
        console.log("Error:", err);
        alert("Could not access camera/microphone");
        endCall();
      });
  };

  const answerCall = () => {
    setCallAccepted(true);
    setReceivingCall(false);
    setInCall(true);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream,
        });

        peer.on("signal", (data) => {
          socketRef.current?.emit("answerCall", {
            signal: data,
            to: caller,
          });
        });

        peer.on("stream", (stream) => {
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
        });

        peer.signal(callerSignal);
        connectionRef.current = { peer };
      })
      .catch((err) => {
        console.log("Error:", err);
        alert("Could not access camera/microphone");
        endCall();
      });
  };

  const endCall = () => {
    setInCall(false);
    setCallStarted(false);
    setCallAccepted(false);
    setReceivingCall(false);
    setCallEnded(true);
    
    if (connectionRef.current?.peer) {
      connectionRef.current.peer.destroy();
    }
    connectionRef.current = null;
    
    // Stop all video tracks
    if (myVideoRef.current?.srcObject) {
      myVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    if (userVideoRef.current?.srcObject) {
      userVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    
    setTimeout(() => setCallEnded(false), 1000);
  };

  const getOtherUserId = () => {
    if (!task || !user) return null;
    if (user.role === "employer") {
      const acceptedStudent = task.applicants?.find(
        a => a.student && ["accepted", "in_progress", "submitted"].includes(a.status)
      );
      return acceptedStudent?.student?._id || acceptedStudent?.student;
    } else {
      return task.employer?._id || task.employer;
    }
  };

  const otherUser = user?.role === "employer" 
    ? task?.applicants?.find(a => ["accepted", "in_progress", "submitted"].includes(a.status))?.snapshot?.name
    : task?.employer?.name;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{task?.title || "Chat"}</h2>
            <p className="text-blue-100 text-sm">
              Chatting with {otherUser || "User"}
            </p>
          </div>
          <div className="flex gap-2">
            {/* Video Call Button */}
            {!inCall && !receivingCall && (
              <button
                onClick={startCall}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                📹 Video Call
              </button>
            )}
            {inCall && (
              <button
                onClick={endCall}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                📞 End Call
              </button>
            )}
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Incoming Call Notification */}
        {receivingCall && !callAccepted && (
          <div className="bg-yellow-100 border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📹</span>
              <span className="font-medium">Incoming video call from {otherUser}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={answerCall}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Accept
              </button>
              <button
                onClick={() => setReceivingCall(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {/* Video Call Display */}
        {inCall && (
          <div className="bg-black relative h-64 md:h-80">
            {/* Remote Video */}
            <div className="w-full h-full flex items-center justify-center">
              {callAccepted && !callEnded ? (
                <video
                  ref={userVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-white">Connecting...</div>
              )}
            </div>
            
            {/* My Video (small) */}
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
              <video
                ref={myVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Messages */}
        <div className={`h-[${inCall ? '300' : '500'}px] overflow-y-auto p-4 space-y-4 bg-gray-50`}>
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.sender?._id === user?.id || msg.sender === user?.id;
              return (
                <div
                  key={index}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isMe ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isMe ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {msg.sender?.name || "You"} •{" "}
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={send}
              disabled={!text.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

