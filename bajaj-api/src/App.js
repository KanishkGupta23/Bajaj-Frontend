import React, { useState } from "react";
import axios from "axios";
import './App.css'; // Importing the CSS file

function App() {
    const [formData, setFormData] = useState({
        data: "",
        file: null,
    });
    const [response, setResponse] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData({ ...formData, file: reader.result.split(",")[1] }); // Get Base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            // Clean the input string (remove spaces around the quotes)
            const cleanedData = formData.data.trim();
    
            // Try parsing the cleaned input as JSON
            const dataArray = JSON.parse(cleanedData);
    
            // Proceed with the payload if parsing is successful
            const payload = {
                data: dataArray,
                file_b64: formData.file,
            };
    
            const response = await axios.post("https://bajaj-backend-1zt8.onrender.com/api/endpoint", payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setResponse(response.data);
        } catch (error) {
            // If parsing fails, show an error message
            alert("Invalid JSON format. Please use straight quotes and valid JSON syntax.");
            console.error("Error parsing JSON:", error);
        }
    };
    
    

    return (
        <div className="app-container">
            <h1>API Request Example</h1>
            <form className="form-container">
                <div className="form-group">
                    <label>Input Array (JSON format):</label>
                    <input
                        type="text"
                        name="data"
                        value={formData.data}
                        onChange={handleChange}
                        placeholder='Example: ["M", "1", "334", "4", "B", "Z", "a", "7"]'
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Upload File:</label>
                    <input type="file" name="file" onChange={handleFileChange} required />
                </div>

                <button type="button" className="submit-button" onClick={handleSubmit}>
                    Submit
                </button>
            </form>

            {response && (
                <div className="response">
                    <h2>Response:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default App;
