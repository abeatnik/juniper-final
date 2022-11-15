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
    const [seen, setSeen] = useState(0);
    const [notification, setNotification] = useState(false);
    const [messages, setMessages] = useState<
        (Message & { user: User })[] | null
    >(null);
    const boardId = router.asPath.split("/")[2];
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        getMessages();
    }, []);

    useEffect(() => {
        initSocket();
        return () => {
            // socket && socket.disconnect();
        };
    });

    const initSocket = async () => {
        console.log("initializing socket");
        await fetch("/api/socket");
        socket = socket || io();

        socket.on("connect", () => {
            console.log("connected");
            socket.emit("room", `room-${boardId}`);
            setConnected(true);
        });

        socket.on("receiveMessage", (message: Message & { user: User }) => {
            setMessages(messages && [message, ...messages]);
            if (messages && seen < messages.length) {
                setNotification(true);
            }
        });

        socket.on("welcome", () => {
            console.log("hurray", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("disconnected");
            setConnected(false);
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
        messages && setSeen(messages.length + 1);
        socket.emit("newMessage", boardId, message);
    };

    const activateChat = () => {
        setTimeout(() => {
            setExpanded(true);
            setNotification(false);
            messages && setSeen(messages.length);
        }, 300);
    };

    const deactivateChat = () => {
        setExpanded(false);
        setNotification(false);
    };

    return (
        <>
            {!expanded && (
                <>
                    <button
                        id="chat-button"
                        onMouseEnter={activateChat}
                    ></button>
                    {notification && <div className="notification"></div>}
                </>
            )}

            {expanded && (
                <div className="chat-container" onMouseLeave={deactivateChat}>
                    <span>
                        <button
                            className="nav-button"
                            onClick={() => {
                                setExpanded(false);
                            }}
                        >
                            x
                        </button>
                    </span>
                    <div className="message-container">
                        <ChatMessages messages={messages} />
                        <AddMessage
                            addNewMessage={addNewMessage}
                            boardId={boardId}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default BoardChat;
