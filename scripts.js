document.addEventListener('DOMContentLoaded', () => {
  const chatbot = document.getElementById('chatbot');
  const header = document.getElementById('chatbot-header');
  const messages = document.getElementById('chatbot-messages');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');

  let awaitingQuote = false;

  header.addEventListener('click', () => {
    chatbot.classList.toggle('minimized');
    if (!chatbot.classList.contains('minimized')) {
      input.focus();
    }
  });

  function addMessage(text, sender = 'bot') {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message', sender === 'user' ? 'user-msg' : 'bot-msg');
    const textEl = document.createElement('div');
    textEl.classList.add('text');
    textEl.innerHTML = text;
    messageEl.appendChild(textEl);
    messages.appendChild(messageEl);
    messages.scrollTop = messages.scrollHeight;
  }

  function parseShipmentInfo(text) {
    const originMatch = text.match(/from ([a-zA-Z\s]+)/i);
    const destinationMatch = text.match(/to ([a-zA-Z\s]+)/i);
    const weightMatch = text.match(/(\d+(?:\.\d+)?) ?(lbs|pounds|kg)?/i);
    const dimensionMatch = text.match(/(\d+)x(\d+)x(\d+)/i);

    return {
      origin: originMatch ? originMatch[1].trim() : '',
      destination: destinationMatch ? destinationMatch[1].trim() : '',
      weight: weightMatch ? weightMatch[1] : '',
      length: dimensionMatch ? dimensionMatch[1] : '',
      width: dimensionMatch ? dimensionMatch[2] : '',
      height: dimensionMatch ? dimensionMatch[3] : '',
    };
  }

  function simulateQuote(data) {
    const baseRate = 50;
    const weightFactor = data.weight ? parseFloat(data.weight) * 1.2 : 0;
    const distanceFactor = 100;
    const volumeFactor = data.length && data.width && data.height
      ? (parseFloat(data.length) * parseFloat(data.width) * parseFloat(data.height)) / 5000
      : 0;

    const price = (baseRate + weightFactor + distanceFactor + volumeFactor).toFixed(2);
    const carriers = ['Swift Logistics', 'North Star Freight', 'Express Haulers'];
    const carrier = carriers[Math.floor(Math.random() * carriers.length)];
    const transitDays = Math.floor(Math.random() * 5) + 2;

    return `
      Here's a simulated quote for you:<br/>
      <strong>Carrier:</strong> ${carrier}<br/>
      <strong>Estimated Cost:</strong> $${price}<br/>
      <strong>Transit Time:</strong> ${transitDays} days<br/>
      <em>Note: This is a simulation, not a real quote.</em>
    `;
  }

  function botResponse(inputText) {
    inputText = inputText.toLowerCase();

    if (awaitingQuote) {
      const shipment = parseShipmentInfo(inputText);

      if (!shipment.origin || !shipment.destination) {
        return 'Please tell me the origin and destination cities. For example: "Ship from Dallas to Miami, 1000 lbs, 48x40x50 inches."';
      }

      awaitingQuote = false;
      return simulateQuote(shipment);
    }

    if (inputText.includes('quote') || inputText.includes('shipping rate') || inputText.includes('cost')) {
      awaitingQuote = true;
      return 'Great! Please tell me your shipment details. You can say something like: "Ship from Dallas to Miami, 1000 lbs, 48x40x50 inches."';
    }

    if (inputText.includes('hello') || inputText.includes('hi')) {
      return 'Hello! I can help you with freight quotes and shipping info. Ask me for a quote anytime.';
    }

    if (inputText.includes('help')) {
      return 'You can ask me about getting quotes, booking shipments, tracking orders, or our integration options. Just say "quote" to start.';
    }

    if (inputText.includes('integration') || inputText.includes('api')) {
      return 'We offer WooCommerce and Shopify plugins and an API for developers. Check the Integrations page for details.';
    }

    if (inputText.includes('thank')) {
      return 'You’re welcome! Let me know if you have more questions.';
    }

    return "Sorry, I didn't understand that. You can ask me for a quote or other shipping info.";
  }

  sendBtn.addEventListener('click', () => {
    const userText = input.value.trim();
    if (!userText) return;
    addMessage(userText, 'user');
    input.value = '';
    setTimeout(() => {
      const response = botResponse(userText);
      addMessage(response, 'bot');
    }, 450);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });

  addMessage('Hi! I’m your True North AI Assistant. Ask me about freight quotes or shipping.');
});
