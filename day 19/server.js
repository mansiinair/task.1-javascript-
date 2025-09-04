import express from "express";
import cors from "cors";
import { init, queries } from "./db.js";

const app = express();

// ✅ Port assigned here
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Utility: get posts with comments & likes
async function getPosts() {
  const posts = await queries.all(`
    SELECT p.*, u.name as author, u.avatar as author_avatar,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) as likeCount,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as commentCount
    FROM posts p
    JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC, p.id DESC;
  `);

  const comments = await queries.all(`
    SELECT c.*, u.name as author, u.avatar as author_avatar
    FROM comments c
    JOIN users u ON u.id = c.user_id
    ORDER BY c.created_at ASC, c.id ASC;
  `);

  const grouped = {};
  comments.forEach((c) => {
    if (!grouped[c.post_id]) grouped[c.post_id] = [];
    grouped[c.post_id].push(c);
  });

  return posts.map((p) => ({ ...p, comments: grouped[p.id] || [] }));
}

/* ---------- Routes ---------- */

// Users
app.get("/api/users", async (_req, res) => {
  const users = await queries.all(`SELECT * FROM users ORDER BY id;`);
  res.json(users);
});

// Posts
app.get("/api/posts", async (_req, res) => {
  const posts = await getPosts();
  res.json(posts);
});

app.post("/api/posts", async (req, res) => {
  const { user_id, content } = req.body || {};
  if (!user_id || !content?.trim()) {
    return res.status(400).json({ error: "user_id and content required" });
  }
  const result = await queries.run(
    `INSERT INTO posts (user_id, content) VALUES (?, ?);`,
    [user_id, content.trim()]
  );
  const post = await queries.get(`SELECT * FROM posts WHERE id = ?;`, [
    result.lastID,
  ]);
  res.status(201).json(post);
});

// Comments
app.post("/api/posts/:id/comments", async (req, res) => {
  const { user_id, content } = req.body || {};
  if (!user_id || !content?.trim()) {
    return res.status(400).json({ error: "user_id and content required" });
  }
  await queries.run(
    `INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?);`,
    [req.params.id, user_id, content.trim()]
  );
  const comments = await queries.all(
    `SELECT c.*, u.name as author, u.avatar as author_avatar
     FROM comments c JOIN users u ON u.id = c.user_id
     WHERE c.post_id = ?
     ORDER BY c.created_at ASC, c.id ASC;`,
    [req.params.id]
  );
  res.status(201).json(comments);
});

// Likes
app.post("/api/posts/:id/like", async (req, res) => {
  const { user_id } = req.body || {};
  if (!user_id) return res.status(400).json({ error: "user_id required" });

  const exists = await queries.get(
    `SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?;`,
    [user_id, req.params.id]
  );

  if (exists) {
    await queries.run(
      `DELETE FROM likes WHERE user_id = ? AND post_id = ?;`,
      [user_id, req.params.id]
    );
  } else {
    await queries.run(
      `INSERT OR IGNORE INTO likes (user_id, post_id) VALUES (?, ?);`,
      [user_id, req.params.id]
    );
  }

  const likeCount = await queries.get(
    `SELECT COUNT(*) as c FROM likes WHERE post_id = ?;`,
    [req.params.id]
  );
  res.json({ liked: !exists, likeCount: likeCount.c });
});

/* ---------- Start Server ---------- */
init().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
  });
});
app.get("/", (req, res) => {
  res.send("✅ Backend is running! Use /api/users or /api/posts");
});
// Like a post
app.post("/api/posts/:id/like", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = queries.getPostById(postId); // you may need to add this in db.js
  if (!post) return res.status(404).json({ error: "Post not found" });

  queries.incrementLike(postId);
  res.json({ success: true });
});

// Add a comment
app.post("/api/posts/:id/comments", express.json(), (req, res) => {
  const postId = parseInt(req.params.id);
  const { user, content } = req.body;

  if (!content || !user) {
    return res.status(400).json({ error: "User and content required" });
  }

  queries.addComment(postId, user, content);
  res.json({ success: true });
});
