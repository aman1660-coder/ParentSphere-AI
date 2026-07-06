import { BrainCircuit, Send, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import api, { apiError } from '../services/api';

const AIAssistantPage = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi, I am Parentsphere AI. Ask about behavior, learning, routines, nutrition, emotional wellbeing, or activity ideas.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    Promise.all([api.get('/children'), api.get('/ai/history')]).then(([childrenRes, chatRes]) => {
      setChildren(childrenRes.data.children);
      const latest = chatRes.data.chats?.[0];
      if (latest?.messages?.length) setMessages(latest.messages);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    const content = input.trim();
    setMessages((items) => [...items, { role: 'user', content }]);
    setInput('');
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/ai/chat', { message: content, childId: selectedChild || undefined });
      setMessages(data.chat.messages);
    } catch (err) {
      setError(apiError(err));
      setMessages((items) => [...items, { role: 'assistant', content: 'I could not reach the assistant. Please try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'How can I reduce bedtime resistance?',
    'Suggest activities for emotional regulation.',
    'My child loses focus while studying.',
    'Give healthy lunch ideas for school.'
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="container-page py-8">
        <PageHeader
          eyebrow="AI Parenting Assistant"
          title="Practical, age-aware parenting guidance"
          description="The assistant stores chat history in MongoDB and uses OpenAI when configured, with a safe local fallback for offline demos."
        />
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="panel h-max">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-ocean/10 text-ocean"><BrainCircuit /></div>
              <div>
                <h2 className="font-bold">Assistant Context</h2>
                <p className="text-sm text-slate-500">Choose a child profile for better guidance.</p>
              </div>
            </div>
            <select className="input mt-5" value={selectedChild} onChange={(event) => setSelectedChild(event.target.value)}>
              <option value="">General parenting question</option>
              {children.map((child) => <option key={child._id} value={child._id}>{child.name} · Age {child.age}</option>)}
            </select>
            <div className="mt-5 grid gap-2">
              {quickPrompts.map((prompt) => (
                <button key={prompt} className="rounded-lg border border-slate-200 p-3 text-left text-sm font-semibold hover:border-ocean/40 dark:border-slate-800" onClick={() => setInput(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          </aside>

          <section className="panel flex h-[70vh] flex-col p-0">
            <div className="border-b border-slate-200 p-4 dark:border-slate-800">
              <h2 className="flex items-center gap-2 font-bold"><Sparkles size={18} className="text-ocean" /> Parentsphere AI Chat</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid gap-4">
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[86%] rounded-xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-ocean text-white' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'}`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                {loading && <div className="w-max rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500 dark:bg-slate-800">Thinking...</div>}
                <div ref={bottomRef} />
              </div>
            </div>
            {error && <p className="px-4 text-sm font-semibold text-red-500">{error}</p>}
            <form onSubmit={send} className="flex gap-2 border-t border-slate-200 p-4 dark:border-slate-800">
              <input className="input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a parenting question..." />
              <button className="btn-primary" disabled={loading} type="submit"><Send size={18} /> Send</button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIAssistantPage;
