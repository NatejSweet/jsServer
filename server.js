const express = require('express')
var mariadb = require('mariadb');
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
dotenv.config({ path: './.env'})
const app = express()
const port  = 3000
app.use(express.json());

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
  try {
    let conn = await pool.getConnection();
    const result = await conn.query(
      'SELECT id, username, password FROM users WHERE username = ?',[username]);
    if (result.length > 0 && await bcrypt.compare(password, result[0].password)) {
      // Authentication successful
      req.session.userId = result[0].id;
      res.redirect('dash.html');
    } else {
      // Authentication failed
      req.session.message = 'Invalid username or password';
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
  try {
    let conn = await pool.getConnection();
    const worlds = await conn.query(
      'SELECT worldName, id FROM worlds WHERE ownerId = ?',[req.session.userId]);
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
  const items = await conn.query('SELECT * FROM worlds WHERE worldName LIKE ?', ['%' + query + '%']);
  res.json(items);
  if (conn) conn.end();
});
  

app.post('/createWorld', async (req, res) => {
  const world = req.body;
  const name = world.name;
  var navItems = world.navItems;
  const images = world.images;
  var content = world.content;
  content = JSON.stringify(content);
  navItems = JSON.stringify(navItems);
  try {
    let conn = await pool.getConnection();
    // Insert img1src into images table and retrieve its id
    const img1Result = await conn.query('INSERT INTO images (src) VALUES (?)', [images[0]]);
    const img1Id = img1Result.insertId;
    // Insert img2src into images table and retrieve its id
    const img2Result = await conn.query('INSERT INTO images (src) VALUES (?)', [images[1]]);
    const img2Id = img2Result.insertId;
    // Insert world data into worlds table
    const worldResult = await conn.query(
      'INSERT INTO worlds (worldName, ownerId, img1Id, img2Id, mainPage, navNames) VALUES (?,?,?,?,?,?)',
      [name, req.session.userId, img1Id, img2Id, content, navItems]
    );
    const worldId = worldResult.insertId; // Get the inserted worldId
    req.session.worldId = worldId.toString(); // Store the worldId in the session

    await new Promise((resolve, reject) => {
      req.session.save(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // End the response without sending any data
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
});

app.get('/fillNavs', async (req, res) => {
  try {
    let conn = await pool.getConnection();
    const navs = await conn.query(
      'SELECT navNames, worldName FROM worlds WHERE id = ? AND ownerId = ?',
      [BigInt(req.session.worldId), req.session.userId]
    );
    if (navs.length > 0) {
      const navNames = navs[0].navNames;
      const worldName = navs[0].worldName;
      res.send({ navNames, worldName });
    } else {
      res.redirect('/');
    }
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
});
app.post('/fillNavs', async (req, res) => {
  const navContents = req.body;
  try {
    let conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE worlds SET navItems = ? WHERE id = ? AND ownerId = ?',
      [JSON.stringify(navContents), BigInt(req.session.worldId), req.session.userId]
    );
    console.log(result);
    res.end();
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
  console.log(navContents);
  let pages = {};
  Object.values(navContents).forEach(nav => {
      nav.forEach(navItem => {
        pages[navItem] = {content:[],imgId:null};
    });
  })
  try{
    let conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE worlds SET pages=? WHERE id = ? AND ownerId = ?',
      [pages,BigInt(req.session.worldId), req.session.userId]
    );
    console.log(result)
  } catch(err){
    console.log(err);
    res.status(500).send('ahhhhh');
  }
});
app.get ('/viewMainPage', async (req, res) => {
  try {
    const worldId = req.query.id;
    let conn = await pool.getConnection();
    const mainPage = await conn.query(
      'SELECT mainPage, worldName, navNames,navItems ,img1Id, img2Id, pages FROM worlds WHERE id = ? AND ownerId = ?',
      [BigInt(worldId), req.session.userId]
    );
    if (mainPage.length > 0) {
      const mainPageJSON = mainPage[0].mainPage;
      const worldName = mainPage[0].worldName;
      const navNames = mainPage[0].navNames;
      const img1Id = mainPage[0].img1Id;
      const img2Id = mainPage[0].img2Id;
      const navItems = mainPage[0].navItems;
      const pages = mainPage[0].pages;
      res.send({ mainPageJSON, worldName, navNames, img1Id,img2Id, navItems,pages});
    } else {
      res.redirect('/');
    }
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
})
app.get('/viewImage', async(req,res) => {
  try{
    const imageId = req.query.imgId;
    let conn = await pool.getConnection();
    const image = await conn.query(
      'SELECT src FROM images WHERE id = ?',
      [BigInt(imageId)]
    );
    if (image.length > 0) {
      const src = image[0].src;
      res.send({ src });
    } else {
      res.redirect('/');
    }
    if (conn) conn.end();
  }catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
})

function createBaselinePagesJSON(navContents) {
  console.log(navContents)
  
  return pages
}

app.post('/updatePage', async (req, res) => {
  const page = req.body;
  const pageJSON = JSON.stringify(page);
  const worldId = req.query.id; // Extract worldId from the query string
  try {
    let conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE worlds SET pages = ? WHERE id = ? AND ownerId = ?',
      [pageJSON, BigInt(worldId), req.session.userId]
    );
    console.log(result);
    res.end();
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
})