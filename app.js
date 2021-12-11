
const express = require("express");
const pool = require("./database");
const cors = require("cors");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.get("/", async (req, res) => {
  try {
    const posts = await pool.query("SELECT * FROM posts");
    res.render("posts", { posts: posts.rows });
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/singlepost/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    res.render("singlepost", { post: posts.rows[0] });
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/create", async (req, res) => {
  res.render("addnewpost");
});


app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    res.json(posts.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/posts/", async (req, res) => {
  try {
    const post_text = req.body.post_text;
    const date = new Date(Date.now());
    const post_picture = req.body.post_picture;
    const newpost = await pool.query(
      "INSERT INTO posts(post_text,post_picture,date,likes) values ($1, $2, $3, 0) RETURNING*",
      [post_text, post_picture, date]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/likes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const likes = req.body.likes;
    const updatepost = await pool.query(
      "UPDATE posts SET likes = $2 WHERE id = $1",
      [id,likes]
    );
  } catch (err) {
    console.error(err.message);
  }
});


app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("delete a post request has arrived");
    const deletepost = await pool.query("DELETE FROM posts WHERE id = $1", [
      id,
    ]);
  } catch (err) {
    console.error(err.message);
  }
});


app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(3000, () => {
  console.log("Server is listening to port 3000");
});
