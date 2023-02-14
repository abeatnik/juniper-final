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
import Members from "../../../components/Members";
import Router from "next/router";
import { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
    resetServerContext();
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    const { boardname } = context.query as { boardname: string };

    const userEmail = session?.user?.email;

    const data =
        session &&
        (await prisma.board.findUnique({
            where: {
                id: boardname,
            },
            include: {
                stacks: true,
                users: true,
            },
        }));

    const authorized =
        data && data.users.some((user) => user.email === userEmail);

    const currentBoard:
        | Board & {
              stacks: Stack[];
              users: User[];
          } = authorized ? JSON.parse(JSON.stringify(data)) : null;
    // the JSON.stringify/parse is done in order to turn the data into serializable data, a better practice would be favorable
    // otherwise error message: "Please only return JSON serializable data types."

    const allCards =
        session &&
        (await prisma.stack.findMany({
            where: {
                id: { in: currentBoard?.stacks.map((stack) => stack.id) },
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
    const { data: session, status } = useSession();

    return status === "authenticated" ? (
        <>
            <div className="nav-bar">
                <div className="left">
                    <div className="profile-pic">
                        <img
                            src={session?.user?.image || undefined}
                            alt={session?.user?.name || undefined}
                        />
                    </div>
                    <HomeButton
                        email={session?.user?.email}
                        name={session?.user?.name}
                    />
                    <h1 className="board-title">{props.currentBoard?.title}</h1>
                </div>
                <div className="right">
                    {props.currentBoard && (
                        <Members boardId={props.currentBoard?.id} />
                    )}
                    <AddMember boardId={props.currentBoard?.id || null} />
                    <JoinBoard />
                    <LoginLogout />
                </div>
            </div>
            <div className="main-app">
                <div className="board-container">
                    <div className="stacks-container">
                        <StacksComponent
                            stackData={props.stackData}
                            boardId={props.currentBoard?.id || null}
                        />
                    </div>
                    <BoardChat />
                </div>
            </div>
        </>
    ) : (
        <>
            <p>Loading...</p>
        </>
    );
};

export default Board;
