import React, { FormEvent, useState } from "react";
import { Board, User, Stack, Card } from "@prisma/client";

interface CreateCardProps {
    addNewCard: (card: Card) => void;
    stackId: string | null;
}
const CreateCard: React.FC<CreateCardProps> = ({ stackId, addNewCard }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editMode, setEditMode] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/create/card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    stackId,
                }),
            });
            const newCard = await res.json();
            addNewCard(newCard);
            setTitle("");
            setDescription("");
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
            <div className="add-popup">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="cardTitle">Title: </label>
                        <input
                            name="cardTitle"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="cardDescription">Description: </label>
                        <input
                            name="cardDescription"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <button type="submit">Create New Card</button>
                        <button
                            className="nav-button"
                            onClick={() => setEditMode(!editMode)}
                        >
                            x
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateCard;
