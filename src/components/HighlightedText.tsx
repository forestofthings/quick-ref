import React from 'react';

interface HighlightedTextProps {
  text: string;
  searchTerm: string;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({ text, searchTerm }) => {
  if (!searchTerm || !text) return <p>{text}</p>;

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));

  return (
    <p className="leading-relaxed text-gray-800 dark:text-gray-200">
      {parts.map((part, i) => 
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark 
            key={i}
            className="bg-yellow-200 dark:bg-yellow-700 font-medium px-0.5 rounded-sm"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
};