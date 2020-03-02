# Effector Next Redirect

_Redirect to any URL in NextJS both on the client and on the server depending on the state of the store_

## Installation

```bash
npm install effector-next-redirect
```

or yarn

```bash
yarn add effector-next-redirect
```

## Example

1. Redirect to the `/login` page, depending on the state of the `$isAccessDenied` store

   ```jsx
   // pages/index.jsx
   import React from "react";
   import { withRedirect } from "effector-next-redirect";
   import { createStore } from "effector";

   export const $isAccessDenied = createStore(true);

   // redirect with setting 302 status code
   const enhance = withRedirect("/login", $isAccessDenied);

   export default function HomePage() {
     return (
       <div>
         <h1>HomePage</h1>
       </div>
     );
   }

   export default enhance(HomePage);
   ```

2. Redirect to the `/login` page using replace on the client

   ```jsx
   // pages/index.jsx
   import React from "react";
   import { withRedirect } from "effector-next-redirect";
   import { createStore } from "effector";

   export const $isAccessDenied = createStore(true);

   // redirect with setting 301 status code
   const enhance = withRedirect("/login", $isAccessDenied, { code: 301, replace: true });

   export default function HomePage() {
     return (
       <div>
         <h1>HomePage</h1>
       </div>
     );
   }

   export default enhance(HomePage);
   ```

## Configuration

The `withRedirect` function expects to receive the settings object as the third argument:

- `asUrl` (string, optional) : mask `url` for the browser
- `code` (number, optional) : status code set by the server after redirection
- `replace` (boolean, optional) : use `Router.replace` instead of `Router.push` in browser
