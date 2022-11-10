import React, { FormEvent, useState } from "react";
import { Router } from "next/router";

const CreateBoard: React.FC<{ refreshData: () => Promise<boolean> }> = (props: {
    refreshData: () => Promise<boolean>;
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
            if (res.status < 300) {
                props.refreshData();
            }
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
                </form>
            </div>
        </>
    );
};

export default CreateBoard;
