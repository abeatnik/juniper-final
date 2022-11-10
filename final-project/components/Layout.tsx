import React, { ReactNode } from "react";
import Header from "./Header";

interface Props {
    children: ReactNode;
}

const Layout: React.FC<Props> = (props) => {
    return (
        <>
            <Header />
            <div className="layout">{props.children}</div>
        </>
    );
};

export default Layout;
