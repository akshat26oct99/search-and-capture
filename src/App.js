import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WelcomePage from './WelcomePage'; // New import
import HomePage from './HomePage'; // New import
import LevelsPage from './LevelsPage'; // Updated import
import ResultsPage from './ResultsPage';
import Spinner from './Spinner'; // Spinner component for loading

const App = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [level, setLevel] = useState('1'); // Default to level 1
  const [config, setConfig] = useState({});
  const [totalTokensAccumulated, setTotalTokensAccumulated] = useState(0); // To track total tokens
  const [hasStarted, setHasStarted] = useState(false); // To track if user has started
  const [isHomePage, setIsHomePage] = useState(false); // To track if user is on HomePage

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('/level_config.json'); // Path for frontend
        setConfig(response.data);
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    // Update total tokens accumulated based on current level
    if (result) {
      const calculateTokens = () => {
        let tokens = 0;

        // Calculate tokens based on the result
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

      const tokensForCurrentLevel = calculateTokens();
      setTotalTokensAccumulated(prevTokens => prevTokens + tokensForCurrentLevel);
    }
  }, [result]);

  const handleAnalyze = async (file, url) => {
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    formData.append('url', url);
    formData.append('level', level);

    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error('Error analyzing the inputs:', error);
      alert('Failed to analyze the inputs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setResult(null);
  };

  const handleNextLevel = () => {
    setLevel((prevLevel) => (parseInt(prevLevel) + 1).toString());
    setResult(null);
  };

  const handleStart = () => {
    setHasStarted(true); // Move to HomePage when user clicks Let's Begin
    setIsHomePage(true);
  };

  const handleLevelSelect = (selectedLevel) => {
    setLevel(selectedLevel.toString());
    setIsHomePage(false);
    setResult(null);
  };

  const currentConfig = config[level] || {};
  const currentLevel = parseInt(level);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
      {!hasStarted ? (
        <WelcomePage onStart={handleStart} />  // Show WelcomePage until user starts
      ) : isHomePage ? (
        <HomePage onSelectLevel={handleLevelSelect} /> // Show HomePage after WelcomePage
      ) : result ? (
        <ResultsPage 
          result={result} 
          onBack={handleBack} 
          onNextLevel={handleNextLevel} 
          currentLevel={currentLevel} // Pass currentLevel to ResultsPage
          totalTokensAccumulated={totalTokensAccumulated} // Pass totalTokensAccumulated to ResultsPage
        />
      ) : (
        <LevelsPage 
          onAnalyze={handleAnalyze} 
          isLoading={isLoading} 
          level={currentConfig.level}
          search_text={currentConfig.search_text} 
          hint={currentConfig.hint} 
        />
      )}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default App;


