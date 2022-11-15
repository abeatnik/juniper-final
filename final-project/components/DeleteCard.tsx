import React from "react";
import { useState } from "react";

interface DeleteCardProps {
    cardId: string;
    deleteCard: (cardId: string) => void;
}

const DeleteCard: React.FC<DeleteCardProps> = ({ cardId, deleteCard }) => {
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleDelete = async () => {
        try {
            const res = await fetch("/api/delete/card", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cardId }),
            });
            const { success } = await res.json();
            success && deleteCard(cardId);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <button className="delete" onClick={togglePopup}>
                delete card
            </button>
            {showPopup && (
                <div className="module-background">
                    <div className="move-popup">
                        <p>Delete this card?</p>
                        <button onClick={handleDelete}>Yes</button>
                        <button onClick={togglePopup}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteCard;
