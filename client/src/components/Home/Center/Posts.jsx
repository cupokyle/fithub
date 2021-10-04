import { TokenUserContext } from "../../App/App";
import { useContext, useState, useEffect } from "react";
import { GiStrong } from "react-icons/gi";
import "./posts.scss";
import PostMessage from "./PostMessage";
import PostLike from "./PostLike";
import axios from "axios";

export default function Posts(props) {
  const { userState } = useContext(TokenUserContext);
  const [user] = userState;
  const { workoutId } = props;
  const [post, setPost] = useState("");
  const [likes, setLikes] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get(`/api/posts/comments/${workoutId}`),
      axios.get(`api/posts/likes/${workoutId}`),
      // axios.get(`api/workout/${workoutid}`),
    ]).then((all) => {
      setPost(all[0].data);
      setLikes(all[1].data);
      const starterLikes = all[1].data;
      starterLikes.forEach((like) => {
        if (like.user_id === user.user.id) {
          toggleSelected();
        }
      });
    });
  }, []);

  function toggleSelected() {
    const element = document.getElementById(workoutId);
    element.classList.toggle("liked");
  }

  // show comments
  // show the post

  function addLike() {
    axios
      .post("/api/posts/likes/new", {
        userId: user.user.id,
        workoutId: workoutId,
      })
      .then((res) => {
        console.log(res);
      });
  }
  function removeLike(like_id) {
    axios.delete(`/api/posts/likes/${like_id}`).then((res) => {
      return res;
    });
  }
  function toggleLike() {
    toggleSelected();
    axios
      .get(`/api/posts/likes/${workoutId}`)
      .then((results) => {
        let liked = false;
        let currentLike;
        results.data.forEach((like) => {
          if (like.user_id === user.user.id) {
            currentLike = like;
            liked = true;
          }
        });
        liked ? removeLike(currentLike.id) : addLike();
      })
      .then((res) => {
        axios.get(`api/posts/likes/${workoutId}`).then((result) => {
          setLikes(result.data);
        });
      });
  }

  const comments =
    post &&
    post.map((comment) => (
      <PostMessage
        key={comment.id}
        comment_id={comment.id}
        userId={comment.user_id}
        message={comment.message}
        avatar={comment.avatar_url}
        first_name={comment.first_name}
        last_name={comment.last_name}
        setPost={setPost}
        workoutId={workoutId}
      />
    ));

  function postComment(message) {
    const commentInput = document.getElementById("commentInput");
    axios
      .post("/api/posts/comments/new", {
        userId: user.user.id,
        workoutId: workoutId,
        message: message,
      })
      .then((res) => {
        axios
          .get(`api/posts/comments/${workoutId}`)
          .then((result) => {
            setPost(result.data);
          })
          .catch((err) => console.log(err));
      })
      .then(() => {
        commentInput.value = "";
      })
      .catch((error) => console.log(error));
  }

  // const postLikes =
  //   likes && likes.map((x) => <PostLike key={x.id} userId={x.user_id} />);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">Workout #{workoutId}</div>
          <div
            className="postTopRight"
            id={workoutId}
            onClick={() => {
              toggleLike();
            }}
          >
            <p>{likes.length}</p>
            <div className="like-icon">
              <GiStrong />
            </div>
          </div>
        </div>
        <div className="postBottom">
          <div className="commentInput">
            <img alt="" src={user.user ? user.user.avatar_url : ""} />
            <input
              id="commentInput"
              type="text"
              onChange={(event) => setComment(event.target.value)}
            />
            <button
              onClick={() => {
                console.log("workout id", workoutId);
                postComment(comment);
              }}
            >
              Comment
            </button>
          </div>
          <div>{comments}</div>
        </div>
      </div>
    </div>
  );
}