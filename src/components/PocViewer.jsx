import { useParams, Link } from 'react-router-dom';
import { pocs } from '../pocs'; 

export default function PocViewer() {
  const { pocId } = useParams(); 
  const poc = pocs.find((p) => p.id === pocId); 

  
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
          style={{ height: '896px' }} 
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