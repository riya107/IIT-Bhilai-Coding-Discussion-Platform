import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CommentItem = ({ data }) => {
  return (
    <div className="m-4">
      <Link to={`/api/users/${data.author}`} className="text-link text-primary">
        <small> ~{data.author}</small>
      </Link>
      <small className="ml-3">
        <span> {dayjs(data.time).fromNow()}</span>
      </small>
      <h3 className="mt-2">{data.content}</h3>
      <hr />
    </div>
  );
};

export default CommentItem;
