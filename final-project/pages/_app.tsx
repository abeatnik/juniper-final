import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import store from "../store/store";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </SessionProvider>
    );
}
