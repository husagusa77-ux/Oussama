import React, { useRef, useEffect } from 'react';
import { ChatState } from '../types';
import { 
  ChevronLeft, 
  Phone, 
  Video, 
  Info, 
  Camera, 
  Mic, 
  Image as ImageIcon, 
  PlusCircle, 
  Smile,
  Battery,
  Wifi,
  Signal
} from 'lucide-react';

interface PhonePreviewProps {
  state: ChatState;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({ state }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages]);

  return (
    <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[800px] w-[375px] shadow-xl overflow-hidden ring-8 ring-gray-900/50 select-none">
      {/* Dynamic Island / Notch Area */}
      <div className="absolute top-0 inset-x-0 h-6 bg-black z-30 flex items-center justify-between px-6 pt-2">
        <span className="text-white text-xs font-semibold pl-2">{state.time}</span>
        <div className="flex items-center space-x-1.5 pr-2">
          <Signal className="w-3.5 h-3.5 text-white" />
          <Wifi className="w-3.5 h-3.5 text-white" />
          <Battery className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* App Content */}
      <div className="bg-black h-full w-full flex flex-col pt-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 pt-2 border-b border-gray-900 bg-black z-20">
          <div className="flex items-center space-x-4">
            <ChevronLeft className="w-7 h-7 text-white -ml-2 cursor-pointer" />
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={state.theirProfile.avatarUrl} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-black"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1">
                    <span className="text-white font-semibold text-sm">{state.theirProfile.username}</span>
                    {state.theirProfile.isVerified && (
                        <svg className="w-3 h-3 text-blue-500 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    )}
                </div>
                <span className="text-gray-400 text-xs">Active now</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-5 text-white">
            <Phone className="w-6 h-6" />
            <Video className="w-7 h-7" />
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-black no-scrollbar"
        >
          {/* Timestamp/Separator simulation */}
          <div className="text-center py-4">
             <span className="text-gray-500 text-xs font-medium">Today {state.time}</span>
          </div>

          {state.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex w-full ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'them' && (
                <img 
                  src={state.theirProfile.avatarUrl} 
                  className="w-7 h-7 rounded-full self-end mr-2 mb-1"
                  alt="them"
                />
              )}
              <div 
                className={`max-w-[70%] px-4 py-2.5 text-[15px] leading-snug break-words relative group ${
                  msg.sender === 'me' 
                    ? 'bg-[#3797f0] text-white rounded-[22px] rounded-br-md' 
                    : 'bg-[#262626] text-white rounded-[22px] rounded-bl-md'
                }`}
              >
                {msg.text}
                {/* Double tap heart simulation (optional visual cue if we added interactions) */}
              </div>
            </div>
          ))}
          {/* Spacer for bottom input */}
          <div className="h-2"></div>
        </div>

        {/* Footer Input */}
        <div className="px-3 pb-6 pt-2 bg-black flex items-center space-x-3">
            <div className="bg-[#262626] flex-1 rounded-full h-11 flex items-center px-4 justify-between">
                 <div className="bg-blue-500 rounded-full p-1 -ml-1">
                    <Camera className="w-4 h-4 text-white" fill="white" />
                 </div>
                 <span className="text-gray-400 text-sm ml-3 flex-1">Message...</span>
                 <div className="flex items-center space-x-3 text-white/90">
                    <Mic className="w-5 h-5" />
                    <ImageIcon className="w-5 h-5" />
                    <PlusCircle className="w-5 h-5" />
                 </div>
            </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-40"></div>
      </div>
    </div>
  );
};
