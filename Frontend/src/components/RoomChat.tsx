import { useEffect, useRef, useState } from "react";

interface Props{
    roomCode : string,
    setRoomCode: React.Dispatch<React.SetStateAction<string>>;
    socket : WebSocket | null;
}

export default function RoomChat({roomCode, setRoomCode, socket} : Props){
    
    const containerRef = useRef<HTMLDivElement>(null);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([
            { text: "Hi there!", sender: "me" },
            { text: "Hello! How are you?", sender: "other" },
    ]);

    const handleSend = () => {
        if (newMessage.trim() === "") return;
        setMessages((m) => [...m, { text: newMessage, sender: "me" }]);
        socket?.send(JSON.stringify({
            type : "chat",
            payload : {
                message : newMessage
            }
        }))
        setNewMessage("");
    };

    const leaveRoom = () => {
        socket?.send(JSON.stringify({
            type : "leave",
            payload : {
                RoomId : roomCode
            }
        }))
        setRoomCode("");   
    }

    useEffect(() => {
        if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if(!socket){
            alert("Server is down");
            return;
        }
        socket.onmessage = (ev) => {
            const msg = ev.data.toString();
            setMessages((m) => [...m, { text: msg, sender: "other" }]);
        };
    
      }, []);
    

    return <div>
        <div className="flex items-center">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" onClick={leaveRoom} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-big-left-icon lucide-arrow-big-left hover:cursor-pointer hover:shadow-2xl text-lg"><path d="M18 15h-6v4l-7-7 7-7v4h6v6z"/></svg>
            </div>
            <p className="w-full text-3xl"> {roomCode}</p>
        </div>
        <div className="flex flex-col h-full flex-grow rounded-lg  overflow-hidden">
            <div className="flex-grow overflow-y-auto p-4 space-y-3 h-60 mt-2" ref={containerRef}>
                {messages.map((msg, index) => (
                    <div
                    key={index}
                    className={`max-w-[70%] p-2 rounded-lg break-words whitespace-pre-wrap font-bold ${
                        msg.sender === "me"
                        ? "ml-auto bg-gray-400 text-black"
                        : "mr-auto bg-white text-gray-800 border"
                    }`}
                    >
                    {msg.text}
                    </div>
                ))}
                </div>

        <div className="flex items-center border-t p-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Enter Message"
            className="flex-grow p-2 border rounded-md"
          />
          <button
            onClick={handleSend}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
}