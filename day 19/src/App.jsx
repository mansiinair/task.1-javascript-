import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export default function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [connected, setConnected] = useState(false);

  const socket = useMemo(() => io("http://localhost:4000"), []);

  const loadInitial = async () => {
    const [usersRes, postsRes] = await Promise.all([
      fetch("/api/users"),
      fetch("/api/posts"),
    ]);
    const usersData = await usersRes.json();
    const postsData = await postsRes.json();
    setUsers(usersData);
    setCurrentUser(usersData[0]);
    setPosts(postsData);
  };

  useEffect(() => {
    loadInitial();

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("postUpdated", (post) => {
      setPosts((prev) => {
        const exists = prev.some((p) => p.id === post.id);
        return exists
          ? prev.map((p) => (p.id === post.id ? post : p))
          : [post, ...prev];
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("postUpdated");
      socket.close();
    };
  }, []);

  const handleLike = async (id) => {
    if (!currentUser) return;
    await fetch(`/api/posts/${id}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUser.id }),
    });
  };

  const handleAddComment = async (id, content) => {
    if (!currentUser || !content.trim()) return;
    await fetch(`/api/posts/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUser.id, content }),
    });
  };

  // 🔥 NEW function for creating posts
  const handleCreatePost = async (content) => {
    if (!currentUser || !content.trim()) return;
    await fetch(`/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUser.id, content }),
    });
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#e9ecef", minHeight: "100vh" }}>
      <div style={{ background: "#2c3e50", color: "#ecf0f1", padding: "0.8rem 1rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontWeight: 700 }}>📱 Social Media Dashboard</span>
          <span style={{ fontSize: 12, opacity: 0.8 }}>
            {connected ? "🟢 Live" : "🔴 Offline"}
          </span>
          <div style={{ marginLeft: "auto" }}>
            <label style={{ marginRight: 8 }}>Logged in as:</label>
            <select
              value={currentUser?.id || ""}
              onChange={(e) => setCurrentUser(users.find((u) => u.id == e.target.value))}
              style={{ padding: "4px 8px", borderRadius: 8 }}
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "1.5rem auto", padding: "0 1rem" }}>
        {/* 🔥 NEW Create Post Form */}
        <CreatePostForm onSubmit={handleCreatePost} />

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onAddComment={handleAddComment}
          />
        ))}
      </div>
    </div>
  );
}

// 🔥 New component
function CreatePostForm({ onSubmit }) {
  const [text, setText] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(text);
        setText("");
      }}
      style={{ background: "#fff", padding: "1rem", borderRadius: 12, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", marginBottom: 20 }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc", resize: "none" }}
      />
      <button
        type="submit"
        style={{ marginTop: 10, background: "#3498db", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}
      >
        Post
      </button>
    </form>
  );
}

// Post Card component (kept clean)
function PostCard({ post, onLike, onAddComment }) {
  const [text, setText] = useState("");
  return (
    <div
      style={{
        background: "#fff",
        padding: "1.2rem",
        margin: "1rem 0",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <img
          src={post.author_avatar}
          alt={post.author}
          width="48"
          height="48"
          style={{ borderRadius: "50%", border: "2px solid #3498db" }}
        />
        <div>
          <div style={{ fontWeight: 700 }}>{post.author}</div>
          <div style={{ fontSize: 12, color: "#888" }}>
            {new Date(post.created_at).toLocaleString()}
          </div>
        </div>
      </div>

      <p style={{ marginTop: "0.8rem", fontSize: 16, color: "#34495e" }}>{post.content}</p>

      <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
        <button
          onClick={() => onLike(post.id)}
          style={{ background: "#ff6b6b", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontWeight: 700 }}
        >
          ❤️ {post.likeCount} Likes
        </button>
        <span style={{ color: "#555", fontSize: 14 }}>💬 {post.commentCount} Comments</span>
      </div>

      <div style={{ marginTop: 12, paddingLeft: 12, borderLeft: "3px solid #eee" }}>
        {post.comments.map((c) => (
          <p key={c.id} style={{ fontSize: 14, margin: "4px 0" }}>
            <b style={{ color: "#2980b9" }}>{c.author}:</b> {c.content}
          </p>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAddComment(post.id, text);
          setText("");
        }}
        style={{ marginTop: 10, display: "flex" }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{ marginLeft: 8, padding: "8px 14px", borderRadius: 8, border: "none", background: "#3498db", color: "#fff", fontWeight: 700, cursor: "pointer" }}
        >
          Post
        </button>
      </form>
    </div>
  );
}
