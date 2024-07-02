import { useState } from "react";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [display, setDisplay] = useState("");

  const submitHandler = async (e) => {
    try {
      e.preventDefault();

      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userName,
          password: password,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem("token", data.token);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      setDisplay(error);
    }
  };
  return (
    <div className=" flex flex-col md:flex-row  w-screen h-screen  text-white bg-gradient-to-b  md:bg-gradient-to-r from-black via-gray-600 to-white p-2 justify-center ">
      <form
        onSubmit={submitHandler}
        className="border rounded-lg p-4 flex flex-col gap-3 "
      >
        <div className=" p-2">
          <p>USERNAME</p>
          <input
            type="text"
            className=" p-2 w-full rounded bg-inherit border "
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className=" p-2">
          <p>PASSWORD</p>
          <input
            type="text"
            className=" p-2 w-full rounded bg-inherit border"
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-red-500">{error}</p>
        </div>
        <button
          type="submit"
          className=" bg-yellow-500 p-2 text-xl font-bold rounded-md shadow-md"
        >
          LOGIN
        </button>
        <div>{display}</div>
      </form>
    </div>
  );
};

export default Login;
