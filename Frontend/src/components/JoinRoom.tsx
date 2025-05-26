import { useRef } from "react";

type JoinRoomProps = {
  setRoomCode: React.Dispatch<React.SetStateAction<string>>;
  socket : WebSocket | null;
};

export default function JoinRoom({setRoomCode, socket} : JoinRoomProps){
    const inputRef = useRef<HTMLInputElement>(null);
    const enterRoom = () => {
        const roomCode = inputRef.current?.value;
        if(roomCode){
            if(!socket){
                alert("Server is Down");
                return;
            }
            socket.send(JSON.stringify({
                type : "join",
                payload : {
                    RoomId : roomCode
                }
            }))
            setRoomCode(roomCode);
        }else{
            alert("Please Enter Room Code");
        }
    }


    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        enterRoom();
        }
    };
    return <div>
        <h1 className="text-6xl">Enter a Room Code</h1>
        <div className="flex flex-col m-20 mt-10">
            <input className="border rounded-md m-10 flex items-center p-2" type="text" ref={inputRef} placeholder="Enter Room Code" onKeyDown={handleKeyPress}></input>
            <button onClick={enterRoom} className="mx-10">Enter Room</button>
        </div>
        
    </div>
}