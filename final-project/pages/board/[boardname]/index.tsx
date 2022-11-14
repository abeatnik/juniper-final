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
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { resetServerContext } from "react-beautiful-dnd";
import { useState, useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
    resetServerContext();
    const { boardname } = context.query;

    const boardId = typeof boardname === "string" ? boardname : undefined;
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    const userEmail =
        session && typeof session.user?.email === "string"
            ? session.user.email
            : "";

    const data = await prisma.board.findUnique({
        where: {
            id: boardId,
        },
        include: {
            stacks: true,
            users: true,
        },
    });

    const authorized =
        data && data.users.some((user) => user.email === userEmail);

    const currentBoard: Board & {
        stacks: Stack[];
        users: User[];
    } = authorized ? JSON.parse(JSON.stringify(data)) : null;

    const allCards = await prisma.stack.findMany({
        where: {
            id: { in: currentBoard.stacks.map((stack) => stack.id) },
        },
        include: {
            cards: true,
        },
    });

    const stackData: (Stack & { cards: Card[] }) | null =
        authorized && JSON.parse(JSON.stringify(allCards));

    return { props: { currentBoard, stackData } };
};

interface BoardProps {
    currentBoard: (Board & { users: User[]; stacks: Stack[] }) | null;
    stackData: (Stack & { cards: Card[] })[] | null;
}

const Board: React.FC<BoardProps> = (props: BoardProps) => {
    const [isBrowser, setIsBrowser] = useState(false);
    const { data: session, status } = useSession();
    const userEmail = session?.user && session?.user.email;
    const currentUser =
        props.currentBoard &&
        props.currentBoard.users.find((user) => user.email === userEmail);

    useEffect(() => {
        setIsBrowser(process.browser);
    }, []);

    return (
        <>
            {isBrowser ? (
                <DragDropContext
                    onDragEnd={(result, provided) => {
                        if (!result.destination) return;
                    }}
                >
                    <div className="nav-bar">
                        <HomeButton />
                        <AddMember
                            boardId={
                                props.currentBoard && props.currentBoard.id
                            }
                        />
                        <JoinBoard />
                        <LoginLogout />
                    </div>
                    <div className="main-app">
                        <div className="board-container">
                            <div className="board-info">
                                <h1 className="board-title">
                                    {props.currentBoard &&
                                        props.currentBoard.title}
                                </h1>
                                <p>{`Welcome to your board, ${
                                    session?.user && session.user.name
                                }`}</p>
                            </div>

                            <Droppable droppableId="board">
                                {(provided) => (
                                    <ul
                                        className="stack-container"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        <StacksComponent
                                            stackData={props.stackData}
                                            boardId={
                                                props.currentBoard &&
                                                props.currentBoard.id
                                            }
                                        />
                                    </ul>
                                )}
                            </Droppable>
                            <BoardChat />
                        </div>
                    </div>
                </DragDropContext>
            ) : null}
        </>
    );
};

export default Board;
