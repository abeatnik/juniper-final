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

    if (typeof window === "undefined") return null;

    if (!session) {
        return <p>Access Denied</p>;
    }

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
                    <h1 className="board-title">
                        {props.currentBoard && props.currentBoard.title}
                    </h1>
                </div>
                <div className="right">
                    {props.currentBoard && (
                        <Members boardId={props.currentBoard.id} />
                    )}
                    <AddMember
                        boardId={props.currentBoard && props.currentBoard.id}
                    />
                    <JoinBoard />
                    <LoginLogout />
                </div>
            </div>
            <div className="main-app">
                <div className="board-container">
                    <div className="board-info">
                        <p>{`Welcome to your board, ${
                            session?.user && session.user.name
                        }`}</p>
                    </div>
                    <div className="stacks-container">
                        <StacksComponent
                            stackData={props.stackData}
                            boardId={
                                props.currentBoard && props.currentBoard.id
                            }
                        />
                    </div>
                    <BoardChat />
                </div>
            </div>
        </>
    );
};

export default Board;
