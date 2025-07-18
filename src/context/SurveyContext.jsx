import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendClientResults, addToMailchimp, notifyTherapist } from '../api/emailService';

const SurveyContext = createContext();

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};

export const SurveyProvider = ({ children }) => {
  const [surveys, setSurveys] = useState([]);
  const [responses, setResponses] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    id: uuidv4(),
    name: '',
    email: ''
  });

  useEffect(() => {
    // Load initial surveys
    const initialSurveys = [
      {
        id: 'depression-screening',
        title: 'Depression Screening (PHQ-9)',
        description: 'A brief questionnaire to screen for symptoms of depression',
        category: 'Mental Health',
        estimatedTime: '5 minutes',
        questions: [
          {
            id: 1,
            text: 'Little interest or pleasure in doing things',
            type: 'scale',
            scale: { min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] }
          },
          {
            id: 2,
            text: 'Feeling down, depressed, or hopeless',
            type: 'scale',
            scale: { min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] }
          },
          {
            id: 3,
            text: 'Trouble falling or staying asleep, or sleeping too much',
            type: 'scale',
            scale: { min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] }
          },
          {
            id: 4,
            text: 'Feeling tired or having little energy',
            type: 'scale',
            scale: { min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] }
          },
          {
            id: 5,
            text: 'Poor appetite or overeating',
            type: 'scale',
            scale: { min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] }
          }
        ],
        scoring: {
          ranges: [
            { min: 0, max: 4, level: 'Minimal', color: 'green', description: 'Minimal depression symptoms' },
            { min: 5, max: 9, level: 'Mild', color: 'yellow', description: 'Mild depression symptoms' },
            { min: 10, max: 14, level: 'Moderate', color: 'orange', description: 'Moderate depression symptoms' },
            { min: 15, max: 27, level: 'Severe', color: 'red', description: 'Severe depression symptoms' }
          ]
        }
      },
      {
        id: 'anxiety-screening',
        title: 'Anxiety Screening (GAD-7)',
        description: 'A screening tool for generalized anxiety disorder',
        category: 'Mental Health',
        estimatedTime: '3 minutes',
        questions: [
          {
            id: 1,
            text: 'Feeling nervous, anxious, or on edge',
            type: 'scale',
            scale: { min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] }
          },
          {
            id: 2,
            text: 'Not being able to stop or control worrying',
            type: 'scale',
            scale: { min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] }
          },
          {
            id: 3,
            text: 'Worrying too much about different things',
            type: 'scale',
            scale: { min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] }
          },
          {
            id: 4,
            text: 'Trouble relaxing',
            type: 'scale',
            scale: { min: 0, max: 3, labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] }
          }
        ],
        scoring: {
          ranges: [
            { min: 0, max: 4, level: 'Minimal', color: 'green', description: 'Minimal anxiety symptoms' },
            { min: 5, max: 9, level: 'Mild', color: 'yellow', description: 'Mild anxiety symptoms' },
            { min: 10, max: 14, level: 'Moderate', color: 'orange', description: 'Moderate anxiety symptoms' },
            { min: 15, max: 21, level: 'Severe', color: 'red', description: 'Severe anxiety symptoms' }
          ]
        }
      },
      {
        id: 'stress-assessment',
        title: 'Stress Assessment',
        description: 'Evaluate your current stress levels and coping mechanisms',
        category: 'Wellness',
        estimatedTime: '7 minutes',
        questions: [
          {
            id: 1,
            text: 'How often do you feel overwhelmed by your responsibilities?',
            type: 'scale',
            scale: { min: 1, max: 5, labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] }
          },
          {
            id: 2,
            text: 'How well do you handle unexpected changes?',
            type: 'scale',
            scale: { min: 1, max: 5, labels: ['Very poorly', 'Poorly', 'Moderately', 'Well', 'Very well'] }
          },
          {
            id: 3,
            text: 'How often do you experience physical symptoms of stress?',
            type: 'scale',
            scale: { min: 1, max: 5, labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] }
          }
        ],
        scoring: {
          ranges: [
            { min: 3, max: 7, level: 'Low', color: 'green', description: 'Low stress levels' },
            { min: 8, max: 11, level: 'Moderate', color: 'yellow', description: 'Moderate stress levels' },
            { min: 12, max: 15, level: 'High', color: 'red', description: 'High stress levels' }
          ]
        }
      }
    ];

    setSurveys(initialSurveys);

    // Load saved responses
    const savedResponses = localStorage.getItem('surveyResponses');
    if (savedResponses) {
      setResponses(JSON.parse(savedResponses));
    }
    
    // Load saved user info
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const updateUserInfo = (name, email) => {
    const updatedUser = {
      ...currentUser,
      name,
      email
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const submitSurveyResponse = (surveyId, answers) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) return;

    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    const scoreRange = survey.scoring.ranges.find(range => 
      totalScore >= range.min && totalScore <= range.max
    );

    const response = {
      id: uuidv4(),
      surveyId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      answers,
      totalScore,
      scoreRange,
      completedAt: new Date().toISOString(),
      surveyTitle: survey.title
    };

    const updatedResponses = [...responses, response];
    setResponses(updatedResponses);
    localStorage.setItem('surveyResponses', JSON.stringify(updatedResponses));

    return response;
  };

  const getUserResponses = () => {
    return responses.filter(response => response.userId === currentUser.id);
  };

  const sendResultsByEmail = async (data) => {
    try {
      // Send results to client
      await sendClientResults({
        response: data.response,
        userInfo: currentUser
      });
      
      // Add to Mailchimp if checkbox is checked
      if (data.subscribeToNewsletter) {
        await addToMailchimp(currentUser.email, currentUser.name);
      }
      
      // Notify therapist
      await notifyTherapist({
        response: data.response,
        userInfo: currentUser
      });
      
      return {
        success: true,
        message: 'Results sent successfully!'
      };
    } catch (error) {
      console.error('Error sending results:', error);
      return {
        success: false,
        message: 'Failed to send results. Please try again.'
      };
    }
  };

  const value = {
    surveys,
    responses,
    currentUser,
    updateUserInfo,
    submitSurveyResponse,
    getUserResponses,
    sendResultsByEmail
  };

  return (
    <SurveyContext.Provider value={value}>
      {children}
    </SurveyContext.Provider>
  );
};