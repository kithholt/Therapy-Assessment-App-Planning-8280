// This is a mock email service for demonstration
// In a production app, this would connect to a real email API

export const sendClientResults = async (data) => {
  const { response, userInfo, subscribeToNewsletter } = data;
  
  // In a real app, this would be an API call to your backend service
  console.log('Sending email to client:', userInfo.email);
  console.log('Results data:', response);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return success response
  return {
    success: true,
    message: 'Results sent successfully!'
  };
};

export const addToMailchimp = async (email, name) => {
  // In a real app, this would connect to Mailchimp API
  console.log('Adding to Mailchimp:', { email, name });
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return success response
  return {
    success: true,
    message: 'Added to mailing list successfully!'
  };
};

export const notifyTherapist = async (data) => {
  const { response, userInfo } = data;
  const therapistEmail = 'jewett@alumni.haas.org';
  
  // In a real app, this would send an email to the therapist
  console.log('Notifying therapist at:', therapistEmail);
  console.log('Client:', userInfo.name, userInfo.email);
  console.log('Assessment:', response.surveyTitle);
  console.log('Score:', response.totalScore, response.scoreRange.level);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return success response
  return {
    success: true,
    message: 'Therapist notified successfully!'
  };
};