import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import {Post as InterfacePost} from "./main";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

interface Props {
    post: InterfacePost
};

interface Like {
    likeId: string,
    userId: string
}

export const Post = (props: Props) => {

    const {post} = props;
    const [user] = useAuthState(auth);

    const [likes, setLikes] = useState<Like[] | null>(null);

    // This gets the collection of likes
    const likesRef = collection(db, "likes");

    const likesDoc = query(likesRef, where("postId", "==", post.id));

    const getLikes = async () => {
        const data = await getDocs(likesDoc);
        setLikes(data.docs.map((doc) => ({userId: doc.data().userId, likeId: doc.id})));
    };

    useEffect(() => {getLikes();} , []);

    const addLike = async () => {

        try {
            const newDoc = await addDoc(likesRef, {
                userId: user?.uid,
                postId: post.id
            });
    
            if (user) {
                setLikes((prev) => 
                    prev ? [...prev, {userId: user?.uid, likeId: newDoc.id}] 
                        : [{userId: user?.uid, likeId: newDoc.id}]
                );
            };
        }

        catch (err) {
            console.log(err);
        }

    };

    /*
        This queries the database for a specific like id, which in turn links to the
        user that liked the post, and the post itself since the like itself is unique.
        It then passes that query to getDocs to actually get the like.
        From there, we delete the like with likeToDelete();
    */

    const removeLike = async () => {

        // doc() is used to specify which doc you wanna change
        // doc(database, collection, document)
        try {

            const likeToDeleteQuery = query(likesRef, 
                where("postId", "==", post.id),
                where("userId", "==", user?.uid)
            );

            const likeToDeleteData = await getDocs(likeToDeleteQuery);
            const likeId = likeToDeleteData.docs[0].id;
            const likeToDelete = doc(db, "likes", likeId);
            await deleteDoc(likeToDelete);
    
            if (user) {
                setLikes(
                    (prev) => prev && prev.filter((like) => like.likeId !== likeId)
                );
            }
        }

        catch (err) {
            console.log(err);
        }

    }

    const hasCurrentUserLiked = likes?.find((like) => like.userId === user?.uid)

    return (
        <div className="post">
            <div className="author">
                <p>| {post.username} |</p>
            </div>

            <div className="title">
                <h2>{post.title}</h2>
            </div>

            <div className="body">
                <p>{post.description}</p>
            </div>
        
            <div className="footer">
                <button onClick={hasCurrentUserLiked ? removeLike : addLike}>
                    {hasCurrentUserLiked ? <>&#128151;</> : <>&#10084;</>} {likes?.length}
                </button>
            </div>
        </div>
    )
}