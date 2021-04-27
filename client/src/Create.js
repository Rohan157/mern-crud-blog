import React, { useState } from "react";
import axios from "axios";
import Nav from "./Nav";
import ReactQuill from "react-quill";
import { getUser, getToken } from "./helpers";
import "react-quill/dist/quill.snow.css";

const Create = () => {
  //state
  const [state, setState] = useState({
    title: "",
    user: getUser(),
  });
  const [content, setContent] = useState("");

  //rich text editor handle change
  const handleContent = (event) => {
    console.log(event);
    setContent(event);
  };

  //destructuring value form state
  const { title, user } = state;

  //on change event handler
  const handleChange = (name) => (event) => {
    // console.log("name", name, "event", event.target.value);
    setState({ ...state, [name]: event.target.value });
  };
  //old way of writing the same function given above
  // function handleChange(name) {
  //   return function (event) {
  //     setState({ ...state, [name]: event.target.value });
  //   };
  // }

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(
        `${process.env.REACT_APP_API}/post`,
        { title, content, user },
        {
          headers: {
            authorization: `Bearer ${getToken}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        //emty states after successful post
        setState({ ...state, title: "", user: "" });
        setContent("");
        //show success alert
        alert(`Post titled ${response.data.title} is created`);
      })
      .catch((error) => {
        console.log(error.response);
        alert(error.response.data.error);
      });
  };

  return (
    <div className="container pb-5">
      <Nav />
      <br />
      <h1>Create Post </h1>

      {/* {JSON.stringify(state)} */}
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            onChange={handleChange("title")}
            value={title}
            type="text"
            className="form-control"
            placeholder="Post title"
            required
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Content</label>
          <ReactQuill
            onChange={handleContent}
            value={content}
            theme="snow"
            className="pb-5 mb-3"
            placeholder="Write Something...."
            style={{ border: "1px solid #666" }}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">User</label>
          <input
            onChange={handleChange("user")}
            value={user}
            type="text"
            className="form-control"
            placeholder="Your name"
            required
          />
        </div>
        <button className="btn btn-primary">Create</button>
      </form>
    </div>
  );
};
export default Create;
