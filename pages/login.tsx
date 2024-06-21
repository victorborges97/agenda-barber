import { NextPage } from "next";
import { useRouter } from "next/router";
import { useLogin } from "../hooks/useLogin";

const Login: NextPage = () => {
    const r = useRouter();
    const { handleLoginGoogle } = useLogin();
    return (
        <div>
            Login
            <button
                onClick={() => {
                    handleLoginGoogle().then((user) => {
                        console.log(user);
                        r.replace("/");
                    });
                }}
            >
                Logar
            </button>
        </div>
    );
};

export default Login;
