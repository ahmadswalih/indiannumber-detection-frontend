"use client";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

export default function ImageProcessing() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const api =
    process.env.NEXT_PUBLIC_API_URL2 ||
    "https://indiannmberplate-api.ahmadswalih.com/upload-image";
  const handleUpload = async () => {
    if (!imageFile) return alert("Please select an image file to upload.");

    setLoading(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        api, // Ensure this matches your image processing endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);

      setResults(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-black items-center justify-center">
      <div className="items-center justify-center flex flex-col mt-12">
        <div className="flex flex-col p-3 items-center rounded-md bg-blue-900 justify-evenly">
          <Image
            width={80}
            height={80}
            className=""
            src="/assets/logo.svg"
            alt="icon"
          />
        </div>
        <p className="p-2 text-xl md:text-4xl items-center justify-center text-center font-arimo font-bold text-black">
          Number Plate Detection From Image
        </p>
        <p className="text-center w-full p-2 md:w-1/2 mt-4 font-normal md:text-xl">
          This demo serves as a proof of concept (POC). In this demonstration,
          the number{" "}
          <span className="text-red-600 underline"> "DL3CBJ1384" </span> has
          been designated as a verified number from the backend system.
          Therefore, in the uploaded image, any number plate corresponding to
          this number will be recognized as verified or authenticated.
        </p>
        <div className="items-center mt-4 flex flex-col md:flex-row justify-center">
          <div className="border-2 mt-4 mr-4 border-dotted border-gray-400 p-4 rounded-md min-h-14">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={handleClick}
                className="flex text-xl text-gray-600 py-2 px-4 rounded"
              >
                <FiUploadCloud className="mr-3" /> Select Your Image
              </button>
              {imageFile && (
                <div className="mt-2 text-sm text-gray-500">
                  Selected image: {imageFile.name}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleUpload}
            className="btn-theame hover:!bg-green-950"
            disabled={!imageFile || loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Upload Image"
            )}
          </button>
        </div>
        <div>
          {results.length > 0 && (
            <div className="table-auto bg-white rounded-2xl p-8 md:text-lg w-full md:w-[100%] shadow-xl text-sm mb-10 mt-16">
              <thead className="rounded-2xl text-left mt-10 text-gray-400">
                <tr>
                  <th className="px-4 py-2">USER NAME</th>
                  <th className="px-4 py-2">VEHICLE NUMBER</th>
                  <th className="px-4 py-2">REGION</th>
                  <th className="px-4 py-2 hidden md:flex">VEHICLE TYPE</th>
                  <th className="px-4 py-2">STATUS</th>
                </tr>
              </thead>
              <hr />
              <tbody className="text-sm md:text-xl">
                {results.map((result, index) => (
                  <tr className="font-poppins" key={index}>
                    <td className="px-4 border-b border-gray-300 py-2 p-10">
                      {result.user ? result.user.name : "no user found"}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-2 p-10">
                      {result.plate}
                    </td>
                    <td className="border-b  border-gray-300 px-4 py-2 p-10">
                      {result.region}
                    </td>
                    <td className="border-b hidden md:flex border-gray-300 px-4 py-2 p-10">
                      {result.vehicleType}
                    </td>
                    <td
                      className={
                        result.authentication === "Verified"
                          ? "px-4 border-b border-gray-300 rounded-lg font-bold py-2 text-green-500 p-10"
                          : "px-4 border-b border-gray-300 py-2 text-red-500 p-10"
                      }
                    >
                      {result.authentication}
                    </td>
                  </tr>
                ))}
              </tbody>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
