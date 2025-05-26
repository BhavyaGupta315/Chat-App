import { WebSocketServer, WebSocket } from "ws";

const ws = new WebSocketServer( {port : 8080} );

/**
Server -> 
    When client joins, enter them 
    {   
        type : chat
        payload : {
            message : "message"
        }
    }
    {
        Room1 : [],
        Room2 : [],
        Room3 : []
    }
Client ->
    {
        type : join
        paylaod : {
            RoomId : "212"    
        }
    }

    {
        type : chat
        payload : {
            message : "Hi There"
        }
    }
    {
        type : leave
        payload : {
            RoomId : "123"
        }
    }
 */

const allRooms = new Map<string, WebSocket[]>();
const allSocket = new Map<WebSocket, string>();

ws.on("connection", (socket) => {
    socket.on("message", (message) => {
        let data = JSON.parse(message.toString());
        if(data.type === "join"){
            const room = data.payload.RoomId;
            const sockets = allRooms.get(room) || [];
            allRooms.set(room, [...sockets, socket]);
            allSocket.set(socket, room);
        }
        if(data.type === "chat"){
            if(!allSocket.has(socket)){
                socket.send("Not Connected to any room");
                return;
            }
            const room = allSocket.get(socket);
            if (!room) {
                socket.send("Room information not available");
                return;
            }
            const sockets = allRooms.get(room);
            const message = data.payload.message;
            sockets?.forEach((s) => {if(s!=socket)s.send(message)});
        }
        if(data.type === "leave"){
            const room = data.payload.RoomId;
            const sockets = allRooms.get(room);
            if (sockets){
                const filteredSockets = sockets.filter(socketInArray => socketInArray !== socket);
                allRooms.set(room, filteredSockets);
            }
        }
    })
})