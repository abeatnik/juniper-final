import { Stack, Card } from "@prisma/client";
import CardsComponent from "./CardsComponent";
import CreateCard from "./CreateCard";
import { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

interface SingleStackProps {
    stack: (Stack & { cards: Card[] }) | null;
    updateStacks: (
        cardId: string | undefined,
        oldStackId: string | undefined,
        newStackId: string | undefined
    ) => void;
    addNewCard: (card: Card) => void;
    updateCard: (card: Card) => void;
}

const SingleStackComponent: React.FC<SingleStackProps> = ({
    stack,
    updateStacks,
    addNewCard,
    updateCard,
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
                stackName={stack && stack.title}
                stackId={stack && stack.id}
                deleteCard={deleteCard}
                updateStacks={updateStacks}
                updateCard={updateCard}
            />
            <CreateCard addNewCard={addNewCard} stackId={stack && stack.id} />
        </div>
    );
};

export default SingleStackComponent;
