import { User, Card, Comment } from "@prisma/client";
import { useState, useEffect, KeyboardEvent } from "react";
import DeleteCard from "./DeleteCard";
import Comments from "./Comments";
import AddComment from "./AddComment";
import MoveCard from "./MoveCard";

interface CardProps {
    card: Card;
    toggleCard: () => void;
    deleteCard: (cardId: string) => void;
    stackName: string | null;
    updateStacks: (
        cardId: string | undefined,
        oldStackId: string | undefined,
        newStackId: string | undefined
    ) => void;
    updateCard: (card: Card) => void;
}

const CardView: React.FC<CardProps> = ({
    card,
    toggleCard,
    deleteCard,
    stackName,
    updateStacks,
    updateCard,
}) => {
    const [showOptions, setShowOptions] = useState(false);
    const [comments, setComments] = useState<
        (Comment & { user: User })[] | null
    >(null);
    const [editable, setEditable] = useState(false);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getComments(card.id);
        card.description && setDescription(card.description);
        card.title && setTitle(card.title);
    }, []);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const getComments = async (cardId: string) => {
        const data = await fetch(`/api/comments/${cardId}`);
        const cardComments: (Comment & {
            user: User;
        })[] = await data.json();
        setComments(cardComments);
    };

    const addNewComment = (comment: (Comment & { user: User }) | null) => {
        const allComments =
            comments && comment
                ? [comment, ...comments.map((item) => item)]
                : null;
        allComments && setComments(allComments);
    };

    const handleEdit = (
        e:
            | React.MouseEvent<HTMLDivElement>
            | React.MouseEvent<HTMLHeadingElement>
    ) => {
        if (e.detail < 2) {
            return;
        }
        setEditable(true);
    };

    const handleEditSubmit = async (
        e:
            | React.KeyboardEvent<HTMLTextAreaElement>
            | React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key !== "Enter") {
            return;
        }
        const data = await fetch("/api/update/card-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description, title, cardId: card.id }),
        });
        const newCard = await data.json();
        console.log(newCard);
        newCard && updateCard(newCard);
        setEditable(false);
    };

    return (
        <div className="card-background">
            <div
                className="card-view"
                onClick={() => showOptions && setShowOptions(false)}
            >
                <div className="scroll-box">
                    <div className="top">
                        {!editable && (
                            <h2 onClick={handleEdit}>{title || card.title}</h2>
                        )}
                        {editable && (
                            <>
                                <input
                                    name="cardTitle"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onKeyDown={handleEditSubmit}
                                />
                                <button
                                    className="nav-button"
                                    onClick={() => {
                                        setEditable(false);
                                        setTitle(card.title || "");
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        )}

                        <div>
                            <button className="nav-button" onClick={toggleCard}>
                                x
                            </button>
                            <button
                                className="nav-button"
                                onClick={toggleOptions}
                            >
                                ...
                            </button>
                        </div>
                    </div>
                    <div className="card-container">
                        <div className="info">
                            <p>{`from: ${stackName}`}</p>
                            <p>{`created at ${new Date(
                                card.createdAt
                            ).toUTCString()}`}</p>
                        </div>
                        {!editable && (
                            <div className="description" onClick={handleEdit}>
                                <h4>Description</h4>
                                <p>{description || card.description}</p>
                            </div>
                        )}
                        {editable && (
                            <div className="description">
                                <h4>Description</h4>
                                <textarea
                                    name="cardDescription"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    onKeyDown={handleEditSubmit}
                                />
                                <button
                                    className="nav-button"
                                    onClick={() => {
                                        setEditable(false);
                                        setDescription(card.description || "");
                                    }}
                                >
                                    x
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="comments">
                        <AddComment
                            cardId={card.id}
                            addNewComment={addNewComment}
                        />
                        <h4>Comments</h4>
                        <Comments comments={comments && comments} />
                    </div>
                </div>
            </div>
            {showOptions && (
                <div className="options-view">
                    <button className="nav-button" onClick={toggleOptions}>
                        x
                    </button>
                    <button onClick={() => setEditable(true)}>edit card</button>
                    <MoveCard
                        updateStacks={updateStacks}
                        card={card}
                        stackName={stackName}
                        toggleOptions={toggleOptions}
                        toggleCard={toggleCard}
                    />
                    <DeleteCard cardId={card.id} deleteCard={deleteCard} />
                </div>
            )}
        </div>
    );
};

export default CardView;
