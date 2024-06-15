import Login from "./Login";
import Register from "./Register";

const Auth = () => {
    return (
        <div className="flex items-center justify-between h-full w-full">
            <Login />
            <hr className="bg-gray-300/30 w-[1px] h-1/2 rounded" />
            <Register />
        </div>
    );
};

export default Auth;
