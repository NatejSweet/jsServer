const express = require('express')
var mariadb = require('mariadb');
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
dotenv.config({ path: './.env'})
const app = express()
const port  = 3000

var pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
  });
  module.exports = Object.freeze({
    pool: pool
  });
app.use(express.urlencoded({ extended: false }));
const session = require('express-session');

app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true
}));


app.use(express.static('public'))
app.listen(port, () => console.log('server listening at http://localhost:'+port))

app.get('/',(req,res) => {
  res.sendFile('/public/index.html')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('about to try')
  try {
    let conn = await pool.getConnection();
    console.log('attempting')
    const result = await conn.query(
      'SELECT id, username, password FROM users WHERE username = ?',[username]);
      console.log(result[0])
    if (result.length > 0 && await bcrypt.compare(password, result[0].password)) {
      console.log(result[0].id)
      // Authentication successful
      req.session.userId = result[0].id;
      res.redirect('dash.html');
    } else {
      // Authentication failed
      req.session.message = 'Invalid username or password';
      console.log('fail')
      res.redirect('/');
    }
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
})
app.get('/dash', async ( req, res ) => {
  if (req.session.userId) {
    const user = await pool.query(
      'SELECT * FROM users WHERE id = ?', [req.session.userId]);
    if (user) {
      
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
})
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


app.post('/createAccount', async (req, res) => {
  const { username, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    let conn = await pool.getConnection();
    const user = await conn.query(
      'INSERT INTO users (username,password) VALUES (?,?)',[username,passwordHash]);
    if (user) {
      try {
        let login = await conn.query('SELECT id, username, password FROM users WHERE username = ?',[username]);
        if (login.length > 0 && await bcrypt.compare(password, login[0].password)) {
          req.session.userId = login[0].id;
          res.redirect('dash.html');
        }else{
          req.session.message = 'Invalid username or password';
          console.log('fail')
          res.redirect('/');
        }
      } catch (err) {
        console.log(err);
        res.status(500).send('ahhhhh');
      }
    } else {
      res.redirect('/');
    }
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
})

app.get('/myWorlds', async (req, res) => {
  console.log(req.session.userId)
  try {
    let conn = await pool.getConnection();
    const worlds = await conn.query(
      'SELECT name, id FROM worlds WHERE ownerId = ?',[req.session.userId]);
    if (worlds) {
      res.send(worlds);
    } else {
      res.redirect('/');
    }
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
})

app.get('/search', async (req, res) => {
  const query = req.query.query;
  let conn = await pool.getConnection();
  const items = await conn.query('SELECT * FROM worlds WHERE name LIKE ?', ['%' + query + '%']);
  res.json(items);
  if (conn) conn.end();
});
  

app.post('/createWorld', async (req, res) => {
  const { worldName, mapImageSrc } = req.body;
  try {
    let conn = await pool.getConnection();
    const world = await conn.query(
      'INSERT INTO worlds (name,ownerId,mapImageSrc) VALUES (?,?,?)',[worldName,req.session.userId,mapImageSrc]);
    if (world) {
      res.redirect('fillNavs.html');
    } else {
      res.redirect('/');
    }
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
})
