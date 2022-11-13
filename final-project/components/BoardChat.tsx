import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
let socket: Socket;

const BoardChat = () => {
    const [connected, setConnected] = useState(false);

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
            console.log("connected");
            console.log(socket);
        });
        return socket;
    };

    return <div>BoardChat</div>;
};

export default BoardChat;
