import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE_URL });

function getErrorMessage(error) {
  return error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || error.message;
}

function parseSseChunk(buffer, onEvent) {
  const events = buffer.split('\n\n');
  const remainder = events.pop() || '';

  for (const event of events) {
    const line = event
      .split('\n')
      .find((item) => item.startsWith('data:'));
    if (!line) continue;

    try {
      const payload = JSON.parse(line.slice(5).trim());
      onEvent(payload);
    } catch {
      // ignore malformed chunks
    }
  }

  return remainder;
}

function AuthForm({ mode, onModeChange, onSubmit, loading, error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold text-slate-100">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
        {mode === 'signup' && (
          <input
            name="name"
            required
            placeholder="Name"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-emerald-500"
          />
        )}
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-emerald-500"
        />
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Password"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-emerald-500"
        />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign up'}
        </button>
        <button
          type="button"
          onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
          className="w-full text-sm text-slate-300 underline-offset-2 hover:underline"
        >
          {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
        </button>
      </form>
    </div>
  );
}

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState('');
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState('');
  const [editingValue, setEditingValue] = useState('');
  const [chatError, setChatError] = useState('');

  const authHeaders = useMemo(() => ({ Authorization: 'Bearer ' + token }), [token]);

  async function fetchConversations() {
    if (!token) return;
    setLoadingConversations(true);
    try {
      const { data } = await api.get('/conversations', { headers: authHeaders });
      setConversations(data);
      if (!activeConversationId && data.length) {
        setActiveConversationId(data[0]._id);
      }
    } catch (error) {
      setChatError(getErrorMessage(error));
    } finally {
      setLoadingConversations(false);
    }
  }

  async function fetchConversation(conversationId) {
    if (!conversationId || !token) return;
    setLoadingMessages(true);
    try {
      const { data } = await api.get(`/conversations/${conversationId}`, { headers: authHeaders });
      setMessages(data.messages || []);
    } catch (error) {
      setChatError(getErrorMessage(error));
    } finally {
      setLoadingMessages(false);
    }
  }

  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    fetchConversation(activeConversationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId]);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    setAuthLoading(true);
    setAuthError('');

    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/signup';
      const { data } = await api.post(endpoint, payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setActiveConversationId('');
      setMessages([]);
      setChatError('');
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setConversations([]);
    setMessages([]);
    setActiveConversationId('');
  }

  async function createConversation() {
    setChatError('');
    const { data } = await api.post('/conversations', {}, { headers: authHeaders });
    setConversations((prev) => [data, ...prev]);
    setActiveConversationId(data._id);
    setMessages([]);
    return data._id;
  }

  async function sendMessage(event) {
    event.preventDefault();
    if (!prompt.trim() || sending) return;

    setSending(true);
    setChatError('');

    let conversationId = activeConversationId;

    try {
      if (!conversationId) {
        conversationId = await createConversation();
      }

      const userMessage = { _id: `temp-user-${Date.now()}`, role: 'user', content: prompt.trim() };
      const assistantTemp = { _id: `temp-assistant-${Date.now()}`, role: 'assistant', content: '' };
      setMessages((prev) => [...prev, userMessage, assistantTemp]);
      setPrompt('');

      const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ content: userMessage.content }),
      });

      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to stream response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (!value) continue;

        buffer += decoder.decode(value, { stream: true });
        buffer = parseSseChunk(buffer, (payload) => {
          if (payload.type === 'token') {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.role === 'assistant') {
                last.content += payload.content;
              }
              return next;
            });
          }

          if (payload.type === 'done') {
            setMessages((prev) => {
              const withoutDraft = prev.filter((item) => !String(item._id).startsWith('temp-'));
              return [...withoutDraft, payload.message];
            });
            fetchConversation(conversationId);
            fetchConversations();
          }

          if (payload.type === 'error') {
            throw new Error(payload.error || 'Streaming failed');
          }
        });
      }
    } catch (error) {
      setChatError(getErrorMessage(error));
      fetchConversation(conversationId);
    } finally {
      setSending(false);
    }
  }

  async function deleteConversation(id) {
    try {
      await api.delete(`/conversations/${id}`, { headers: authHeaders });
      setConversations((prev) => prev.filter((conversation) => conversation._id !== id));
      if (activeConversationId === id) {
        setActiveConversationId('');
        setMessages([]);
      }
    } catch (error) {
      setChatError(getErrorMessage(error));
    }
  }

  async function saveEdit(messageId) {
    try {
      const { data } = await api.put(
        `/conversations/${activeConversationId}/messages/${messageId}`,
        { content: editingValue },
        { headers: authHeaders },
      );
      setMessages((prev) => prev.map((item) => (item._id === messageId ? { ...item, content: data.content } : item)));
      setEditingMessageId('');
      setEditingValue('');
    } catch (error) {
      setChatError(getErrorMessage(error));
    }
  }

  async function deleteMessage(messageId) {
    try {
      await api.delete(`/conversations/${activeConversationId}/messages/${messageId}`, { headers: authHeaders });
      setMessages((prev) => prev.filter((item) => item._id !== messageId));
    } catch (error) {
      setChatError(getErrorMessage(error));
    }
  }

  async function copyText(content) {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      setChatError('Copy failed');
    }
  }

  if (!token) {
    return (
      <AuthForm
        mode={authMode}
        onModeChange={setAuthMode}
        onSubmit={handleAuthSubmit}
        loading={authLoading}
        error={authError}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <aside
        className={`absolute z-20 h-full w-72 border-r border-slate-800 bg-slate-900 p-4 transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <button onClick={createConversation} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm hover:bg-emerald-500">
            + New chat
          </button>
          <button onClick={handleLogout} className="text-xs text-slate-300 hover:text-white">
            Logout
          </button>
        </div>
        <p className="mb-2 text-xs text-slate-400">{user?.email}</p>
        <div className="space-y-2 overflow-y-auto">
          {loadingConversations && <p className="text-sm text-slate-400">Loading...</p>}
          {conversations.map((conversation) => (
            <div key={conversation._id} className="group flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveConversationId(conversation._id);
                  setSidebarOpen(false);
                }}
                className={`flex-1 truncate rounded-lg px-3 py-2 text-left text-sm ${
                  activeConversationId === conversation._id ? 'bg-slate-700' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                {conversation.title || 'New chat'}
              </button>
              <button onClick={() => deleteConversation(conversation._id)} className="text-xs text-rose-300 opacity-80 hover:opacity-100">
                Del
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="relative flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 p-3">
          <button className="rounded border border-slate-700 px-2 py-1 text-sm md:hidden" onClick={() => setSidebarOpen((prev) => !prev)}>
            Menu
          </button>
          <h2 className="text-sm font-medium text-slate-300">ChatGPT Clone</h2>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {loadingMessages && <p className="text-sm text-slate-400">Loading messages...</p>}
          {!messages.length && !loadingMessages && <p className="text-slate-500">Start a conversation.</p>}
          {messages.map((message) => (
            <div key={message._id} className={`rounded-xl border p-3 ${message.role === 'user' ? 'ml-auto max-w-xl border-emerald-500/40 bg-emerald-600/10' : 'max-w-3xl border-slate-700 bg-slate-900'}`}>
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">{message.role}</p>
              {editingMessageId === message._id ? (
                <div className="space-y-2">
                  <textarea
                    value={editingValue}
                    onChange={(event) => setEditingValue(event.target.value)}
                    className="min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-sm"
                  />
                  <div className="flex gap-2 text-xs">
                    <button onClick={() => saveEdit(message._id)} className="rounded bg-emerald-600 px-2 py-1">Save</button>
                    <button
                      onClick={() => {
                        setEditingMessageId('');
                        setEditingValue('');
                      }}
                      className="rounded border border-slate-700 px-2 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm text-slate-100">{message.content}</p>
              )}
              <div className="mt-3 flex gap-2 text-xs text-slate-300">
                <button onClick={() => copyText(message.content)} className="hover:text-white">
                  Copy
                </button>
                <button
                  onClick={() => {
                    setEditingMessageId(message._id);
                    setEditingValue(message.content);
                  }}
                  className="hover:text-white"
                >
                  Edit
                </button>
                <button onClick={() => deleteMessage(message._id)} className="text-rose-300 hover:text-rose-200">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {sending && (
            <div className="w-fit rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
              AI is typing...
            </div>
          )}
          {chatError && <p className="text-sm text-rose-400">{chatError}</p>}
        </div>

        <form onSubmit={sendMessage} className="border-t border-slate-800 p-3">
          <div className="flex gap-2">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Type your message"
              className="min-h-12 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm outline-none focus:border-emerald-500"
            />
            <button disabled={sending || !prompt.trim()} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-60">
              Send
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;
