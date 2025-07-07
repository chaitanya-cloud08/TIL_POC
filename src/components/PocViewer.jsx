import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { pocs } from '../pocs'; // Import the same config

// This is the page that displays the selected POC
export default function PocViewer() {
  const { pocId } = useParams(); // Get the 'pocId' from the URL, e.g., "newspoint-readmode"
  const poc = pocs.find((p) => p.id === pocId); // Find the matching POC in our config

  // Handle case where no POC is found for the given ID
  if (!poc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
        <h1 className="text-4xl font-bold text-red-600">POC Not Found</h1>
        <p className="mt-4 text-slate-600">Sorry, we couldn't find a proof of concept with that ID.</p>
        <Link to="/" className="mt-8 px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  // Helper to render the correct type of POC
  const renderPocContent = () => {
    if (poc.type === 'react') {
      const PocComponent = poc.source;
      return <PocComponent />;
    }
    if (poc.type === 'iframe') {
      return (
        <iframe
          src={poc.source}
          title={poc.title}
          className="w-full h-full border-0 rounded-lg"
          style={{ height: '896px' }} // Give a fixed height for the mobile view
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
       <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* <div>
            <h1 className="text-2xl font-bold text-slate-800">{poc.title}</h1>
            <p className="text-sm text-slate-500">{poc.description}</p>
          </div> */}
          {/* <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
            ← Back to Dashboard
          </Link> */}
        </div>
      </header>

      <main>
        <div>
          {renderPocContent()}
        </div>
      </main>
    </div>
  );
}