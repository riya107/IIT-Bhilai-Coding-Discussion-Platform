import React, { useEffect } from "react";
import { useParams } from "react-router-dom"; 
import AllPosts from "../Posts";
import { connect } from "react-redux";
import defaultDp from "./../../images/defaultDp.png";
import EditProfile from "./EditProfile";
import { Button } from "reactstrap";
import Loader from "./../Loader";
import { get_profile, edit_profile } from "./../../actions/ProfileActions";

const Profile = ({ auth, profile, get_profile, edit_profile }) => {
  const { username } = useParams();

  useEffect(() => {
    get_profile(username);
  }, [get_profile, username]);

  if (profile.isLoading) return <Loader />;
  if (profile.isEditing) return <EditProfile />;

  return (
    <div className="container mt-5 pt-4">
      <div className="row align-items-center">
        <div className="col-sm-3 text-center">
          <img
            src={defaultDp}
            className="rounded img-fluid"
            alt="defaultDp"
            width="200"
            height="200"
          />
        </div>
        <div className="col-sm-9">
          {username === auth.user?.username && (
            <Button
              style={{ float: "right" }}
              color="light"
              onClick={() => edit_profile()}
            >
              <i className="fa fa-pencil" />
            </Button>
          )}

          <div className="text-danger h3 mb-2">{profile.profile?.username}</div>
          <div className="text-info h4 mb-2">
            {profile.profile?.info?.fullname}
          </div>
          <div className="text-muted">{profile.profile?.email}</div>
          <div className="text-muted">
            <strong>Bio:</strong> {profile.profile?.info?.bio}
          </div>
          <div className="text-muted">
            <strong>Skills:</strong> {profile.profile?.info?.skills}
          </div>
        </div>
      </div>

      <hr />

      <h4 className="text-muted m-4">Posts of {username}</h4>
      <AllPosts author={username} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { get_profile, edit_profile })(Profile);
