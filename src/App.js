
import { useState } from "react";

const App = () => {
  const [image, setImage] = useState(null);
  const [value, setValue] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");



  const surpriseOptions = [
    "A fantasy landscape with a castle in the distance",
    "A cute animal playing in the snow",
    "A futuristic cityscape with flying cars",
    "A cozy cabin in the woods",
    "A beautiful sunset over a beach",
    "A group of friends having a picnic in the park",
    "A majestic mountain range with a river flowing through it",
    "A starry night sky with a full moon",
    "A cozy living room with a fireplace",
    "A beautiful garden with blooming flowers",
  ];

  /**
   * Generates a random surprise option from the `surpriseOptions` array and sets the `value` state to the selected option.
   *
   * This function is called when the user wants to generate a random surprise option. It selects a random index from the `surpriseOptions` array, and sets the `value` state to the corresponding option.
   */
  const surprise = () => {
    const randomIndex = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    // setValue(surpriseOptions[randomIndex]);
    setValue(randomIndex);
  }; // End of surprise function



  /**
   * Handles the upload of an image file.
   *
   * This function is called when the user selects a file in the file input. It creates a FormData object with the selected file, sets the image state to the selected file, and sends a POST request to the server at `http://localhost:8000/upload` with the FormData object as the request body.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event object from the file input.
   * @returns {Promise<void>} - A Promise that resolves when the image upload is complete.
   */
  const uploadImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    setImage(e.target.files[0]);

    try {
      const options = {
        method: "POST",
        body: formData,
      };
      const response = await fetch("http://localhost:8000/upload", options);
      // const response = await fetch("http://localhost:8000/upload", {
      //   method: "POST",
      //   body: formData,
      // });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
      setError("An error occurred while uploading the image, Please try again.");
    }
  }; // End of uploadImage function

  /**
   * Sends a POST request to the server to analyze the uploaded image based on the user's input.
   *
   * This function is called when the user clicks the "Ask me" button. It first checks if an image has been uploaded, and if not, sets an error message. Otherwise, it creates a POST request with the user's input as the request body, sends the request to the server at `http://localhost:8000/analyze`, and sets the response from the server as the `response` state.
   *
   * @returns {Promise<void>} - A Promise that resolves when the image analysis is complete.
   */
  const analyzeImage = async () => {
    if (!image) {
      setError("Please upload an image");
      return;
    }; // End if
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value,
          // image: image,
        }),
        headers: {
          "Content-Type": "application/json",
        }
      };


      const response = await fetch("http://localhost:8000/analyze", options);
      const data = await response.text();
      setResponse(data);

    } catch (error) {
      setError(error);

    }
  }; // End of analyzeImage function

  /**
   * Clears the image, value, response, and error states.
   *
   * This function is called when the user wants to clear the current state of the application. It sets the image state to null, the value state to an empty string, and the response and error states to empty strings.
   */
  const clear = () => {
    setImage(null);
    setValue("");
    setResponse("");
    setError("");
  }; // End of clear function


  return (
    <div className="app">
      <section className="search-section">
        <div className="image-container">
          {image && <img className="image" src={URL.createObjectURL(image)} alt="Uploaded image" />}

        </div>
         {!response && <p className="extra-info">
          <span>
            <label htmlFor="files">Upload Image </label>
            <input 
              onChange={uploadImage}
              id="files"
              type="file"
              accept="image/*"
              hidden 
            />
          </span>
          to ask questions about.
        </p> }
        <p className="extra-info"> What you want to know about the image?
          {/* <button className="surprise" onClick={surprise} disabled={response}>Surprise me!</button> */}
        </p>
        <div className="input-container">
          <input
            value={value}
            placeholder="What is in the image...?"
            onChange={(e) => setValue(e.target.value)}
          />
          {(!response && !error) && <button onClick={analyzeImage}>Ask me</button>}
          {(response || error) && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        {response && <p className="answer">{response}</p>}
      </section>
    </div>
  );
};

export default App;
