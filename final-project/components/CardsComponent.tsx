import { Stack, Card } from "@prisma/client";
import { useState } from "react";
import DeleteCard from "./DeleteCard";
import SingleCard from "./SingleCard";

interface CardProps {
    cards: Card[] | [];
    stackName: string | null;
    deleteCard: (cardId: string) => void;
}

const CardsComponent: React.FC<CardProps> = (props: CardProps) => {
    const showCards =
        props.cards &&
        props.cards.map((card) => {
            return (
                <li key={card.id}>
                    <SingleCard
                        card={card}
                        stackName={props.stackName}
                        deleteCard={props.deleteCard}
                    />
                </li>
            );
        });

    return <ul className="cards-list">{showCards}</ul>;
};

export default CardsComponent;
