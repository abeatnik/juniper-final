import { Stack, Card } from "@prisma/client";
import CreateStack from "./CreateStack";
import SingleStackComponent from "./SingleStack";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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

    // useEffect(() => {
    //     renderStacks();
    // }, [allStacks]);

    const addNewStack = (stack: Stack & { cards: Card[] }) => {
        allStacks && setAllStacks([...allStacks, stack]);
    };

    const updateStacks = (
        cardId: string | undefined,
        oldStackId: string | undefined,
        newStackId: string | undefined
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
                stack.cards =
                    stack.cards && cardToUpdate
                        ? [cardToUpdate, ...stack.cards]
                        : cardToUpdate
                        ? [cardToUpdate]
                        : [...stack.cards];
            }
            return stack;
        });
        console.log("changing all stacks to:", addCard);
        // setAllStacks(null);
        addCard && setAllStacks([...addCard]);
        console.log(allStacks);
    };

    const showStacks =
        allStacks &&
        allStacks.map((stack, index) => {
            return (
                <div key={stack.id}>
                    <SingleStackComponent
                        stack={stack}
                        updateStacks={updateStacks}
                    />
                </div>
            );
        });

    return (
        <div className="stacks">
            {showStacks}
            <CreateStack addNewStack={addNewStack} boardId={props.boardId} />
        </div>
    );
};

export default StacksComponent;
