import { Navigate, useParams } from "react-router-dom";
import { DeletePost, GetPost, Addcomment } from "./../actions/PostActions";
import { useState, useEffect } from "react";
import { Toggle_modal } from "./../actions/ToggleActions";
import { connect } from "react-redux";
import Loader from "./Loader";
import CommentItem from "./styleditems/CommentItem";
import FullSinglePost from "./styleditems/FullSinglePost";
import { Button, FormGroup, Input } from "reactstrap";

const SinglePost = ({
  isauth,
  DeletePost,
  post,
  user,
  GetPost,
  Toggle_modal,
  isloading,
  Addcomment,
}) => {
  const [delpost, setDelpost] = useState(false);
  const [comment, setcomment] = useState("");

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      GetPost(id);
    }
  }, [id, GetPost]);

  const handleAddcomment = (e) => {
    e.preventDefault();
    if (!isauth) {
      Toggle_modal();
    } else {
      if (comment.trim().length) {
        const data = { content: comment, author: user.username };
        Addcomment(id, JSON.stringify(data));
        setcomment("");
      } else {
        alert("Comment can't be empty!");
      }
    }
  };

  const handleDelete = () => {
    DeletePost(id);
    setDelpost(true);
  };

  const comments = post?.comments?.map((data, index) => (
    <CommentItem data={data} key={index} />
  ));

  if (delpost) return <Navigate to="/api/posts" />;

  return (
    <div className="PersonInfo">
      {!isloading ? (
        <div>
          <div className="d-flex">
            <FullSinglePost handleDelete={handleDelete} post={post} user={user} />
          </div>

          <hr className="my-5" />

          <div className="container row ml-2">
            <FormGroup className="col-9">
              <Input
                type="textarea"
                name="body"
                rows={2}
                value={comment}
                onChange={(e) => setcomment(e.target.value)}
                placeholder="Add a comment here..."
              />
            </FormGroup>
            <FormGroup className="m-auto col-3">
              <Button className="rounded p-1" onClick={handleAddcomment}>
                <i className="fa fa-send-o"> Post </i>
              </Button>
            </FormGroup>
          </div>

          <hr className="my-3" />
          <div>{post.comments?.length || 0} comments</div>
          {comments?.reverse()}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  post: state.post.onePost,
  isloading: state.post.loading,
  user: state.auth.user,
  isauth: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  DeletePost,
  Toggle_modal,
  Addcomment,
  GetPost,
})(SinglePost);
