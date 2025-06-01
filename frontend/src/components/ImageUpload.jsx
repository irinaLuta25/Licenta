import React, { useState } from "react";

function ImageUpload({ onImageUpload }) {
    const [dragOver, setDragOver] = useState(false);
    const [fileName, setFileName] = useState(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setFileName(file.name);
            onImageUpload(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            onImageUpload(file);
        }
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            className={`border-2 border-dashed ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-indigo-300"} p-6 text-center rounded-md transition-colors duration-300`}
        >
            <p className="font-semibold text-indigo-700">Trage o imagine aici pentru a o încărca</p>
            <p className="text-gray-500 text-sm mb-4">sau fă clic pentru a selecta un fișier (max. 4MB)</p>

            <label className="cursor-pointer inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                Selectează fișier
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label>

            {fileName && (
                <p className="mt-3 text-sm text-gray-700">Fișier selectat: {fileName}</p>
            )}
        </div>
    );
}

export default ImageUpload;
