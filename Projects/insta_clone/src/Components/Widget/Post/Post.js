import React, { useEffect, useState } from "react";
import "./Post.css";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { DateTime } from "luxon";
import moment from "moment";

import axios from "axios";

import Modal from "react-modal";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { Link } from "react-router-dom";

TimeAgo.addDefaultLocale(en);

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
//   marginLeft: "auto",
//   transition: theme.transitions.create("transform", {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

const customStyles = {
  // content: {
  //   top: "50%",
  //   left: "50%",
  //   right: "auto",
  //   bottom: "auto",
  //   marginRight: "-50%",
  //   transform: "translate(-50%, -50%)",
  //   backgroundColor: "#161A18",
  // },
  content: {
    display: "flex",
    width: "60%",
    height: "70vh",

    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(74, 80, 80, 0.5)",
  },
};

Modal.setAppElement("#root");

export default function Post() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [likes, setLikes] = useState([]);
  const [postImg, setPostImg] = useState([]);

  const currUserId = sessionStorage.getItem("userID");

  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  // console.log()

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const postRes = await axios
          .get("http://localhost:8000/posts")
          .then((res) => {
            console.log(res);
            setPosts(res?.data);
          });
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllUsers = async () => {
      await axios
        .get("http://localhost:8000/users")
        .then((res) => {
          setUsers(res?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const fetchAllLikes = async () => {
      axios
        .get("http://localhost:8000/likes")
        .then((res) => {
          setLikes(res?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchAllPosts();
    fetchAllUsers();
    fetchAllLikes();
  }, []);

  const likeClicked = async (uid, pid) => {
    // console.log(
    //   likes.filter(({ userId, postId }) => userId === uid && postId === pid)
    // );

    if (
      likes.filter(
        ({ userId, postId }) =>
          userId === parseInt(uid) && postId === parseInt(pid)
      ).length === 0
    ) {
      await axios.post("http://localhost:8000/likeclicked", {
        userId: parseInt(uid),
        postId: parseInt(pid),
      });

      // setLikes(...likes,...[{userId:uid , postId:pid}])

      const res = await axios.get("http://localhost:8000/likes");
      setLikes(res?.data);
    } else {
      await axios.post("http://localhost:8000/dislikeclicked", {
        userId: parseInt(uid),
        postId: parseInt(pid),
      });

      const res = await axios.get("http://localhost:8000/likes");
      setLikes(res?.data);
    }
  };

  const openModal = (pid) => {
    const res = posts.filter((post) => post.post_id === parseInt(pid));

    // setTimeout(() => {
    setIsOpen(true);
    // }, 500);

    console.log(res[0]);

    setPostImg(res);
  };

  const afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#000";
    console.log(postImg);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {posts
        ?.slice(0)
        .reverse()
        .map((post) => {
          // const curDate = new Date();

          // to find the user who post
          const user = users.find((user) => user.id === post.userId);

          const like = likes.filter((like) => post.post_id === like.postId);
          // console.log(like.length, "like");
          const date = DateTime.fromISO(post.post_create_date)
            .toFormat("dd-MM-yyyy")
            .replaceAll("-", " / ");
          const timeAgo = moment(post.post_create_date, "YYYYMMDD").fromNow();
          // console.log(date);
          return (
            <>
              <Card
                key={post.post_id}
                sx={{ maxWidth: 400, height: "auto", marginBottom: "30px" }}
                // onDoubleClick={() => {
                //   likeClicked(currUserId, post?.post_id);
                // }}
              >
                <CardHeader
                  avatar={
                    <Link
                      style={{ textDecoration: "none" }}
                      to={`/users/${user?.id}`}
                    >
                      <Avatar
                        
                        sx={{ bgcolor: red[500], fontWeight: "bold" }}
                        aria-label="recipe"
                      >
                        {user?.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </Link>
                  }
                  // action={
                  //   <IconButton aria-label="settings">
                  //     <MoreVertIcon />
                  //   </IconButton>
                  // }

                  title={`${user?.username}  •  ${timeAgo}`}
                  subheader={date}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {post.post_desc}
                  </Typography>
                </CardContent>
                <CardMedia
                  onClick={() => openModal(post?.post_id)}
                  component="img"
                  height="auto"
                  image={post.post_img}
                  alt="PostImage"
                />

                <CardActions disableSpacing sx={{ paddingBottom: 0 }}>
                  <IconButton
                    aria-label="add to favorites"
                    style={{ width: "50px" }}
                  >
                    <FavoriteIcon
                      onClick={() => {
                        likeClicked(currUserId, post.post_id);
                      }}
                    />
                  </IconButton>

                  <IconButton aria-label="share" style={{ width: "50px" }}>
                    <ShareIcon />
                  </IconButton>
                </CardActions>

                <CardContent sx={{ paddingTop: 0 }}>
                  <Typography variant="body1">{like.length} likes</Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                  {post.post_desc}
                </Typography> */}
                </CardContent>
              </Card>

              <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >
                {/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
                <img src={postImg[0]?.post_img} />
                {/* <div>hello</div> */}
              </Modal>
            </>
          );
        })}
    </>
  );
}
