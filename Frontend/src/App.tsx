import { useEffect, useState } from 'react';
import './App.css';
import JoinRoom from './components/JoinRoom';
import RoomChat from './components/RoomChat';

function App() {
  const [roomCode, setRoomCode] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
      const wss = new WebSocket("ws://localhost:8080");
      setWs(wss);
  
      wss.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
  
      return () => {
        wss.close();
      };
    }, []);

  return (
    <div className='flex justify-center items-center bg-[#222831]'>
        <div className='border h-100 w-200 p-10 shadow-lg rounded-lg'>
            {roomCode == "" ? <JoinRoom setRoomCode={setRoomCode} socket={ws}/> : <RoomChat roomCode={roomCode} setRoomCode={setRoomCode} socket={ws}/>}
        </div>  
    </div>
  );
}

export default App;
