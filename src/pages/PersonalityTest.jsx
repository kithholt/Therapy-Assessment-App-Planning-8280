import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiChevronRight, FiCheck, FiInfo } = FiIcons;

const PersonalityTest = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const questions = [
    {
      id: 1,
      text: "I am the life of the party",
      trait: "extraversion",
      reverse: false
    },
    {
      id: 2,
      text: "I feel little concern for others",
      trait: "agreeableness",
      reverse: true
    },
    {
      id: 3,
      text: "I am always prepared",
      trait: "conscientiousness",
      reverse: false
    },
    {
      id: 4,
      text: "I get stressed out easily",
      trait: "neuroticism",
      reverse: false
    },
    {
      id: 5,
      text: "I have a rich vocabulary",
      trait: "openness",
      reverse: false
    },
    {
      id: 6,
      text: "I don't talk a lot",
      trait: "extraversion",
      reverse: true
    },
    {
      id: 7,
      text: "I am interested in people",
      trait: "agreeableness",
      reverse: false
    },
    {
      id: 8,
      text: "I leave my belongings around",
      trait: "conscientiousness",
      reverse: true
    },
    {
      id: 9,
      text: "I am relaxed most of the time",
      trait: "neuroticism",
      reverse: true
    },
    {
      id: 10,
      text: "I have difficulty understanding abstract ideas",
      trait: "openness",
      reverse: true
    }
  ];

  const traitDescriptions = {
    extraversion: {
      name: "Extraversion",
      description: "Tendency to seek stimulation and enjoy the company of others",
      high: "Outgoing, energetic, and sociable",
      low: "Reserved, quiet, and independent"
    },
    agreeableness: {
      name: "Agreeableness",
      description: "Tendency to be compassionate and cooperative",
      high: "Trusting, helpful, and empathetic",
      low: "Competitive, critical, and skeptical"
    },
    conscientiousness: {
      name: "Conscientiousness",
      description: "Tendency to be organized and dependable",
      high: "Organized, responsible, and hardworking",
      low: "Flexible, spontaneous, and carefree"
    },
    neuroticism: {
      name: "Neuroticism",
      description: "Tendency to experience negative emotions",
      high: "Sensitive, nervous, and prone to stress",
      low: "Calm, confident, and emotionally stable"
    },
    openness: {
      name: "Openness",
      description: "Tendency to be open to new experiences and ideas",
      high: "Creative, curious, and adventurous",
      low: "Practical, conventional, and traditional"
    }
  };

  const calculateResults = () => {
    const scores = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    };

    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        let score = answer;
        if (question.reverse) {
          score = 6 - answer; // Reverse scoring for reversed items
        }
        scores[question.trait] += score;
      }
    });

    // Normalize scores to 0-100 scale
    Object.keys(scores).forEach(trait => {
      const questionsForTrait = questions.filter(q => q.trait === trait).length;
      scores[trait] = Math.round((scores[trait] / (questionsForTrait * 5)) * 100);
    });

    return scores;
  };

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentStep].id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const calculatedResults = calculateResults();
      setResults(calculatedResults);
      setCurrentStep(questions.length);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / (questions.length + 1)) * 100;

  if (results) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-therapy-200 p-8 text-center"
        >
          <SafeIcon icon={FiUsers} className="text-4xl text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-therapy-800 mb-2">Your Personality Profile</h1>
          <p className="text-therapy-600">Based on the Big Five personality model</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(results).map(([trait, score], index) => (
            <motion.div
              key={trait}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-therapy-200 p-6"
            >
              <h3 className="text-lg font-bold text-therapy-800 mb-2">
                {traitDescriptions[trait].name}
              </h3>
              <p className="text-sm text-therapy-600 mb-4">
                {traitDescriptions[trait].description}
              </p>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-therapy-700">Score</span>
                  <span className="text-lg font-bold text-primary-600">{score}%</span>
                </div>
                <div className="w-full bg-therapy-200 rounded-full h-2">
                  <motion.div
                    className="bg-primary-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                </div>
              </div>
              
              <p className="text-sm text-therapy-600">
                {score >= 60 ? traitDescriptions[trait].high : traitDescriptions[trait].low}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200"
        >
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiInfo} className="text-primary-600 mt-1" />
            <div>
              <h3 className="font-bold text-primary-800 mb-2">Understanding Your Results</h3>
              <p className="text-primary-700 text-sm mb-3">
                The Big Five personality model is one of the most widely accepted frameworks in psychology. 
                These results reflect your tendencies and preferences, not fixed characteristics.
              </p>
              <p className="text-primary-600 text-xs">
                Remember that personality is complex and multifaceted. These results are meant to provide 
                insights for self-reflection and personal growth.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/results')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            View All Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-therapy-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-therapy-800">Big Five Personality Test</h1>
          <span className="text-sm text-therapy-500">
            {currentStep + 1} of {questions.length}
          </span>
        </div>
        
        <div className="w-full bg-therapy-200 rounded-full h-2">
          <motion.div
            className="bg-primary-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-therapy-200 p-8"
        >
          <h2 className="text-xl font-semibold text-therapy-800 mb-6">
            "{questions[currentStep].text}"
          </h2>

          <div className="space-y-3">
            {[
              { value: 1, label: "Strongly Disagree" },
              { value: 2, label: "Disagree" },
              { value: 3, label: "Neutral" },
              { value: 4, label: "Agree" },
              { value: 5, label: "Strongly Agree" }
            ].map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  answers[questions[currentStep].id] === option.value
                    ? 'border-primary-600 bg-primary-50 text-primary-800'
                    : 'border-therapy-200 hover:border-therapy-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-sm text-therapy-500">{option.value}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
            currentStep === 0
              ? 'bg-therapy-100 text-therapy-400 cursor-not-allowed'
              : 'bg-white text-therapy-600 hover:bg-therapy-50 border border-therapy-200'
          }`}
        >
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          disabled={answers[questions[currentStep].id] === undefined}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
            answers[questions[currentStep].id] === undefined
              ? 'bg-therapy-100 text-therapy-400 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          <span>{currentStep === questions.length - 1 ? 'Calculate Results' : 'Next'}</span>
          <SafeIcon icon={currentStep === questions.length - 1 ? FiCheck : FiChevronRight} />
        </button>
      </motion.div>
    </div>
  );
};

export default PersonalityTest;