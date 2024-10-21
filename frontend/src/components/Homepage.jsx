import { useState } from 'react';

export default function Homepage() {
  const DataVisual = () => {
    const [showInstructions, setShowInstructions] = useState(false);
    const toggleInstructions = () => {
      setShowInstructions(!showInstructions);
    };

    return (
      <div
        className={`relative h-40 bg-purple-600 p-6 rounded-lg flex flex-col justify-center items-center ${
          showInstructions ? 'filter' : ''
        }`}
      >
        <div
          className="text-white cursor-pointer text-2xl font-bold"
          onClick={toggleInstructions}
        >
          {showInstructions ? '-' : '+'}
        </div>
        {showInstructions && (
          <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-90 flex flex-col justify-center items-center p-4 rounded-lg z-10">
           {/* <button className='flex'>
           <svg class="h-5 w-5 text-slate-900"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
           </button> */}
            <p className="mb-4 text-base">Instructions for interacting with this data visual:</p>
            <ul className="list-disc text-left text-sm">
              <li>Click on the graph to explore data points.</li>
              <li>Hover over sections for more info.</li>
              <li>Use filters to customize the view.</li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  const handleConfirm = () => {
    console.log('File imported to backend.');
  };

  return (
    <section>
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center w-full">
        <h1 className="ml-4 text-2xl">Welcome, User</h1>
      </div>
      <div className="flex-grow p-6 w-full">
        <div className="flex justify-between mb-6 w-full">
          <div className="bg-purple-700 text-white rounded-lg p-6 flex-grow flex justify-center items-center mr-4 text-lg">
            About Section
          </div>
          <div className="bg-blue-500 text-white rounded-lg p-6 flex-grow flex flex-col justify-center items-center text-lg">
            <h3 className="mb-4">Input Section for Files</h3>
            <div className="file-upload">
              <input type="file" id="file-upload" className="hidden" />
              <label htmlFor="file-upload" className="bg-gray-200 text-black p-2 rounded cursor-pointer text-sm">
                Click to Upload Files
              </label>
            </div>
          </div>
        </div>
        <button className="bg-green-600 text-white p-3 rounded-lg mb-6 w-full text-lg" onClick={handleConfirm}>
          Confirm Import
        </button>
        <div className="flex justify-between mb-6 w-full">
          <div className="bg-green-600 text-white p-3 rounded-lg mb-6 w-full text-lg">
            <h3 className="text-xl">Table</h3>
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="filter" className="mr-4 text-lg">Filter: </label>
          <select id="filter" className="p-2 rounded border text-lg">
            <option value="all">All</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>
        <div className="flex justify-between mb-6 w-full">
          <div className="flex-1 mr-2">
            <DataVisual />
          </div>
          <div className="bg-orange-600 text-white rounded-lg p-6 flex-1 h-40 flex justify-center items-center text-base">
            <div>
              <h3 className="text-xl">Model Used</h3>
              <p>Details about the model and purpose of the data visualization.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between mb-6 w-full">
          <div className="bg-orange-600 text-white rounded-lg p-6 flex-1 h-40 mr-2 flex justify-center items-center text-base">
            <div>
              <h3 className="text-xl">Model Used</h3>
              <p>Details about the model and purpose of the data visualization.</p>
            </div>
          </div>
          <div className="flex-1 ml-2">
            <DataVisual />
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex-1 mr-2">
            <DataVisual />
          </div>
          <div className="bg-orange-600 text-white rounded-lg p-6 flex-1 h-40 ml-2 flex justify-center items-center text-base">
            <div>
              <h3 className="text-xl">Model Used</h3>
              <p>Details about the model and purpose of the data visualization.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
