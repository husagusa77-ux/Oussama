import React, { useState } from 'react';
import { PhonePreview } from './components/PhonePreview';
import { EditorControls } from './components/EditorControls';
import { ChatState } from './types';
import { MessageCircle, Github } from 'lucide-react';

const INITIAL_STATE: ChatState = {
  myProfile: {
    username: 'me_myself_i',
    avatarUrl: 'https://picsum.photos/id/64/200/200',
    isVerified: false
  },
  theirProfile: {
    username: 'jessica.w',
    avatarUrl: 'https://picsum.photos/id/65/200/200',
    isVerified: true
  },
  messages: [
    { id: '1', sender: 'them', text: 'Hey! Are we still on for tonight?' },
    { id: '2', sender: 'me', text: 'Yeah absolutely! 8pm right?' },
    { id: '3', sender: 'them', text: 'Perfect. See you there! ✨' },
  ],
  batteryLevel: 92,
  time: '9:41'
};

const App: React.FC = () => {
  const [state, setState] = useState<ChatState>(INITIAL_STATE);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* Navigation / Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-purple-600 to-pink-600 p-2 rounded-lg">
                <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">InstaGen AI</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-sm text-gray-500 hidden sm:block">Built with Gemini API</span>
             <a href="#" className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <Github className="w-5 h-5" />
             </a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Editor Controls */}
          <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1">
             <div className="sticky top-24">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Editor</h2>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Beta</span>
                </div>
                <EditorControls state={state} setState={setState} />
             </div>
          </div>

          {/* Right Column: Phone Preview */}
          <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2 flex flex-col items-center">
             <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Preview</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    The conversation updates in real-time. Use the controls on the left to edit or generate new chats with AI.
                </p>
             </div>
             
             {/* Scale wrapper for smaller screens if needed */}
             <div className="transform scale-[0.85] sm:scale-100 origin-top transition-transform duration-300">
                <PhonePreview state={state} />
             </div>

             <div className="mt-8 text-center text-sm text-gray-400">
                Take a screenshot to save your creation
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
