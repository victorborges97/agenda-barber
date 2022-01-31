import React from "react";
import { NextPageContext } from "next";
import Router from "next/router";
import { getAuth } from "firebase/auth";

const login = "/login?redirected=true"; // Define your login route address.

// eslint-disable-next-line import/no-anonymous-default-export
export default (WrappedComponent: any) => {
  const userAuth = getAuth();
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

  hocComponent.getInitialProps = async (context: NextPageContext) => {
    // Are you an authorized user or not?
    if (!userAuth?.currentUser != null) {
      // Handle server-side and client-side rendering.
      if (context.res) {
        context.res?.writeHead(302, {
          Location: login,
        });
        context.res?.end();
      } else {
        Router.replace(login);
      }
    } else if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({
        ...context,
        auth: userAuth,
      });
      return { ...wrappedProps, userAuth };
    }

    return { userAuth };
  };

  return hocComponent;
};
