import React from "react";
import Layout from "../components/Layout/Layout";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../utils/theme';
import "../styles/global.scss";
import Button from "@material-ui/core/Button";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Button variant="contained" color="success">
        Primary
      </Button>
      <Layout>
          <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
