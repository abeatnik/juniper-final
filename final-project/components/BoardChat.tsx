import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useRouter } from "next/router";
import AddMessage from "./AddMessage";
import ChatMessages from "./ChatMessages";
import { Message, User } from "@prisma/client";

let socket: Socket;

const BoardChat = () => {
    const router = useRouter();
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState<
        (Message & { user: User })[] | null
    >(null);
    const boardId = router.asPath.split("/")[2];
    useEffect(() => {
        initSocket();
        getMessages();

        return () => {
            // socket && socket.disconnect();
        };
    }, []);

    const initSocket = async () => {
        console.log("initializing socket");
        await fetch("/api/socket");
        socket = io();

        socket.on("connect", () => {
            console.log("connected");
            socket.emit("room", `room-${boardId}`);
            setConnected(true);
        });

        socket.on("receiveMessage", (message: Message & { user: User }) => {
            setMessages(messages && [message, ...messages]);
        });

        socket.on("welcome", () => {
            console.log("hurray");
        });

        return socket;
    };

    const getMessages = async () => {
        const data = await fetch(`/api/messages/${boardId}`);
        const boardMessages: (Message & {
            user: User;
        })[] = await data.json();
        setMessages(boardMessages);
    };

    const addNewMessage = (message: Message & { user: User }) => {
        console.log(socket);
        socket.emit("newMessage", boardId, message);
    };

    return (
        <div className="chat-container">
            <h2>Chat</h2>
            <div className="message-container">
                <ChatMessages messages={messages} />
                <AddMessage addNewMessage={addNewMessage} boardId={boardId} />
            </div>
        </div>
    );
};

export default BoardChat;
