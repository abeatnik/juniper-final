import Head from "next/head";
import styles from "../styles/Home.module.css";
import prisma from "../lib/prisma";
import Layout from "../components/Layout";
import Welcome from "../components/Welcome";

//prisma.user.create()
//prisma.user.findMany()
const App: React.FC = () => {
    return (
        <>
            <Layout>
                <Welcome />
            </Layout>
        </>
    );
};

export default App;
