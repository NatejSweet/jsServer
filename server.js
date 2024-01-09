const express = require('express')
var mariadb = require('mariadb');
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
dotenv.config({ path: './.env'})
const app = express()
const path = require('path');
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
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    secure: false,
  }
}));


app.use(express.static('public'))
app.listen(port, () => console.log('server listening at http://localhost:'+port))

function checkLoggedIn(req, res, next) {
  if (req.session.userId) {
    res.redirect('/dash');
  } else {
    next();
  }
}

app.get('/', checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '/public/guest.html'));
});



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
      res.sendFile(path.join(__dirname, '/public/dash.html'));
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
  var items;
  let conn = await pool.getConnection();
  if (req.session.userId){
    items = await conn.query('SELECT worldName, id FROM worlds WHERE worldName LIKE ? AND public = ? AND ownerId != ?', ['%' + query + '%',1, req.session.userId]);
  }else{
    items = await conn.query('SELECT worldName, id FROM worlds WHERE worldName LIKE ? AND public = ?', ['%' + query + '%', 1]);
  }
  res.json(items);
  if (conn) conn.end();
});
  

app.post('/createWorld', async (req, res) => {
  const world = req.body;
  const name = world.name;
  var navItems = world.navItems;
  const image = world.image;
  var content = world.content;
  content = JSON.stringify(content);
  navItems = JSON.stringify(navItems);
  try {
    let conn = await pool.getConnection();
    // Insert img1src into images table and retrieve its id
    const img1Result = await conn.query('INSERT INTO images (src, ownerId) VALUES (?,?)', [image, req.session.userId]);
    const img1Id = img1Result.insertId;
    // Insert img2src into images table and retrieve its id. this is done early for simplicity
    const img2Result = await conn.query('INSERT INTO images (src, ownerId) VALUES (?,?)', ['#', req.session.userId]);
    const img2Id = img2Result.insertId;
    // Insert world data into worlds table
    const worldResult = await conn.query(
      'INSERT INTO worlds (worldName, ownerId, img1Id, img2Id, mainPage, navItems, mapMarkers, public) VALUES (?,?,?,?,?,?,?,?)',
      [name, req.session.userId, img1Id, img2Id, content, navItems, {}, 0]
    );
    const worldId = worldResult.insertId; // Get the inserted worldId
    req.session.worldId = worldId.toString(); // Store the worldId in the session
    conn.end();

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

app.get('/fillNavs', async (req, res) => {    //may want to just send navItems instead of parsing doen to navNames
  try {
    let conn = await pool.getConnection();
    const navs = await conn.query(
      'SELECT navItems, worldName FROM worlds WHERE id = ? AND ownerId = ?',
      [BigInt(req.session.worldId), req.session.userId]
    );
    if (navs.length > 0) {
      const navItems = navs[0].navItems;
      const worldName = navs[0].worldName;
      res.send({ navItems, worldName });
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
      'SELECT mainPage, worldName ,navItems ,img1Id, img2Id, pages, mapMarkers, ownerId, public FROM worlds WHERE id = ?',
      [BigInt(worldId)]
    );
    if (mainPage.length > 0) {
      const editAccess = mainPage[0].ownerId == req.session.userId;
      const mainPageJSON = mainPage[0].mainPage;
      const worldName = mainPage[0].worldName;
      const img1Id = mainPage[0].img1Id;
      const img2Id = mainPage[0].img2Id;
      const navItems = mainPage[0].navItems;
      const pages = mainPage[0].pages;
      const mapMarkers = mainPage[0].mapMarkers;
      const public = mainPage[0].public;
      res.send({ mainPageJSON, worldName, img1Id,img2Id, navItems,pages, mapMarkers, editAccess, public});
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

app.post('/updatePage', async (req, res) => {
  console.log
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
app.post('/updateMainPage', async (req,res) => {
  const mainPage = req.body;
  const mainPageJSON = JSON.stringify(mainPage);
  const worldId = req.query.id;
  try {
    let conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE worlds SET mainPage = ? WHERE id = ? AND ownerId = ?',
      [mainPageJSON, BigInt(worldId), req.session.userId]
    );
    console.log(result);
    res.end();
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
})

app.get('/navItems', async (req,res) => { 
  const worldId = req.query.id;
  try {
    let conn = await pool.getConnection();
    const navItems = await conn.query(
      'SELECT navItems,pages FROM worlds WHERE id = ?',
      [BigInt(worldId)]
    );
    if (navItems.length > 0) {
      const navItemsJSON = navItems[0].navItems;
      const pages = navItems[0].pages;
      res.send({ navItemsJSON, pages});
    } else {
      res.redirect('/');
    }
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
})
app.post('/updateNavBarItems', async (req,res) => {//could be condensed to reuse code from fillNavs
  const navItems = JSON.stringify(req.body.navItems)
  const worldId = req.query.id;
  try {
    let conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE worlds SET navItems = ? WHERE id = ? AND ownerId = ?',
      [navItems,BigInt(worldId), req.session.userId]
    );
    console.log(result);
    res.end();
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
})
app.post('/editNavBarOptions', async (req,res) => {   //this needs to update mapMarkers hubs as well
  console.log(req.body)
  const navItems = req.body.newNavItems;
  const newPages = req.body.newPages;
  const worldId = req.query.id;
  try {
    let conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE worlds SET navItems = ?, pages = ? WHERE id = ? AND ownerId = ?',
      [navItems, newPages, BigInt(worldId), req.session.userId]
    );
    console.log(result);
    res.end();
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
})

app.get('/mapMarkers', async (req,res) => {
  const worldId = req.query.id;
  try {
    let conn = await pool.getConnection();
    const mapMarkers = await conn.query(
      'SELECT mapMarkers FROM worlds WHERE id = ?',
      [BigInt(worldId), req.session.userId]
    );
    if (mapMarkers.length > 0) {
      const mapMarkersJSON = mapMarkers[0].mapMarkers;
      res.send({ mapMarkersJSON });
    } else {
      res.redirect('/');
    }
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
})

app.post('/saveMapMarkers', async (req,res) => {
  const mapMarkers = JSON.stringify(req.body.mapMarkers)
  const worldId = req.query.id;
  try {
    let conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE worlds SET mapMarkers = ? WHERE id = ? AND ownerId = ?',
      [mapMarkers, BigInt(worldId), req.session.userId]
    );
    res.end();
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }
})

app.post('/updateImage', async (req,res) => {
  const src = req.body.src;
  const imgId = req.query.imgId;
  if (imgId == 'null'){
    try {
      let conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO images (src, ownerId) VALUES (?,?)',
        [src, req.session.userId]
      );
      const newImgId = result.insertId; // Store the new image ID
      console.log(result);
      if (conn) conn.end();
      res.send({ imgId: newImgId.toString() }); // Send the new image ID to the user
    } catch (err) {
      console.log(err);
      res.status(500).send('ahhhhh');
    }
  }else{
    console.log('updating')
    try {
      let conn = await pool.getConnection();
      const result = await conn.query(
        'UPDATE images SET src=? WHERE id = ? AND ownerId = ?',
        [src, BigInt(imgId), req.session.userId]
      );
      console.log(result);
      res.end();
      if (conn) conn.end();
    } catch (err) {
      console.log(err);
      res.status(500).send('ahhhhh');
    }
    
  }

})

app.post('/TogglePublic', async (req,res) => {
  const public = req.body.public;
  const worldId = req.query.id;
  try {
    let conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE worlds SET public = ? WHERE id = ? AND ownerId = ?',
      [public, BigInt(worldId), req.session.userId]
    );
    console.log(result);
    res.end();
    if (conn) conn.end();
  } catch (err) {
    console.log(err);
    res.status(500).send('ahhhhh');
  }

})