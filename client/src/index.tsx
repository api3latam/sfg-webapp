import "./browserPatches";
import ReactDOM from "react-dom/client";
import { Route, Routes } from "react-router";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import {
  createStore,
  applyMiddleware,
  Middleware,
  MiddlewareAPI,
  Dispatch,
} from "@reduxjs/toolkit";
import {
  createRouterMiddleware,
  ReduxRouter,
} from "@lagunovsky/redux-react-router";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createRootReducer } from "./reducers";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";
import Layout from "./components/Layout";
import reportWebVitals from "./reportWebVitals";
import history from "./history";
import { slugs } from "./routes";
import GrantsList from "./components/grants/List";
import GrantsShow from "./components/grants/Show";
import CreatGrant from "./components/grants/New";

const logger: Middleware =
  ({ getState }: MiddlewareAPI) =>
  (next: Dispatch) =>
  (action) => {
    console.log("dispatch", action);
    const returnValue = next(action);
    console.log("state", getState());
    return returnValue;
  };

const routerMiddleware = createRouterMiddleware(history);

let middlewares: Middleware[] = [thunkMiddleware, routerMiddleware];

if (process.env.NODE_ENV !== "production") {
  middlewares = [...middlewares, logger];
}

const store = createStore(createRootReducer(), applyMiddleware(...middlewares));

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = extendTheme({
  components: {
    initialColorMode: "light",
    Button: {
      // 1. We can update the base styles
      baseStyle: {
        fontWeight: "bold", // Normally, it is "semibold"
      },
      // 2. We can add a new button size or extend existing
      sizes: {
        xl: {
          h: "56px",
          fontSize: "lg",
          px: "32px",
        },
      },
      // 3. We can add a new visual variant
      variants: {
        "with-shadow": {
          bg: "red.400",
          boxShadow: "0 0 2px 2px #efdfde",
        },
        // 4. We can override existing variants
        solid: (props: any) => ({
          bg: props.colorMode === "dark" ? "green.300" : "green.500",
        }),
      },
    },
  },
});

root.render(
  // <React.StrictMode>
  <ErrorBoundary>
    <ChakraProvider resetCSS theme={theme}>
      <Provider store={store}>
        <ReduxRouter history={history} store={store}>
          <Layout>
            <Routes>
              <Route path={slugs.root} element={<div>Home</div>} />
              <Route path={slugs.grants} element={<GrantsList />} />
              <Route path={slugs.grant} element={<GrantsShow />} />
              <Route path={slugs.newGrant} element={<CreatGrant />} />
            </Routes>
          </Layout>
        </ReduxRouter>
      </Provider>
    </ChakraProvider>
  </ErrorBoundary>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
