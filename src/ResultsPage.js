import React from 'react';

const ResultsPage = ({ result, onBack, onNextLevel, currentLevel, totalTokensAccumulated }) => {
  // Calculate tokens based on the conditions
  const calculateTokens = () => {
    let tokens = 0;

    // Check for word_check_message_image
    if (result.word_check_message_image === "Congratulations, you found the information!") {
      tokens += 3; // Award 3 tokens for the image message

      // Check for word_check_message_url if image message is congratulatory
      if (result.word_check_message_url === "Information verified") {
        tokens += 2; // Award 2 tokens if URL message is "Information verified"
      } else {
        tokens += 1; // Award 1 token if URL message is anything else
      }
    }

    return tokens;
  };

  const totalTokens = calculateTokens();
  const isFinalLevel = currentLevel === 10;

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4">
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 filter blur-3xl opacity-70"></div>
      
      {/* Content */}
      <div className="relative max-w-lg w-full bg-white p-10 rounded-xl shadow-2xl border border-gray-200 z-10">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">Analysis Results</h2>
          <p className="text-gray-600 mt-2">Here are the results of your analysis:</p>
        </div>
        <div className="mt-8 space-y-6">
          {result.word_check_message_image && (
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <p className="text-blue-700">{result.word_check_message_image}</p>
            </div>
          )}
          {result.word_check_message_image === "Congratulations, you found the information!" && result.word_check_message_url && (
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm mt-4">
              <p className="text-blue-700">{result.word_check_message_url}</p>
            </div>
          )}
          {result.error_url && (
            <div className="bg-red-50 p-6 rounded-lg shadow-sm mt-4">
              <h3 className="text-xl font-bold text-red-600">URL Error</h3>
              <p className="text-red-700">{result.error_url}</p>
            </div>
          )}
          {/* Display total tokens for current level */}
          <div className="bg-green-50 p-6 rounded-lg shadow-sm mt-4">
            <p className="text-green-700 text-lg font-semibold">Tokens for this level: {totalTokens}</p>
          </div>
          {/* Display total accumulated tokens if on final level */}
          {isFinalLevel && (
            <div className="bg-green-100 p-6 rounded-lg shadow-sm mt-4">
              <p className="text-green-800 text-lg font-semibold">Total Tokens Received: {totalTokensAccumulated}</p>
            </div>
          )}
        </div>
        <div className="flex justify-center mt-8">
          {/* Render button only if not on final level */}
          {!isFinalLevel && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
              onClick={onNextLevel}
            >
              Next Level
            </button>
          )}
          {/* Back button always available */}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
