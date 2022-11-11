import React, { FormEvent, useState } from "react";
import { Board, User, Stack, Card } from "@prisma/client";

interface CreateStackProps {
    addNewStack: (stack: Stack & { cards: Card[] }) => void;
    boardId: string | null;
}
const CreateStack: React.FC<CreateStackProps> = ({ boardId, addNewStack }) => {
    const [title, setTitle] = useState("");
    const [editMode, setEditMode] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/create/stack/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, boardId }),
            });
            const newStack = await res.json();
            addNewStack(newStack);
            setEditMode(!editMode);
        } catch (error) {
            console.error(error);
        }
    };
    if (!editMode) {
        return (
            <button className="add-item" onClick={() => setEditMode(!editMode)}>
                +
            </button>
        );
    }

    return (
        <>
            <div className="add-stack-popup">
                <form onSubmit={handleSubmit}>
                    <p>New Stack: </p>
                    <input
                        name="stackTitle"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <button type="submit">Create New Stack</button>
                </form>
            </div>
        </>
    );
};

export default CreateStack;
