import * as React from "react";
import { useStore } from "effector-react";
import { NextPage } from "next/types";
import { Store } from "effector";
import Router from "next/router";

interface InitialPropsResult {
  redirect?: Function;
}

interface WithRedirectProps {
  pageProps: InitialPropsResult;
}

export interface WithRedirectConfig {
  code?: number;
  asUrl?: string;
  replace?: boolean;
}

export function withRedirect(
  url: string,
  pred: Store<boolean>,
  { asUrl, replace, code = 302 }: WithRedirectConfig = {},
) {
  return function<P>(Page: NextPage<P>) {
    const WithRedirect: NextPage<P & WithRedirectProps, InitialPropsResult> = (props) => {
      /* For cases when the store is attached to the forked scope with the replacement of aliases */
      const isRedirectNeed = useStore(pred);
      const { pageProps } = props;

      /* The only way to redirect with setting the status code :(( */
      if (isRedirectNeed && pageProps.redirect) {
        pageProps.redirect();

        return null;
      }

      return <Page {...props} />;
    };

    WithRedirect.getInitialProps = async (ctx) => {
      let initialProps: InitialPropsResult = {};

      /* Response exists only in server rendering */
      const isServer = Boolean(ctx.res);

      if (Page.getInitialProps) {
        initialProps = await Page.getInitialProps(ctx);
      }

      if (isServer) {
        initialProps.redirect = () => {
          ctx.res!.writeHead(code, { Location: url });
          ctx.res!.end();
        };

        return initialProps;
      }

      if (pred.getState()) {
        const method = replace ? "replace" : "push";

        await Router[method](url, asUrl);
      }

      return initialProps;
    };

    return WithRedirect;
  };
}
