import { Stack, Card } from "@prisma/client";

interface StackProps {
    stackData: (Stack & { cards: Card[] })[] | null;
}

const StackComponent: React.FC<StackProps> = (props: StackProps) => {
    const showStacks =
        props.stackData &&
        props.stackData.map((stack) => {
            return (
                <div className="stack">
                    <h3>{stack.title}</h3>
                    <p>
                        {"created on " +
                            new Date(stack.createdAt).toDateString()}
                    </p>
                    <p>This will be replaced by a card component...</p>
                </div>
            );
        });

    return (
        <>
            <div className="stack-container">{showStacks && showStacks}</div>
        </>
    );
};

export default StackComponent;
