
// Simple function to generate responses
export const generateResponse = (message: string): string => {
  const lowercaseMessage = message.toLowerCase();

  if (lowercaseMessage.includes('hi') || lowercaseMessage.includes('hello')) {
    return 'Hello! Who would you like to talk with - Yashwanth, Sanjana or Moditha?';
  } else if (lowercaseMessage.includes('yashwanth') || lowercaseMessage.includes('sanjana') || lowercaseMessage.includes('moditha')) {
    return 'Welcome to SkyHub! How can I help you?';
  } else if (lowercaseMessage.includes('flight') && lowercaseMessage.includes('status')) {
    return 'You can check flight status on the Schedule page. Would you like me to navigate you there?';
  } else if (lowercaseMessage.includes('check-in')) {
    return 'Our check-in process is simple! You can use the Check-In page from the main menu. Would you like to know more?';
  } else if (lowercaseMessage.includes('weather')) {
    return 'I can see the current weather in Saint Louis is displayed on our dashboard. For more specific weather information, please provide a location.';
  } else if (lowercaseMessage.includes('baggage') || lowercaseMessage.includes('luggage')) {
    return 'For domestic flights, you are allowed one carry-on and one personal item. Checked baggage fees vary by airline.';
  } else {
    return 'Thank you for your message. I\'m still learning how to respond to various queries. Can you be more specific about your airport or flight-related question?';
  }
};
