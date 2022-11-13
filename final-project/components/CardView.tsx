import { User, Card, Comment } from "@prisma/client";
import { useState, useEffect } from "react";
import DeleteCard from "./DeleteCard";
import Comments from "./Comments";
import AddComment from "./AddComment";

interface CardProps {
    card: Card;
    toggleCard: () => void;
    deleteCard: (cardId: string) => void;
    stackName: string | null;
}

const CardView: React.FC<CardProps> = ({
    card,
    toggleCard,
    deleteCard,
    stackName,
}) => {
    const [showOptions, setShowOptions] = useState(false);
    const [comments, setComments] = useState<
        (Comment & { user: User })[] | null
    >(null);

    useEffect(() => {
        getComments(card.id);
    }, []);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const getComments = async (cardId: string) => {
        const data = await fetch(`/api/comments/${cardId}`);
        const cardComments: (Comment & {
            user: User;
        })[] = await data.json();
        setComments(
            cardComments.sort(
                (a, b) =>
                    new Date(a.createdAt).getDate() -
                    new Date(a.createdAt).getDate()
            )
        );
    };

    const addNewComment = (comment: (Comment & { user: User }) | null) => {
        const allComments =
            comments && comment
                ? [...comments.map((item) => item), comment]
                : null;
        allComments && setComments(allComments);
    };

    return (
        <div className="card-background">
            <div
                className="card-view"
                onClick={() => showOptions && setShowOptions(false)}
            >
                <div>
                    <h2>{card.title}</h2>
                    <button onClick={toggleCard}>x</button>
                    <button onClick={toggleOptions}>...</button>
                </div>
                <p>{`from: ${stackName}`}</p>
                <p>{`created at ${new Date(card.createdAt).toUTCString()}`}</p>
                <div className="description">
                    <h4>Description</h4>
                    <p>{card.description}</p>
                </div>
                <div className="comments">
                    <h4>Comments</h4>
                    <AddComment
                        cardId={card.id}
                        addNewComment={addNewComment}
                    />
                    <Comments comments={comments && comments} />
                </div>
            </div>
            {showOptions && (
                <div className="options-view">
                    <p>edit</p>
                    <p>add checklist</p>
                    <p>add deadline</p>
                    <p>attach link</p>
                    <p>add members (search)</p>
                    <p>archive</p>
                    <p>delete</p>
                    <DeleteCard cardId={card.id} deleteCard={deleteCard} />
                </div>
            )}
        </div>
    );
};

export default CardView;
