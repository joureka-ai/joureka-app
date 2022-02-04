import React, {useEffect, useState} from "react";
import Layout from "../components/Layout/Layout";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../utils/theme';
import "../styles/global.scss";
import {useRouter} from "next/router";
import {userService} from "../services/user.service";
import MobileOverlay from "../components/MobileOverlay/MobileOverlay";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [onLoginPage, setOnLoginPage] = useState(false)

  useEffect(() => {
    // run auth check on initial load
    authCheck(router.asPath);

    // set authorized to false to hide page content while changing routes
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // run auth check on route change
    router.events.on('routeChangeComplete', authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    }
  }, []);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ['/login'];
    const path = url.split('?')[0];
    if(publicPaths.includes(path)) {
      setOnLoginPage(true);
    } else {
      setOnLoginPage(false);
    }
    if (!userService.accessTokenValue && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      });
    } else {
      setAuthorized(true);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {authorized &&
      <Layout>
        <Component {...pageProps} />
        {!onLoginPage && <MobileOverlay show={true}></MobileOverlay>}
      </Layout>
      }
    </ThemeProvider>
  );
}
