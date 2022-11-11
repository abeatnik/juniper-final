import { Stack, Card } from "@prisma/client";
import CreateStack from "./CreateStack";
import SingleStackComponent from "./SingleStack";
import { useState, useEffect } from "react";

interface StackProps {
    stackData: (Stack & { cards: Card[] })[] | null;
    boardId: string | null;
}

const StacksComponent: React.FC<StackProps> = (props: StackProps) => {
    const [allStacks, setAllStacks] = useState<
        (Stack & { cards: Card[] })[] | null
    >([]);

    useEffect(() => {
        props.stackData && setAllStacks(props.stackData);
    }, []);

    const addNewStack = (stack: Stack & { cards: Card[] }) => {
        allStacks && setAllStacks([...allStacks, stack]);
    };

    const showStacks =
        allStacks &&
        allStacks.map((stack) => {
            return (
                <div key={stack.id}>
                    <SingleStackComponent stack={stack} />
                </div>
            );
        });

    return (
        <>
            <div className="stack-container">
                {showStacks}
                <CreateStack
                    addNewStack={addNewStack}
                    boardId={props.boardId}
                />
            </div>
        </>
    );
};

export default StacksComponent;
