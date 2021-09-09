import React from "react";
import Layout from "../components/Layout/Layout";

import "../styles/global.scss";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
        <Component {...pageProps} />
    </Layout>
  );
}
