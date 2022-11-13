import React from "react";
import { Message, User } from "@prisma/client";

const ChatMessages: React.FC<{
    messages: (Message & { user: User })[] | null;
}> = ({ messages }) => {
    const showMessages =
        messages &&
        messages.map((message) => {
            return (
                <li className="message" key={message.id}>
                    <div className="user-pic">
                        <img
                            src={message.user.image || undefined}
                            alt={message.user.name || undefined}
                        />
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
