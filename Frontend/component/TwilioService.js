import { Platform } from 'react-native';

const accountSid = 'AC8b50cc020eb3bad3a9ba194d66a00044';
const authToken = '1bdedbe18552f9949ea9ac8031dfbbe7';
const fromNumber = '+16504378067';

const baseUrl = 'https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json';

const sendSms = async (to, body) => {
  const encodedBody = encodeURIComponent(body);
  const url = baseUrl + '?To=' + to + '&From=' + fromNumber + '&Body=' + encodedBody;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (accountSid + ':' + authToken),
      },
    });

    if (response.ok) {
      console.log('Message sent successfully');
    } else {
      console.error('Failed to send message:', response.status, response.statusText);
      throw new Error('Failed to send message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export default sendSms;
