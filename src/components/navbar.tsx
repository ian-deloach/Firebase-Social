import { Link } from "react-router-dom";
import {auth} from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {signOut} from "firebase/auth";

export const Navbar = () => {

    // This is where we get our information from the user. Ex. The username
    const [user] = useAuthState(auth);

    const signUserOut = async () => {
        await signOut(auth);
    }

    return (
        <div className="navbar">
            <Link to={"/"}>Home</Link>
            {!user ? <Link to={"/login"}>Login</Link> :
            <Link to={"/createpost"}>Create Post</Link>}

            <div className="user">
                {user && (
                    <>
                    <p>{user?.displayName}</p>
                    <img src={user?.photoURL || ""} alt="current user" width="100" height="100" />
                    <br />
                    <button onClick={signUserOut}>Log Out</button>
                    </>
                )}
            </div>
        </div>
    )
}