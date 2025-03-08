export default function Notification({ message, type, onClose }) {
  return (
    <div
      className={`fixed top-4 right-4 w-80 p-4 rounded-md shadow-lg flex items-center ${type === "success"
          ? "bg-white border-l-4 border-green-500"
          : "bg-white border-l-4 border-red-500"
        }`}
    >
      <div className="flex items-center flex-grow">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white mr-3`}
        >
          {type === "success" ? "✔️" : "❌"}
        </div>
        <div className="text-gray-900">{message}</div>
      </div>
      <button
        onClick={onClose}
        className="ml-3 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
