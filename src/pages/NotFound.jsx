import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white">
    <h1 className="text-6xl font-extrabold mb-4">404</h1>
    <h2 className="text-2xl font-semibold mb-6">Oops! Page Not Found</h2>
    <p className="mb-8 text-center max-w-md">
      The page you're looking for doesn't exist or might have been moved. Use the button below to return to safety.
    </p>
    <Link
      to="/"
      className="px-6 py-3 bg-white text-pink-500 font-semibold rounded-md shadow-lg hover:bg-gray-100 transition"
    >
      Go Back to Login
    </Link>
    <div className="mt-8">
      <img
        src="https://via.placeholder.com/300x200?text=Error+404" // Replace with a proper illustration URL
        alt="404 illustration"
        className="w-80 mx-auto"
      />
    </div>
  </div>
);

export default NotFound;
