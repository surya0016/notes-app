
// import React from 'react'

// const Test = () => {
//   return (
//     <div className='flex justify-center items-center h-screen'>
//       <div className="relative w-64 h-64">
        
//         <div className="w-full h-full rounded-md bg-red-300 border-2 border-black">
      
//         </div>

//         <div className="absolute z-10 bg-white inset-0 rounded-md border-2 border-black transition hover:-translate-2 bg-opacity-70 flex items-center justify-center">
//           Top Div
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Test
"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Card = {
  id: number;
  title: string;
};

const initialCards: Card[] = [
  { id: 1, title: 'Card 1' },
  { id: 2, title: 'Card 2' },
  { id: 3, title: 'Card 3' },
  { id: 4, title: 'Card 4' },
  { id: 5, title: 'Card 5' },
];

export default function PinningCards() {
  const [cards] = useState<Card[]>(initialCards);
  const [pinnedIds, setPinnedIds] = useState<number[]>([]);

  const togglePin = (id: number): void => {
    setPinnedIds((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id) // unpin
        : [id, ...prev] // pin
    );
  };

  const sortedCards: Card[] = [
    ...pinnedIds.map((id) => cards.find((card) => card.id === id)!),
    ...cards.filter((card) => !pinnedIds.includes(card.id)),
  ];

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <AnimatePresence>
        {sortedCards.map((card) => (
          <motion.div
            key={card.id}
            layout // ← this enables smooth reordering
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-md p-4 rounded-xl border flex flex-col items-start"
          >
            <h2 className="font-semibold text-lg mb-2">{card.title}</h2>
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={() => togglePin(card.id)}
            >
              {pinnedIds.includes(card.id) ? 'Unpin' : 'Pin'}
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
