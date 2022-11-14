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
}

const SingleStackComponent: React.FC<SingleStackProps> = ({
    stack,
    updateStacks,
}) => {
    const [stackCards, setStackCards] = useState<Card[]>([]);

    useEffect(() => {
        stack && setStackCards(stack.cards);
    });

    const addNewCard = (card: Card) => {
        stackCards && setStackCards([...stackCards, card]);
        !stackCards && setStackCards([card]);
    };

    const deleteCard = (cardId: string) => {
        stackCards &&
            setStackCards(stackCards.filter((card) => card.id !== cardId));
    };
    console.log(stack);
    return (
        <div className="stack">
            <h2>{stack && stack.title}</h2>
            <CardsComponent
                cards={stackCards}
                stackName={stack?.title || null}
                deleteCard={deleteCard}
                updateStacks={updateStacks}
            />
            <CreateCard addNewCard={addNewCard} stackId={stack && stack.id} />
        </div>
    );
};

export default SingleStackComponent;
