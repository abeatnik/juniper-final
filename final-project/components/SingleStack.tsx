import { Stack, Card } from "@prisma/client";
import CardsComponent from "./CardsComponent";
import CreateCard from "./CreateCard";
import { useState, useEffect } from "react";

interface SingleStackProps {
    stack: (Stack & { cards: Card[] }) | null;
}

const SingleStackComponent: React.FC<SingleStackProps> = ({ stack }) => {
    const [stackCards, setStackCards] = useState<Card[]>([]);

    useEffect(() => {
        stack && setStackCards(stack.cards);
    }, []);

    const addNewCard = (card: Card) => {
        setStackCards([...stackCards, card]);
    };

    return (
        <div className="stack">
            <h2>{stack && stack.title}</h2>
            <CardsComponent cards={stackCards} />
            <CreateCard addNewCard={addNewCard} stackId={stack && stack.id} />
        </div>
    );
};

export default SingleStackComponent;
