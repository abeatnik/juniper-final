import { Stack, Card } from "@prisma/client";
import CreateStack from "./CreateStack";
import SingleStackComponent from "./SingleStack";
import { useState, useEffect } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "react-beautiful-dnd";
import { useRouter } from "next/router";

interface StackProps {
    stackData: (Stack & { cards: Card[] })[] | null;
    boardId: string | null;
}

const StacksComponent: React.FC<StackProps> = (props: StackProps) => {
    const router = useRouter();
    const [allStacks, setAllStacks] = useState<
        (Stack & { cards: Card[] })[] | null
    >(null);
    // const [showStacks, setShowStacks] = useState<JSX.Element[] | null>(null);

    useEffect(() => {
        props.stackData && setAllStacks(props.stackData);
    }, []);

    const addNewStack = (stack: Stack & { cards: Card[] }) => {
        allStacks && setAllStacks([...allStacks, stack]);
    };

    const addNewCard = (card: Card) => {
        const cardStack = card.stackId;
        const newStackState = allStacks?.map((stack) => {
            if (stack.id === cardStack) {
                stack.cards = stack.cards ? [...stack.cards, card] : [card];
            }
            return stack;
        });
        newStackState && setAllStacks(newStackState);
    };

    const updateStacks = (
        cardId: string | undefined,
        oldStackId: string | undefined,
        newStackId: string | undefined,
        newCardIndex: number | null = null
    ) => {
        let cardToUpdate: Card | undefined;

        const removeCard = allStacks?.map((stack) => {
            if (stack.id === oldStackId) {
                stack.cards = [...stack.cards].filter((card) => {
                    if (card.id !== cardId) {
                        return true;
                    } else {
                        cardToUpdate = card;
                        return false;
                    }
                });
            }
            return stack;
        });

        const addCard = removeCard?.map((stack) => {
            if (stack.id === newStackId) {
                if (stack.cards && cardToUpdate) {
                    if (!newCardIndex) {
                        stack.cards = [cardToUpdate, ...stack.cards];
                    } else {
                        stack.cards.splice(newCardIndex, 0, cardToUpdate);
                    }
                } else {
                    stack.cards = cardToUpdate
                        ? [cardToUpdate]
                        : [...stack.cards];
                }
            }
            return stack;
        });
        addCard && setAllStacks([...addCard]);
    };

    const showStacks =
        allStacks &&
        allStacks.map((stack, index) => {
            return (
                <div key={stack.id}>
                    <SingleStackComponent
                        addNewCard={addNewCard}
                        stack={stack}
                        updateStacks={updateStacks}
                    />
                </div>
            );
        });

    const moveCard = async (stackId: string, cardId: string) => {
        const update = await fetch("/api/update/card", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ stackId, cardId }),
        });
        const res = await update.json();
    };

    const onDragEndHandler = (result: DropResult) => {
        const { draggableId, destination, source } = result;
        console.log(result);
        if (
            !destination ||
            (destination.droppableId === source.droppableId &&
                destination.index === source.index)
        ) {
            return;
        } else {
            if (destination.droppableId !== source.droppableId) {
                moveCard(destination.droppableId, draggableId);
                updateStacks(
                    draggableId,
                    source.droppableId,
                    destination.droppableId,
                    destination.index
                );
            }
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEndHandler}>
            <div className="stacks">
                {showStacks}
                <CreateStack
                    addNewStack={addNewStack}
                    boardId={props.boardId}
                />
            </div>
        </DragDropContext>
    );
};

export default StacksComponent;
