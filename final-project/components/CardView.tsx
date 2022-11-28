import { User, Card, Comment } from "@prisma/client";
import { useState, useEffect, KeyboardEvent } from "react";
import DeleteCard from "./DeleteCard";
import CardComments from "./CardComments";
import MoveCard from "./MoveCard";
import AssignCard from "./AssignCard";
import UserIcon from "./UserIcon";
import AttachLink from "./AttachLink";

interface CardProps {
    card: Card;
    toggleCard: () => void;
    deleteCard: (cardId: string) => void;
    stackName: string | null;
    updateCard: (card: Card) => void;
}

const CardView: React.FC<CardProps> = ({
    card,
    toggleCard,
    deleteCard,
    stackName,
    updateCard,
}) => {
    const [showOptions, setShowOptions] = useState(false);
    const [editable, setEditable] = useState(false);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [preview, setPreview] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
        card.description && setDescription(card.description);
        card.title && setTitle(card.title);
        card.link && setLink(card.link);
        getLinkPreview();
    }, []);

    const getLinkPreview = async () => {
        let data = await fetch("/api/preview/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ link: card.link }),
        });
        const { image } = await data.json();
        console.log(image);
        setPreviewImage(image);
    };

    const toggleOptions = () => {
        setShowOptions(!showOptions);
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
        submitEdit();
    };

    const submitEdit = async () => {
        const update = await fetch("/api/update/card-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                description,
                title,
                cardId: card.id,
                link,
            }),
        });
        const newCard = await update.json();
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
                                    onClick={submitEdit}
                                >
                                    Update
                                </button>
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
                        {!editable ? (
                            <h4 onClick={handleEdit}>Attached Link</h4>
                        ) : (
                            <h4>Attach Link:</h4>
                        )}
                        {card.link && !editable && (
                            <div
                                className="card-link"
                                onClick={handleEdit}
                                onMouseEnter={() => setPreview(true)}
                                onMouseLeave={() =>
                                    setTimeout(() => setPreview(false), 300)
                                }
                            >
                                <p>
                                    <a href={card.link}>{card.link}</a>
                                </p>
                            </div>
                        )}
                        {!card.link && !editable && (
                            <div className="no-link"></div>
                        )}
                        {editable && (
                            <>
                                <input
                                    name="cardLink"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    onKeyDown={handleEditSubmit}
                                />
                                <button
                                    className="nav-button"
                                    onClick={() => {
                                        setEditable(false);
                                        setLink(card.link || "");
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                    <CardComments cardId={card.id} />
                </div>
            </div>
            {showOptions && (
                <div className="options-view">
                    <button className="nav-button" onClick={toggleOptions}>
                        x
                    </button>
                    <button onClick={() => setEditable(true)}>edit card</button>
                    <MoveCard
                        card={card}
                        stackName={stackName}
                        toggleOptions={toggleOptions}
                        toggleCard={toggleCard}
                    />
                    {card.userId ? (
                        <UserIcon userId={card.userId} />
                    ) : (
                        <AssignCard cardId={card.id} />
                    )}
                    <DeleteCard cardId={card.id} deleteCard={deleteCard} />
                </div>
            )}
            {preview && (
                <div className="link-preview">
                    {previewImage ? (
                        <img
                            src={
                                `data:image/jpeg;base64, ${previewImage}` ||
                                undefined
                            }
                            alt="card link"
                        />
                    ) : (
                        <p>Preview loading...</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CardView;
