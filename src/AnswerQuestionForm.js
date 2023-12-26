import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Quillbar.css";

// Assuming your backend URL
const BackendURL = "http://localhost:3000";

const AnswerQuestionForm = () => {
  const [id, setId] = useState("");
  const [answeredBy, setAnsweredBy] = useState({ id: "", name: "" });
  const [answerText, setAnswerText] = useState("");
  const [answerJSX, setAnswerJSX] = useState("");
  const [files, setFiles] = useState(null);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("answeredBy", JSON.stringify(answeredBy));
    formData.append("answerText", answerText);
    formData.append("answerJSX", answerJSX);

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    try {
      const response = await fetch(`${BackendURL}/api/query/answer`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Answer saved successfully:", data.Query);
        // Handle success, e.g., show a success message or redirect
      } else {
        console.error("Error saving answer");
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
            <Form.Label>Question ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the question ID"
              onChange={(e) => setId(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAnsweredBy">
            <Form.Label>Answered By</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your ID"
              onChange={(e) =>
                setAnsweredBy({ ...answeredBy, id: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formAnswerText">
            <Form.Label
              style={{ fontWeight: "bold", marginTop: "20%", display: "block" }}
            >
              Write your answer
            </Form.Label>
            <ReactQuill
              theme="snow"
              value={answerText}
              onChange={setAnswerText}
              style={{ height: "200px", marginTop: "5%" }}
            />
          </Form.Group>
        </Form>
      </Card.Body>

      {/*  <Form.Group controlId="formAnswerJSX">
        <Form.Label style={{ fontWeight: "bold", marginTop: "5%" }}>
          Answer JSX
        </Form.Label>
        <ReactQuill
          theme="snow"
          value={answerJSX}
          onChange={setAnswerJSX}
          style={{ height: "200px", marginTop: "2%" }}
        />
      </Form.Group>
*/}
      <Form.Group className="fileUpload" controlId="formFileMultiple">
        <Form.Label>Upload Files</Form.Label>
        <Form.Control type="file" multiple onChange={handleFileChange} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit Answer
      </Button>
    </Card>
  );
};

export default AnswerQuestionForm;
