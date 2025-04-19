import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function PaymentForm() {
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const { token, error } = await stripe.createToken(cardElement);

      if (error) {
        setMessage(`Błąd: ${error.message}`);
        setIsProcessing(false);
      } else {
        // Wyślij token do backendu w celu przeprowadzenia płatności
        const response = await fetch('http://localhost:3000/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token.id }),
        });

        const data = await response.json();

        if (data.success) {
          setMessage('Płatność zakończona sukcesem!');
        } else {
          setMessage('Błąd płatności. Spróbuj ponownie.');
        }

        setIsProcessing(false);
      }
    } catch (error) {
      setMessage('Wystąpił błąd. Spróbuj ponownie.');
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h2>Formularz Płatności</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Numer Karty</label>
          <CardElement />
        </div>
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Przetwarzanie...' : 'Złóż Płatność'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PaymentForm;
