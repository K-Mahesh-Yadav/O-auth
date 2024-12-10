import React, { useContext, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MyCounter from "./MyCounter";
import { useCounter } from "./App";
const Counter = ({ AuthContext }) => {
  const { user } = useContext(AuthContext);
  const { state, dispatch } = useCounter();
  const navigate = useNavigate();

  const incrementCounter = useCallback(async () => {
    if (user)
      try {
        await axios.post("http://localhost:5000/api/counter/increment", {
          email: user.email,
        });
        dispatch({ type: "INCREMENT" });
      } catch (err) {
        console.error(err);
      }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    if (user)
      try {
        await axios.post(
          "http://localhost:5000/api/counter/decrement",
          { email: user.email } // Send email in the request body
        );
        dispatch({ type: "DECREMENT" });
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
      <h2>Counter</h2>
      <p>Count: {state.count}</p>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
      <button onClick={() => navigate("/")}>Go to Home</button>
      <br></br>
      {/* Assuming MyCounter is another component */}
      <MyCounter AuthContext={AuthContext} />
    </div>
  );
};

export default Counter;
