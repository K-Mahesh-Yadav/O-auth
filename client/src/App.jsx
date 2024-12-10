import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
  useEffect,
} from "react";
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import Callback from "./Callback";
import Login from "./Login";
import Layout from "./Layout";

// Ensures cookie is sent
axios.defaults.withCredentials = true;

const AuthContext = createContext();
const CounterContext = createContext();
export const useCounter = () => useContext(CounterContext);

const counterReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return { count: action.count, Mycount: action.Mycount };
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "INCREMENT-MYCOUNT":
      return { ...state, Mycount: state.Mycount + 1 };
    case "DECREMENT-MYCOUNT":
      return { ...state, Mycount: state.Mycount - 1 };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = React.useState(null);
  const [user, setUser] = React.useState(null);

  const checkLoginState = useCallback(async () => {
    try {
      const {
        data: { loggedIn: logged_in, user },
      } = await axios.get(`http://localhost:5000/auth/logged_in`);
      setLoggedIn(logged_in);
      user && setUser(user);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    checkLoginState();
  }, [checkLoginState]);

  return (
    <AuthContext.Provider value={{ loggedIn, checkLoginState, user }}>
      {children}
    </AuthContext.Provider>
  );
};

const Home = () => {
  const { loggedIn } = useContext(AuthContext);
  if (loggedIn === true) return <Layout AuthContext={AuthContext} />;
  if (loggedIn === false) return <Login />;
  return <></>;
};

const router = createBrowserRouter([
  {
    path: "/*",
    element: <Home />,
  },
  {
    path: "/auth/callback", // google will redirect here
    element: <Callback AuthContext={AuthContext} />,
  },
]);

function App() {
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
    Mycount: 0,
  });

  return (
    <AuthContextProvider>
      <CounterContext.Provider value={{ state, dispatch }}>
        <RouterProvider router={router} />
      </CounterContext.Provider>
    </AuthContextProvider>
  );
}

export default App;
