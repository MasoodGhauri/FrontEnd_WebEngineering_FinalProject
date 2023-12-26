import React, { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
const QueryList = ({ queries }) => {
  {
    /*
  const [allQueries, setAllQueries] = useState([]);

  useEffect(() => {
    // Fetch queries from your API or database
    const fetchQueries = async () => {
      try {
        const response = await fetch("/getAll");
        const data = await response.json();
        setAllQueries(data.Queries);
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    };

    fetchQueries();
  }, []);

 -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
  }
  const [currentPage, setCurrentPage] = useState(1);
  const [remainingTime, setRemainingTime] = useState(30);
  const [show, setShow] = useState(false);

  const queriesPerPage = 1;
  const indexOfLastQuery = currentPage * queriesPerPage;
  const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
  const currentQueries = queries.slice(indexOfFirstQuery, indexOfLastQuery);

  useEffect(() => {
    const interval = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime((prevTime) => prevTime - 1);
      } else {
        if (currentPage < queries.length / queriesPerPage) {
          setCurrentPage((prevPage) => prevPage + 1);
          setRemainingTime(30);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPage, remainingTime, queries]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setRemainingTime(30);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    setRemainingTime(30);
  };
  const handleSelect = async () => {
    const selectedQuery = currentQueries[0]; // Assuming you want to select the first query on the current page
    let expertID = "658b24bb0a1e6a55be3b3701";
    let expertName = "Adnan";
    const response = await fetch("http://localhost:3000/api/query/select", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selectedQuery._id,
        takenByExpert: {
          id: expertID,
          name: expertName,
        },
      }),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Error: ${response.status} - ${errorMessage}`);
    } else {
      setShow(true);
      console.log(`Query Selected Successfully`);
    }
  };

  const isLastPage = currentPage === Math.ceil(queries.length);
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {!isLastPage && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <strong>Next question in: {remainingTime} seconds</strong>
        </div>
      )}
      <Alert show={show} variant="success">
        <Alert.Heading>Query selected successfully</Alert.Heading>
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-success">
            Close me
          </Button>
        </div>
      </Alert>
      {currentQueries.map((query, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            marginBottom: "20px",
            padding: "10px",
          }}
        >
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Img variant="top" src={query.filesUpload[0].pathName} />

              <Card.Title>Question</Card.Title>
              <Card.Text>
                <div
                  dangerouslySetInnerHTML={{ __html: query.questionJSX }}
                ></div>
                <p> {query.queryPoster.name}</p>
              </Card.Text>
              <Button variant="primary" onClick={handleSelect}>
                Select
              </Button>
            </Card.Body>
          </Card>
        </div>
      ))}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          variant="success"
          onClick={handleNextPage}
          disabled={isLastPage}
        >
          {isLastPage ? "Last Question Reached" : "Skip"}
        </Button>
      </div>
    </div>
  );
};

export default QueryList;
