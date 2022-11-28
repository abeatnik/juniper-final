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
import { useAppSelector, useAppDispatch } from "../hooks/store-hooks";
import {
    addNewStack,
    updateStacks,
    addNewCard,
    CurrentBoard,
} from "../redux/currentBoard/slice";

interface StackProps {
    boardId: string | null;
}

const StacksComponent: React.FC<StackProps> = (props: StackProps) => {
    const boardState = useAppSelector((state) => state.currentBoard);
    const stackData: (Stack & { cards: Card[] })[] | null =
        boardState.currentBoard ? boardState.currentBoard.stacks : null;
    const [allStacks, setAllStacks] = useState<
        (Stack & { cards: Card[] })[] | null
    >(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        stackData && setAllStacks(stackData);
    }, [stackData]);

    const updateCard = (card: Card) => {
        console.log("updating card...");
        const updated = allStacks?.map((stack) => {
            if (stack.id === card.stackId) {
                stack.cards =
                    stack.cards &&
                    stack.cards.map((item) => {
                        if (item.id === card.id) {
                            return card;
                        } else {
                            return item;
                        }
                    });
            }
            return stack;
        });
        updated && setAllStacks([...updated]);
    };

    const showStacks =
        allStacks &&
        allStacks.map((stack, index) => {
            return (
                <div key={stack.id}>
                    <SingleStackComponent
                        updateCard={updateCard}
                        stack={stack}
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

    const reshuffleCards = (
        cardId: string,
        stackId: string,
        oldIndex: number,
        newIndex: number
    ) => {
        const reshuffled = allStacks?.map((stack) => {
            if (stack.id === stackId) {
                const reshuffledCard = stack.cards.find(
                    (card) => card.id === cardId
                );
                if (newIndex < oldIndex) {
                    stack.cards.splice(oldIndex, 1);
                    reshuffledCard &&
                        stack.cards.splice(newIndex, 0, reshuffledCard);
                } else {
                    stack.cards.splice(oldIndex, 1);
                    reshuffledCard &&
                        stack.cards.splice(newIndex, 0, reshuffledCard);
                }
            }
            return stack;
        });
        reshuffled && setAllStacks([...reshuffled]);
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
                dispatch(
                    updateStacks({
                        cardId: draggableId,
                        oldStackId: source.droppableId,
                        newStackId: destination.droppableId,
                        newCardIndex: destination.index,
                    })
                );
            } else if (destination.index !== source.index) {
                reshuffleCards(
                    draggableId,
                    source.droppableId,
                    source.index,
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
