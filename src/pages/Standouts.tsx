
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StandoutCard from '@/components/profile/StandoutCard';

const standouts = [
  {
    id: 1,
    name: "Olivia",
    age: 29,
    photo: "/assets/standout-1.jpg",
    prompt: {
      question: "My simple pleasures...",
      answer: "Singing in the car, finding money in old pockets, and watching the sunrise with a cup of tea."
    }
  },
  {
    id: 2,
    name: "Daniel",
    age: 31,
    photo: "/assets/standout-2.jpg",
    prompt: {
      question: "We'll get along if...",
      answer: "You appreciate dad jokes, enjoy trying new cuisines, and aren't afraid to be a little weird sometimes."
    }
  },
  {
    id: 3,
    name: "Rebecca",
    age: 27,
    photo: "/assets/standout-3.jpg",
    prompt: {
      question: "A perfect date would be...",
      answer: "Starting with a cooking class where we make something delicious, then enjoying our creation in a park with a bottle of wine."
    }
  },
  {
    id: 4,
    name: "Michael",
    age: 32,
    photo: "/assets/standout-4.jpg",
    prompt: {
      question: "I'm looking for...",
      answer: "Someone who values deep conversations, loves to travel, and can teach me something new. Bonus points if you have a cute dog."
    }
  }
];

const Standouts = () => {
  return (
    <AppLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">Today's Standouts</h1>
        <p className="text-gray-500 mb-6">Profiles that caught our attention</p>
        
        <div className="grid grid-cols-1 gap-6">
          {standouts.map((profile) => (
            <StandoutCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Standouts;
