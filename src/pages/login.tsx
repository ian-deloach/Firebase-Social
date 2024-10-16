import {auth, provider} from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Login = () => {

    const navigate = useNavigate();

    const signInWithGoogle = async () => {
            const result = await signInWithPopup(auth, provider);
            // Navigate will automatically send you back to the home page
            console.log(result);
            navigate("/");
        }

    return (
        <div>
            <p>Sign in with Google to continue</p>
            <button onClick={signInWithGoogle}>Google sign in</button>
        </div>
    )
}