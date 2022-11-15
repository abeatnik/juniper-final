import { Card } from "@prisma/client";
import CardView from "./CardView";
import { useState, useEffect } from "react";

interface SingleCardProps {
    card: Card;
    deleteCard: (cardId: string) => void;
    stackName: string | null;
    updateStacks: (
        cardId: string | undefined,
        oldStackId: string | undefined,
        newStackId: string | undefined
    ) => void;
    updateCard: (card: Card) => void;
}

const SingleCard: React.FC<SingleCardProps> = ({
    card,
    stackName,
    deleteCard,
    updateStacks,
    updateCard,
}) => {
    const [showCard, setShowCard] = useState(false);

    const toggleCard = () => {
        setShowCard(!showCard);
    };

    useEffect(() => {}, []);

    return (
        <>
            <div className="card" onClick={toggleCard}>
                <h4>{card.title}</h4>
            </div>
            {showCard && (
                <CardView
                    updateCard={updateCard}
                    card={card}
                    toggleCard={toggleCard}
                    stackName={stackName}
                    deleteCard={deleteCard}
                    updateStacks={updateStacks}
                />
            )}
        </>
    );
};

export default SingleCard;
