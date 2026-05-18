import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Search, Paperclip, Send } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeUser, setActiveUser] = useState(userId || null);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    api.get('/messages/conversations').then(({ data }) => {
      setConversations(data.conversations);
      setFiltered(data.conversations);
    });
    if (user) {
      socketRef.current = io('/', { path: '/socket.io' });
      socketRef.current.emit('join', user._id);
      socketRef.current.on('new_message', (msg) => {
        if (msg.senderId === activeUser || msg.receiverId === activeUser) setMessages((prev) => [...prev, msg]);
      });
    }
    return () => socketRef.current?.disconnect();
  }, [user, activeUser]);

  useEffect(() => {
    if (userId) setActiveUser(userId);
  }, [userId]);

  useEffect(() => {
    setFiltered(conversations.filter((c) => c.user.name?.toLowerCase().includes(search.toLowerCase())));
  }, [search, conversations]);

  useEffect(() => {
    if (activeUser) api.get(`/messages/${activeUser}`).then(({ data }) => setMessages(data.messages));
  }, [activeUser]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;
    setTyping(true);
    const fd = new FormData();
    if (text) fd.append('content', text);
    if (file) fd.append('file', file);
    const { data } = await api.post(`/messages/${activeUser}`, fd);
    setMessages((prev) => [...prev, data.message]);
    socketRef.current?.emit('send_message', { receiverId: activeUser, ...data.message });
    setText('');
    setFile(null);
    setTimeout(() => setTyping(false), 800);
  };

  const activeConv = conversations.find((c) => c.user._id === activeUser);

  return (
    <DashboardLayout title="Messages" description="Secure in-app messaging">
      <Card className="flex h-[calc(100vh-200px)] min-h-[480px] overflow-hidden !p-0">
        <aside className="w-full sm:w-80 border-r border-slate-200 dark:border-zinc-800 flex flex-col">
          <div className="p-3 border-b border-slate-100 dark:border-zinc-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations" className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <li key={c.user._id}>
                <button type="button" onClick={() => setActiveUser(c.user._id)} className={cn('w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-zinc-800/50', activeUser === c.user._id && 'bg-slate-100 dark:bg-zinc-800')}>
                  <Avatar src={c.user.profilePhoto} name={c.user.name} size="sm" />
                  <section className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{c.lastMessage?.content || 'No messages'}</p>
                  </section>
                  {c.unread > 0 && <span className="text-xs bg-brand-600 text-white min-w-[18px] h-[18px] flex items-center justify-center rounded-full">{c.unread}</span>}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="flex-1 hidden sm:flex flex-col">
          {activeUser ? (
            <>
              <header className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-3">
                <Avatar src={activeConv?.user.profilePhoto} name={activeConv?.user.name} size="sm" />
                <p className="font-medium text-sm">{activeConv?.user.name}</p>
              </header>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => {
                  const mine = m.sender._id === user._id;
                  return (
                    <div key={m._id} className={cn('flex', mine && 'justify-end')}>
                      <div className={cn('max-w-[75%] px-4 py-2.5 rounded-2xl text-sm', mine ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-br-md' : 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-bl-md')}>
                        {m.attachmentUrl && m.messageType !== 'text' ? <a href={m.attachmentUrl} className="underline">View attachment</a> : m.content}
                      </div>
                    </div>
                  );
                })}
                {typing && <p className="text-xs text-slate-400 animate-pulse">Sending...</p>}
                <span ref={bottomRef} />
              </div>
              <form onSubmit={sendMessage} className="p-3 border-t border-slate-100 dark:border-zinc-800 flex gap-2 items-center">
                <label className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer">
                  <Paperclip className="w-4 h-4 text-slate-500" />
                  <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                </label>
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" className="flex-1 text-sm bg-transparent focus:outline-none" />
                <Button type="submit" size="sm" icon={Send}>Send</Button>
              </form>
            </>
          ) : (
            <EmptyState title="Select a conversation" message="Choose a member from the list to start messaging" />
          )}
        </section>
      </Card>
    </DashboardLayout>
  );
}
