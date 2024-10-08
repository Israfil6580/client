import { useContext, useState } from "react";
import FcGoogle from "../../assets/google.svg";
import { AuthContext } from "../../provider/AuthProvider";

const AuthForm = () => {
  const { signUpUser, signInWithGoogl, firebaseLoading, signInUser } =
    useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const name = form.name ? form.name.value : "";

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpUser(email, password, name, file);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithGoogl();
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      await signInUser(email, password);
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div>
      <form
        className="bg-gray-50 border w-full lg:px-8 px-3 pt-6 pb-8 mb-4 rounded-2xl block lg:mx-auto mt-10"
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold font-logo">
            {isLogin ? "Login" : "Register"}
          </h1>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="appearance-none border rounded-xl w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="appearance-none border rounded-xl w-full py-3 px-3 text-gray-700 mb-3 leading-tight focus:outline-none"
            required
          />
        </div>

        {!isLogin && (
          <>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-bold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="appearance-none border rounded-xl w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="photo"
                className="block text-gray-700 font-bold mb-2"
              >
                Photo
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="bg-white appearance-none border rounded-xl w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none"
              />
            </div>
          </>
        )}

        {error && (
          <p className="text-red-500 text-center" aria-live="assertive">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between">
          <button
            className="btn lg:mt-5 mt-0 w-full btn-primary tracking-wide text-base text-white font-bold py-2"
            type="submit"
            disabled={firebaseLoading}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </div>
      </form>

      {isLogin && (
        <div className="flex flex-col w-full mt-4">
          <div className="divider">or connect with</div>
          <button
            onClick={signInWithGoogle}
            className="btn p-0 bg-transparent hover:bg-transparent shadow-none border-none"
            disabled={firebaseLoading}
          >
            <img src={FcGoogle} alt="Google Login" className="w-12 h-12" />
          </button>
        </div>
      )}

      <div className="text-center mt-4">
        <p className="text-sm">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="text-blue-500 hover:underline"
                onClick={handleToggle}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-500 hover:underline"
                onClick={handleToggle}
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
