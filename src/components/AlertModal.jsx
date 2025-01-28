import React from "react";
import { Button } from "@/components/ui/button";

const AlertModal = ({ isOpen, title, message, onClose }) => {

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    // window.location.reload();
  };
  const isError = title === "Error";
  const titleColor = isError ? "text-destructive" : "";
  const buttonColor = isError
    ? "bg-red-600 hover:bg-red-700"
    : "";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="p-6 rounded-lg shadow-lg w-11/12 md:w-1/3 bg-accent">
        <div className="flex flex-col justify-between">
          <div className="mb-4">
            <h2 className={`text-2xl font-semibold mb-3 text-center ${titleColor}`}>
              {title}
            </h2>
            <p className="text-lg text-center">{message}</p>
          </div>
        </div>
        <div className="flex justify-end items-center">
          <Button
            onClick={handleClose}
            className={`${buttonColor} font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out mt-4`}
          >
            Close
          </Button>
            </div>
      </div>
    </div>
  );
};

export default AlertModal;
