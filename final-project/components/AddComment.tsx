import React, { FormEvent, useState } from "react";
import { Board, User, Stack, Card, Comment } from "@prisma/client";
import { useSession } from "next-auth/react";

interface AddCommentProps {
    cardId: string;
    addNewComment: (comment: (Comment & { user: User }) | null) => void;
}

const AddComment: React.FC<AddCommentProps> = ({ cardId, addNewComment }) => {
    const [text, setText] = useState("");
    const { data: session, status } = useSession();
    const email = session?.user?.email;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/create/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text.trim(), cardId, email }),
            });
            const newComment = await res.json();
            addNewComment(newComment);
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
                        name="comment"
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

export default AddComment;
