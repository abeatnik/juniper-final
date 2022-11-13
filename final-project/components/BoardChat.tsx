import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useRouter } from "next/router";
let socket: Socket;

const BoardChat = () => {
    const router = useRouter();
    const [connected, setConnected] = useState(false);
    const boardId = router.asPath;
    useEffect(() => {
        initSocket();

        return () => {
            socket && console.log("socket", socket);
            socket && socket.disconnect();
        };
    }, []);

    const initSocket = async () => {
        await fetch("/api/socket");
        socket = io();

        socket.on("connect", () => {
            socket.emit("room", `room-${boardId}`);
            console.log("connected");
            console.log(socket.id);
        });
        return socket;
    };

    return <div>BoardChat</div>;
};

export default BoardChat;
