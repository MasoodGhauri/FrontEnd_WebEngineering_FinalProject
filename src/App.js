/*import logo from "./logo.svg";
import "./App.css";
import PostQuestionForm from "./PostQuestionsForm";
import AnswerQuestionForm from "./AnswerQuestionForm";
import QueryList from "./QuerySelection";
function App() {
  return (
    <div className="App">
      {/*<PostQuestionForm />}
      {<AnswerQuestionForm />}
    </div>
  );
}

export default App;
*/

import React, { useState, useEffect } from "react";
import QueryList from "./QuerySelection";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [allQueries, setAllQueries] = useState([]);

  useEffect(() => {
    // Fetch queries from your API or database
    const fetchQueries = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/query/getAll");
        const data = await response.json();
        setAllQueries(data.Queries);
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    };

    fetchQueries();
  }, []);

  return (
    <div>
      <h1>Query List</h1>
      <QueryList queries={allQueries} />
    </div>
  );
};

export default App;
/**/
