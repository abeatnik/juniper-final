import { Stack, Card } from "@prisma/client";
import CardsComponent from "./CardsComponent";
import CreateCard from "./CreateCard";
import { useState, useEffect } from "react";

interface SingleStackProps {
    stack: (Stack & { cards: Card[] }) | null;
    updateStacks: (
        cardId: string | undefined,
        oldStackId: string | undefined,
        newStackId: string | undefined
    ) => void;
    addNewCard: (card: Card) => void;
}

const SingleStackComponent: React.FC<SingleStackProps> = ({
    stack,
    updateStacks,
    addNewCard,
}) => {
    const [stackCards, setStackCards] = useState<Card[]>([]);

    useEffect(() => {
        stack && setStackCards(stack.cards);
    });

    const deleteCard = (cardId: string) => {
        stackCards &&
            setStackCards(stackCards.filter((card) => card.id !== cardId));
    };

    return (
        <div className="stack">
            <h2>{stack && stack.title}</h2>
            <CardsComponent
                cards={stackCards}
                stackName={stack?.title.split("").join("-") || null}
                deleteCard={deleteCard}
                updateStacks={updateStacks}
            />
            <CreateCard addNewCard={addNewCard} stackId={stack && stack.id} />
        </div>
    );
};

export default SingleStackComponent;
