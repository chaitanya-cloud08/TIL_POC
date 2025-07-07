import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { pocs } from '../pocs'; // Import the centralized config

// The card component no longer embeds content directly.
// It now includes a button to navigate.
const PocCard = ({ id, title, description }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-slate-200 transition-shadow hover:shadow-xl">
    <div className="p-6 flex-grow">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      <p className="mt-2 text-sm text-slate-600 h-20">{description}</p>
    </div>
    <div className="p-4 bg-slate-50 border-t border-slate-200">
      <Link
        to={`/poc/${id}`} // Dynamically create the link URL
        className="w-full text-center inline-block px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        View POC
      </Link>
    </div>
  </div>
);

export default function TILpoc() {
  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
           TIL Language Apps POCs 
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
           Here's a list of POCs I created during my internship!
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pocs.map((poc) => (
            <PocCard
              key={poc.id}
              id={poc.id}
              title={poc.title}
              description={poc.description}
            />
          ))}
        </main>
      </div>
    </div>
  );
}