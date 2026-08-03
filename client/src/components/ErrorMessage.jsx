import { useStateContext } from "../contexts/StateContext";
import loader from "../assets/loader.gif";

function ErrorMessage() {
  const { error } = useStateContext();

    if (error) {
      return (
        <div
          className="mt-[50px] m-auto"
          data-testid="loader-image"
        >
          <h1 className="text-xl text-red-800 font-extrabold">
            {error}
          </h1>
        </div>
      );
    }

    return (
      <div
        className="mt-[50px] w-18 m-auto"
        data-testid="loader-image"
      >
        <img
          className="w-full h-full object-cover"
          src={loader}
          alt="Loading"
        />

        <h1 className="text-xl text-black font-extrabold">
          Loading movies...
        </h1>
      </div>
    );
  }

export default ErrorMessage;