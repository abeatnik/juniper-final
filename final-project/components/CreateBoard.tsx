import React, { FormEvent, useState } from "react";
import { Board } from "@prisma/client";

const CreateBoard: React.FC<{ addNewBoard: (board: Board) => void }> = ({
    addNewBoard,
}) => {
    const [title, setTitle] = useState("");
    const [editMode, setEditMode] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/create/board", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
            });
            const newBoard = await res.json();
            addNewBoard(newBoard);
            setTitle("");
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
            <div className="add-board-popup">
                <form onSubmit={handleSubmit}>
                    <p>Board Name: </p>
                    <input
                        name="newBoard"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <button type="submit">Create New Board</button>
                    <button
                        className="add-item"
                        onClick={() => setEditMode(!editMode)}
                    >
                        x
                    </button>
                </form>
            </div>
        </>
    );
};

export default CreateBoard;
