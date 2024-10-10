import React, { useState } from 'react';
import './App.css';

function App() {
  const [flair, setFlair] = useState(null);
  const [t1ce, setT1ce] = useState(null);
  const [gifUrl, setGifUrl] = useState(null);

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.nii')) {
      setFile(file);
    } else {
      alert("Invalid file format. Please upload a .nii file.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!flair || !t1ce) {
      alert("Please upload both FLAIR and T1-CE images!");
      return;
    }

    const formData = new FormData();
    formData.append('flair', flair);
    formData.append('t1ce', t1ce);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setGifUrl(url);  // Display the generated GIF in your frontend
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h1>FLAIR and T1-CE to GIF Generator</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="flair">Upload FLAIR Image (.nii):</label>
        <input type="file" id="flair" accept=".nii" onChange={(e) => handleFileChange(e, setFlair)} required />
        
        <label htmlFor="t1ce">Upload T1-CE Image (.nii):</label>
        <input type="file" id="t1ce" accept=".nii" onChange={(e) => handleFileChange(e, setT1ce)} required />
        
        <button type="submit">Generate GIF</button>
      </form>

      {gifUrl && (
        <div id="result">
          <h2>Generated GIF:</h2>
          <img src={gifUrl} alt="Generated GIF" />
        </div>
      )}
    </div>
  );
}

export default App;
