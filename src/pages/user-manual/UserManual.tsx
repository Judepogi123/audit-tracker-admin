import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';

const UserManual = () => {
  const [text, setText] = useState<string>('Hello');
  const [isTyping, setIsTyping] = useState<boolean>(false); // New state for typing indicator
  const [value] = useDebounce(text, 500);
  let typingTimeout: ReturnType<typeof setTimeout> | null = null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setIsTyping(true); // Set typing indicator to true when user starts typing
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    typingTimeout = setTimeout(() => {
      setIsTyping(false); // Set typing indicator to false after a delay
    }, 1000); // Adjust the timeout duration as needed
  };

  return (
    <div>
      <input
        defaultValue={'Hello'}
        onChange={handleInputChange}
      />
      <p>Actual value: {text}</p>
      <p>Debounce value: {value}</p>
      <p>Is Typing: {isTyping ? "Yes" : "No"}</p>
    </div>
  );
}

export default UserManual;
