import React, { useEffect, useState } from "react";
import { Card } from "@prisma/client";

interface AttachLinkProps {
    cardId: string;
    updateCard: (card: Card) => void;
}

const AttachLink: React.FC<AttachLinkProps> = ({ cardId, updateCard }) => {
    const [url, setUrl] = useState("");
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") {
            return;
        }
        const data = await fetch("/api/preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, cardId }),
        });
        const updated = await data.json();
        console.log(updated);
        updated && updateCard(updated);
        setOpen(false);
    };

    return (
        <>
            <button id="link-button" onClick={() => setOpen(!open)}>
                attach link
            </button>
            {open && (
                <div className="move-popup">
                    <input
                        name="cardTitle"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={handleSubmit}
                    />
                    <button
                        className="nav-button"
                        onClick={() => setOpen(false)}
                    >
                        x
                    </button>
                </div>
            )}
        </>
    );
};

export default AttachLink;
