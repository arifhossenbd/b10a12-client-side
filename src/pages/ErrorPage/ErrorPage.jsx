import { useRouteError, Link } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Blood drop icon */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-red-500" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-red-600">
          {error.status || "Oops!"}
        </h1>
        
        <h2 className="font-semibold text-gray-800">
          {error.statusText || error.message || "Something went wrong"}
        </h2>
        
        <p className="text-gray-600">
          We couldn't find the page you're looking for. 
          While we fix this, you can help save lives by donating blood.
        </p>
       
        <Link
            to="/"
            className="inline-block w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            Return Home
          </Link>
        
        {error.status === 404 && (
          <p className="text-sm text-gray-500 pt-4">
            If you believe this page should exist, please contact our support team.
          </p>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;