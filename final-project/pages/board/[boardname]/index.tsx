import { GetServerSideProps } from "next";
import prisma from "../../../lib/prisma";
import { authOptions } from "../../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { Board, User, Stack, Card } from "@prisma/client";
import { useSession } from "next-auth/react";
import StacksComponent from "../../../components/StacksComponent";
import AddMember from "../../../components/AddMember";
import BoardChat from "../../../components/BoardChat";
import LoginLogout from "../../../components/LoginLogout";
import JoinBoard from "../../../components/JoinBoard";
import HomeButton from "../../../components/HomeButton";
import { resetServerContext } from "react-beautiful-dnd";
import { useState, useEffect } from "react";
import Members from "../../../components/Members";

export const getServerSideProps: GetServerSideProps = async (context) => {
    resetServerContext();
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    const { boardname } = context.query;

    const boardId = typeof boardname === "string" ? boardname : undefined;

    const userEmail =
        session && typeof session.user?.email === "string"
            ? session.user.email
            : "";

    const data =
        session &&
        (await prisma.board.findUnique({
            where: {
                id: boardId,
            },
            include: {
                stacks: true,
                users: true,
            },
        }));

    const authorized =
        data && data.users.some((user) => user.email === userEmail);

    const currentBoard: Board & {
        stacks: Stack[];
        users: User[];
    } = authorized ? JSON.parse(JSON.stringify(data)) : null;

    const allCards =
        session &&
        (await prisma.stack.findMany({
            where: {
                id: { in: currentBoard.stacks.map((stack) => stack.id) },
            },
            include: {
                cards: true,
            },
        }));

    const stackData: (Stack & { cards: Card[] }) | null =
        authorized && JSON.parse(JSON.stringify(allCards));

    return { props: { currentBoard, stackData } };
};

interface BoardProps {
    currentBoard: (Board & { users: User[]; stacks: Stack[] }) | null;
    stackData: (Stack & { cards: Card[] })[] | null;
}

const Board: React.FC<BoardProps> = ({ currentBoard, stackData }) => {
    const [isBrowser, setIsBrowser] = useState(false);
    const { data: session, status } = useSession();
    const userEmail = session?.user && session?.user.email;
    const currentUser =
        currentBoard &&
        currentBoard.users.find((user) => user.email === userEmail);
    const [editable, setEditable] = useState(false);
    const [title, setTitle] = useState("");

    useEffect(() => {
        currentBoard && setTitle(currentBoard.title);
    }, []);

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
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key !== "Enter") {
            return;
        }
        const data = await fetch("/api/update/board-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                boardId: currentBoard && currentBoard.id,
            }),
        });
        ///update stack here..
        setEditable(false);
    };

    return (
        <>
            <div className="nav-bar">
                <div className="left">
                    <div className="profile-pic">
                        <img
                            src={
                                (session?.user && session.user.image) ||
                                undefined
                            }
                            alt={
                                (session?.user && session.user.name) ||
                                undefined
                            }
                        />
                    </div>
                    <HomeButton
                        email={session?.user && session.user.email}
                        name={session?.user && session.user.name}
                    />
                    <div className="board-title">
                        {!editable && (
                            <h1 onClick={handleEdit}>
                                {currentBoard && currentBoard.title}
                            </h1>
                        )}
                        {editable && (
                            <>
                                <input
                                    name="stackTitle"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onKeyDown={handleEditSubmit}
                                />
                                <button
                                    className="nav-button"
                                    onClick={() => {
                                        setEditable(false);
                                        setTitle(
                                            (currentBoard &&
                                                currentBoard.title) ||
                                                ""
                                        );
                                    }}
                                >
                                    x
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className="right">
                    {currentBoard && <Members boardId={currentBoard.id} />}
                    <AddMember boardId={currentBoard && currentBoard.id} />
                    <JoinBoard />
                    <LoginLogout />
                </div>
            </div>
            <div className="main-app">
                <div className="board-container">
                    {/* <div className="board-info">
                        <p>{`Welcome to your board, ${
                            session?.user && session.user.name
                        }`}</p>
                    </div> */}
                    <div className="stacks-container">
                        <StacksComponent
                            stackData={stackData}
                            boardId={currentBoard && currentBoard.id}
                        />
                    </div>
                    <BoardChat />
                </div>
            </div>
        </>
    );
};

export default Board;
