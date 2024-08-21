import { useState } from "react";

const App = () => {
  const [image, setImage] = useState(null);

  /**
   * Handles the upload of an image file.
   *
   * This function is called when the user selects a file in the file input. It creates a FormData object with the selected file, sets the image state to the selected file, and sends a POST request to the server at `http://localhost:8000/upload` with the FormData object as the request body.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event object from the file input.
   * @returns {Promise<void>} - A Promise that resolves when the image upload is complete.
   */
  const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    setImage(e.target.files[0]);
  
    try {
      // const options = {
      //   method: "POST",
      //   body: formData,
      // };
      // const response = await fetch("http://localhost:8000/upload", options);
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }; // End of uploadImage function
   console.log(image);
   

  return (
    <div className="App">
      <label htmlFor="files">Upload Image</label>
      <input onChange={uploadImage} id="files" type="file" accept="image/*" hidden />
      {image && <img src={URL.createObjectURL(image)} alt="Uploaded image" />}
    </div>
  );
}

export default App;
