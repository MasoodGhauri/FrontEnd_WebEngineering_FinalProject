import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Quillbar.css";
// Assuming your backend URL
const BackendURL = "http://localhost:3000";

const PostQuestionForm = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  //const [questionText, setQuestionText] = useState("");
  const [quillHTML, setQuestionText] = useState("");
  const [files, setFiles] = useState(null);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const doc = new DOMParser().parseFromString(quillHTML, "text/html");
    const textWithoutTags = doc.body.textContent || "";
    const questionText = textWithoutTags;
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("questionText", questionText);
    formData.append("questionJSX", quillHTML);

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    try {
      const response = await fetch(`${BackendURL}/api/query/new`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Files uploaded successfully");
      } else {
        console.error("Error uploading files");
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Card style={{ maxWidth: "600px", margin: "auto", marginTop: "20px" }}>
      <Card.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="formId">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your ID"
              onChange={(e) => setId(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formQuestionText">
            <Form.Label
              style={{ fontWeight: "bold", marginTop: "20%", display: "block" }}
            >
              Write your question
            </Form.Label>
            <ReactQuill
              theme="snow"
              value={quillHTML}
              onChange={setQuestionText}
              style={{ height: "200px", marginTop: "5%" }}
            />
          </Form.Group>
          <Form.Group className="fileUpload" controlId="formFileMultiple">
            <Form.Label>Upload Files</Form.Label>
            <Form.Control type="file" multiple onChange={handleFileChange} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PostQuestionForm;
