import React, { useState } from 'react';
import { ChatState, Message, SenderType } from '../types';
import { Sparkles, Send, Trash2, Plus, Download, RefreshCcw } from 'lucide-react';
import { generateConversation } from '../services/geminiService';

interface EditorControlsProps {
  state: ChatState;
  setState: React.Dispatch<React.SetStateAction<ChatState>>;
}

export const EditorControls: React.FC<EditorControlsProps> = ({ state, setState }) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'chat' | 'ai'>('chat');
  
  // AI State
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('Funny');
  const [aiCount, setAiCount] = useState(8);
  const [isGenerating, setIsGenerating] = useState(false);

  // Manual Message State
  const [newMessageText, setNewMessageText] = useState('');
  const [newMessageSender, setNewMessageSender] = useState<SenderType>('me');

  const updateProfile = (who: 'myProfile' | 'theirProfile', field: string, value: any) => {
    setState(prev => ({
      ...prev,
      [who]: { ...prev[who], [field]: value }
    }));
  };

  const addMessage = () => {
    if (!newMessageText.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: newMessageText,
      sender: newMessageSender
    };
    setState(prev => ({ ...prev, messages: [...prev.messages, msg] }));
    setNewMessageText('');
  };

  const clearChat = () => {
    setState(prev => ({ ...prev, messages: [] }));
  };

  const handleGenerate = async () => {
    if (!aiTopic) return;
    setIsGenerating(true);
    try {
      const generatedMessages = await generateConversation(aiTopic, aiTone, aiCount);
      const formattedMessages: Message[] = generatedMessages.map((m, i) => ({
        id: `ai-${Date.now()}-${i}`,
        text: m.text || '...',
        sender: (m.sender as SenderType) || 'me',
      }));
      
      setState(prev => ({
        ...prev,
        messages: formattedMessages
      }));
      setActiveTab('chat'); // Switch back to chat to see result
    } catch (err) {
      alert("Failed to generate conversation. Check API key or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl h-[800px] flex flex-col overflow-hidden border border-gray-200">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('profiles')}
          className={`flex-1 py-4 font-medium text-sm transition-colors ${activeTab === 'profiles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Profiles
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-4 font-medium text-sm transition-colors ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Messages
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-4 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'ai' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Sparkles className="w-4 h-4" />
          AI Gen
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* PROFILES TAB */}
        {activeTab === 'profiles' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Their Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input 
                    type="text" 
                    value={state.theirProfile.username}
                    onChange={(e) => updateProfile('theirProfile', 'username', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                  <input 
                    type="text" 
                    value={state.theirProfile.avatarUrl}
                    onChange={(e) => updateProfile('theirProfile', 'avatarUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs text-gray-600 font-mono"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <input 
                        type="checkbox"
                        checked={state.theirProfile.isVerified}
                        onChange={(e) => updateProfile('theirProfile', 'isVerified', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <label className="text-sm text-gray-700">Verified Account</label>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">System Details</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input 
                    type="time" 
                    value={state.time}
                    onChange={(e) => setState(prev => ({...prev, time: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Battery %</label>
                  <input 
                    type="number" 
                    value={state.batteryLevel}
                    onChange={(e) => setState(prev => ({...prev, batteryLevel: parseInt(e.target.value)}))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'chat' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Add Message</h3>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setNewMessageSender('me')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${newMessageSender === 'me' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                        >
                            Me
                        </button>
                        <button 
                            onClick={() => setNewMessageSender('them')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${newMessageSender === 'them' ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                        >
                            Them
                        </button>
                    </div>
                    <textarea 
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                addMessage();
                            }
                        }}
                    />
                    <button 
                        onClick={addMessage}
                        disabled={!newMessageText.trim()}
                        className="w-full py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                        Add Message
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">{state.messages.length} messages</span>
                <button 
                    onClick={clearChat}
                    className="text-red-500 text-sm font-medium hover:text-red-600 flex items-center gap-1"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                </button>
            </div>
          </div>
        )}

        {/* AI GENERATOR TAB */}
        {activeTab === 'ai' && (
           <div className="space-y-6 animate-fadeIn">
             <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-gray-800">Generate Conversation</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                    Use Google Gemini to instantly create realistic chat scenarios.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic / Scenario</label>
                        <input 
                            type="text" 
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            placeholder="e.g. Breaking up, Planning a surprise party..."
                            className="w-full px-4 py-2 bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                            <select 
                                value={aiTone}
                                onChange={(e) => setAiTone(e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                                <option>Funny</option>
                                <option>Romantic</option>
                                <option>Angry</option>
                                <option>Professional</option>
                                <option>Awkward</option>
                                <option>Dramatic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                            <select 
                                value={aiCount}
                                onChange={(e) => setAiCount(Number(e.target.value))}
                                className="w-full px-4 py-2 bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                                <option value={5}>Short (5)</option>
                                <option value={10}>Medium (10)</option>
                                <option value={15}>Long (15)</option>
                                <option value={25}>Very Long (25)</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating || !aiTopic}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCcw className="w-5 h-5 animate-spin" />
                                Dreaming up drama...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Generate Chat
                            </>
                        )}
                    </button>
                </div>
             </div>

             <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-yellow-800 text-xs">
                <p className="font-semibold mb-1">💡 Tip</p>
                Be specific with your topic for better results! Try adding details like "two friends gossiping about John" or "negotiating a price for a used couch".
             </div>
           </div>
        )}

      </div>
    </div>
  );
};
