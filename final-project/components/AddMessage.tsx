import React, { FormEvent, useState } from "react";
import { Board, User, Stack, Card, Comment, Message } from "@prisma/client";
import { useSession } from "next-auth/react";

interface AddMessageProps {
    boardId: string;
    addNewMessage: (message: Message & { user: User }) => void;
}

const AddMessage: React.FC<AddMessageProps> = ({ boardId, addNewMessage }) => {
    const [text, setText] = useState("");
    const { data: session, status } = useSession();
    const email = session?.user?.email;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/create/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, boardId, email }),
            });
            const newMessage = await res.json();
            addNewMessage(newMessage);
            setText("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="popup">
                <form onSubmit={handleSubmit}>
                    <textarea
                        name="message"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                    <button type="submit">Send</button>
                    <button className="close" onClick={() => setText("")}>
                        Cancel
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddMessage;
