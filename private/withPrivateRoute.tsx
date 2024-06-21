import { NextPageContext } from "next";
import Router from "next/router";
import { useFirebase } from "../hooks/useFirebase";

const login = "/login?redirected=true"; // Define your login route address.

// eslint-disable-next-line import/no-anonymous-default-export
export default (WrappedComponent: any) => {
    const { auth } = useFirebase();
    const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

    hocComponent.getInitialProps = async (context: NextPageContext) => {
        if (!auth?.currentUser == null) {
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
                auth: auth,
            });
            return { ...wrappedProps, auth };
        }

        return { auth };
    };

    return hocComponent;
};
