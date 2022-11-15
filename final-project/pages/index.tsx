import { GetServerSideProps } from "next";
import prisma from "../lib/prisma";
import { Board } from "@prisma/client";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import CreateBoard from "../components/CreateBoard";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoginLogout from "../components/LoginLogout";
import JoinBoard from "../components/JoinBoard";
import HomeButton from "../components/HomeButton";
import Welcome from "../components/Welcome";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    const userEmail =
        session && typeof session.user?.email === "string"
            ? session.user.email
            : "";

    const userObj = await prisma.user.findUnique({
        where: {
            email: userEmail,
        },
        select: {
            boards: true,
        },
    });

    const data = userObj && userObj.boards;
    const boards: Board[] = JSON.parse(JSON.stringify(data));
    return { props: { boards } };
};

interface HomeProps {
    boards: Board[];
}

const Home: React.FC<HomeProps> = (props: HomeProps) => {
    const { data: session, status } = useSession();
    const [userBoards, setUserBoards] = useState<Board[]>([]);

    useEffect(() => {
        props.boards && setUserBoards(props.boards);
    }, []);

    const addNewBoard = (board: Board) => {
        userBoards
            ? setUserBoards([...userBoards, board])
            : setUserBoards([board]);
    };

    const boardList =
        userBoards &&
        userBoards.map((board, index) => (
            <li key={board.id}>
                <Link href={`/board/${board.id}`}>
                    <h2>{board.title}</h2>
                </Link>
                {board.title !== "Archive" && (
                    <p>
                        {"created on " +
                            new Date(board.createdAt).toDateString()}
                    </p>
                )}
            </li>
        ));
    return (
        <>
            {status === "authenticated" && (
                <div className="nav-bar">
                    <div className="left">
                        <>
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
                        </>
                    </div>
                    <div>
                        <JoinBoard />
                        <LoginLogout />
                    </div>
                </div>
            )}
            <div className="main-app">
                <div className="home">
                    {status === "authenticated" && (
                        <>
                            <ul className="board-list">{boardList}</ul>
                            <CreateBoard addNewBoard={addNewBoard} />
                        </>
                    )}
                    {status !== "authenticated" && (
                        <>
                            <LoginLogout /> <Welcome />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
