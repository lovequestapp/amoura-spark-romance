
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StandoutCard from '@/components/profile/StandoutCard';

const standouts = [
  {
    id: 1,
    name: "Olivia",
    age: 29,
    photo: "/photo-1581091226825-a6a2a5aee158",
    prompt: {
      question: "My simple pleasures...",
      answer: "Singing in the car, finding money in old pockets, and watching the sunrise with a cup of tea."
    }
  },
  {
    id: 2,
    name: "Daniel",
    age: 31,
    photo: "/photo-1581092795360-fd1ca04f0952",
    prompt: {
      question: "We'll get along if...",
      answer: "You appreciate dad jokes, enjoy trying new cuisines, and aren't afraid to be a little weird sometimes."
    }
  },
  {
    id: 3,
    name: "Rebecca",
    age: 27,
    photo: "/photo-1649972904349-6e44c42644a7",
    prompt: {
      question: "A perfect date would be...",
      answer: "Starting with a cooking class where we make something delicious, then enjoying our creation in a park with a bottle of wine."
    }
  },
  {
    id: 4,
    name: "Michael",
    age: 32,
    photo: "/photo-1721322800607-8c38375eef04",
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
