import React, { useRef, useEffect } from "react";
import { Message, User } from "@prisma/client";

const ChatMessages: React.FC<{
    messages: (Message & { user: User })[] | null;
}> = ({ messages }) => {
    const elemRef = useRef<HTMLLIElement | null>(null);

    useEffect(() => {
        if (elemRef) {
            elemRef.current?.scrollIntoView();
        }
    }, [messages]);

    const reversed = messages?.map((message) => message).reverse();

    const showMessages =
        reversed &&
        reversed.map((message) => {
            return (
                <li className="message" key={message.id} ref={elemRef}>
                    <div className="user-pic">
                        <img
                            src={message.user.image || undefined}
                            alt={message.user.name || undefined}
                        />
                    </div>
                    <div className="message-content">
                        <p>{message.user.name || undefined}</p>
                        <p>{new Date(message.user.createdAt).toUTCString()}</p>
                        <p>{message.text}</p>
                    </div>
                </li>
            );
        });

    return <ul className="messages-list">{showMessages}</ul>;
};

export default ChatMessages;
