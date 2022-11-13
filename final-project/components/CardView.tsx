import { Stack, Card } from "@prisma/client";
import { useState } from "react";
import DeleteCard from "./DeleteCard";

interface CardProps {
    card: Card;
    toggleCard: () => void;
    deleteCard: (cardId: string | null) => void;
    stackName: string | null;
}

const CardView: React.FC<CardProps> = ({
    card,
    toggleCard,
    deleteCard,
    stackName,
}) => {
    const [showOptions, setShowOptions] = useState(false);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    return (
        <div className="card-background">
            <div
                className="card-view"
                onClick={() => showOptions && setShowOptions(false)}
            >
                <div>
                    <h2>{card.title}</h2>
                    <button onClick={toggleCard}>x</button>
                    <button onClick={toggleOptions}>...</button>
                </div>
                <p>{`from: ${stackName}`}</p>
                <p>{`created at ${new Date(card.createdAt).toUTCString()}`}</p>
                <div className="description">
                    <h4>Description</h4>
                    <p>{card.description}</p>
                </div>
                <div className="comments">
                    <h4>Comments</h4>
                </div>
            </div>
            {showOptions && (
                <div className="options-view">
                    <p>edit</p>
                    <p>add checklist</p>
                    <p>add deadline</p>
                    <p>attach link</p>
                    <p>add members (search)</p>
                    <p>archive</p>
                    <p>delete</p>
                    <DeleteCard cardId={card.id} deleteCard={deleteCard} />
                </div>
            )}
        </div>
    );
};

export default CardView;
