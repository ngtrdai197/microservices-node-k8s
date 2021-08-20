import React, { useState } from "react";
import axios from "axios";
import LinkWrap from "../../components/link-wrap";

const Signin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any[]>([]);
  const onSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/users/signin", {
        email,
        password,
      });
      console.log(response.data);
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Login</h1>
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="fullname"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="email"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.length > 0 && (
            <div className="alert alert-danger">
              <h4 className="text-red-500 font-semibold text-xl">Ooops....</h4>
              <ul className="my-0">
                {errors.map((err) => (
                  <li key={err.message} className="text-sm text-red-500">
                    {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="submit"
            className="w-full text-center py-3 rounded bg-red-500 text-white hover:bg-green-dark focus:outline-none my-1"
            onClick={(e) => onSubmit(e)}
          >
            Login
          </button>
        </div>

        <div className="text-grey-dark mt-6">
          No have an account?
          <LinkWrap
            to={"/auth/signup"}
            className="no-underline border-b border-blue text-blue pl-2"
          >
            Sign up
          </LinkWrap>
          .
        </div>
      </div>
    </div>
  );
};

export default Signin;
