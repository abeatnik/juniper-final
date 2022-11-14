import { Stack, Card } from "@prisma/client";
import { useState } from "react";
import DeleteCard from "./DeleteCard";
import SingleCard from "./SingleCard";
import { Droppable, Draggable } from "react-beautiful-dnd";

interface CardProps {
    cards: Card[] | [];
    stackName: string | null;
    deleteCard: (cardId: string) => void;
}

const CardsComponent: React.FC<CardProps> = (props: CardProps) => {
    const showCards =
        props.cards &&
        props.cards.map((card, index) => {
            return (
                <>
                    <Draggable
                        key={card.id}
                        draggableId={card.id}
                        index={index}
                    >
                        {(provided) => (
                            <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                            >
                                <SingleCard
                                    card={card}
                                    stackName={props.stackName}
                                    deleteCard={props.deleteCard}
                                />
                            </li>
                        )}
                    </Draggable>
                </>
            );
        });

    return (
        <>
            <Droppable droppableId={props.stackName || "stack"}>
                {(provided) => (
                    <ul
                        className="cards-list"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {showCards}
                    </ul>
                )}
            </Droppable>
        </>
    );
};

export default CardsComponent;
