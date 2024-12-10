import React, { useContext, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCounter } from "./App";
const MyCounter = ({ AuthContext }) => {
  const { user } = useContext(AuthContext);
  const { state, dispatch } = useCounter();
  const navigate = useNavigate();

  const incrementMyCounter = useCallback(async () => {
    if (user)
      try {
        await axios.post("http://localhost:5000/api/counter/MyIncrement", {
          email: user.email,
        });
        dispatch({ type: "INCREMENT-MYCOUNT" });
      } catch (err) {
        console.error(err);
      }
  }, [dispatch]);

  const decrementMyCounter = useCallback(async () => {
    if (user)
      try {
        await axios.post("http://localhost:5000/api/counter/MyDecrement", {
          email: user.email,
        });
        dispatch({ type: "DECREMENT-MYCOUNT" });
      } catch (err) {
        console.error(err);
      }
  }, [dispatch]);

  const fetchCounter = useCallback(async () => {
    if (user) {
      // Check if user exists before making the API call
      try {
        const email = user.email;
        const response = await axios.get(
          `http://localhost:5000/api/counter/${email}`
        );
        dispatch({
          type: "SET",
          count: response.data.count,
          Mycount: response.data.Mycount,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [dispatch, user]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  return (
    <div>
      <h2>MyCounter</h2>
      <p>Count: {state.Mycount}</p>
      <button onClick={incrementMyCounter}>Increment</button>
      <button onClick={decrementMyCounter}>Decrement</button>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};
export default MyCounter;
