const express = require("express");
const { PrismaClient } = require("@prisma/client");
var mariadb = require("mariadb");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
dotenv.config({ path: "./.env" });
const app = express();
const path = require("path");
const port = 3000;
app.use(express.json());
const prisma = new PrismaClient();

var pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
module.exports = Object.freeze({
  pool: pool,
});
app.use(express.urlencoded({ extended: false }));
const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      secure: false,
    },
  })
);

app.use(express.static("public"));
app.listen(port, () =>
  console.log("server listening at http://localhost:" + port)
);

function checkLoggedIn(req, res, next) {
  if (req.session.userId) {
    res.redirect("/dash");
  } else {
    next();
  }
}

app.get("/", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "/public/guest.html"));
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const users = await prisma.users.findMany({
      where: {
        username: username,
      },
    });
    users.forEach(async (user) => {
      if (user && (await bcrypt.compare(password, user.password))) {
        // Authentication successful
        req.session.userId = user.id;
        res.redirect("dash.html");
      } else {
        req.session.message = "Invalid username or password";
        res.redirect("/");
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});
app.get("/dash", async (req, res) => {
  if (req.session.userId) {
    const user = await prisma.users.findUnique({
      where: {
        id: req.session.userId,
      },
    });
    if (user) {
      res.sendFile(path.join(__dirname, "/public/dash.html"));
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.post("/createAccount", async (req, res) => {
  const { username, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        username: username,
        password: passwordHash,
      },
    });
    if (user) {
      try {
        const login = prisma.users.findUnique({
          where: {
            username: username,
          },
        });
        if (
          login.length > 0 &&
          (await bcrypt.compare(password, login[0].password))
        ) {
          req.session.userId = login[0].id;
          res.redirect("dash.html");
        } else {
          req.session.message = "Invalid username or password";
          res.redirect("/");
        }
      } catch (err) {
        console.log(err);
        res.status(500).send("ahhhhh");
      }
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});

app.get("/myWorlds", async (req, res) => {
  try {
    const worlds = await prisma.worlds.findMany({
      where: {
        ownerId: req.session.userId,
      },
    });
    if (worlds) {
      res.send(worlds);
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});

app.get("/search", async (req, res) => {
  const query = req.query.query;
  if (req.session.userId) {
    const items = await prisma.worlds.findMany({
      where: {
        worldName: {
          search: query,
        },
        public: true,
        ownerId: {
          not: req.session.userId,
        },
      },
    });
    console.log(items);
    res.json(items);
  } else {
    const items = await prisma.worlds.findMany({
      where: {
        worldName: {
          contains: query,
        },
        public: true,
      },
    });
    console.log(items);
    res.json(items);
  }
});

app.post("/createWorld", async (req, res) => {
  const world = req.body;
  const name = world.name;
  var navItems = world.navItems;
  const image = world.image;
  var content = world.content;
  content = JSON.stringify(content);
  navItems = JSON.stringify(navItems);
  try {
    let img1Result = await prisma.images.create({
      data: {
        src: image,
        ownerId: req.session.userId,
      },
    });
    const img1Id = img1Result.id;
    const img2Result = await prisma.images.create({
      data: {
        src: "#",
        ownerId: req.session.userId,
      },
    });
    const img2Id = img2Result.id;
    const worldResult = await prisma.worlds.create({
      data: {
        worldName: name,
        ownerId: req.session.userId,
        img1Id: img1Id,
        img2Id: img2Id,
        mainPage: content,
        navItems: navItems,
        mapMarkers: "{}",
        public: false,
      },
    });
    const worldId = worldResult.id;
    req.session.worldId = worldId.toString(); // Store the worldId in the session

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});

app.get("/fillNavs", async (req, res) => {
  //may want to just send navItems instead of parsing doen to navNames
  try {
    const navs = await prisma.worlds.findUnique({
      where: {
        id: parseInt(req.session.worldId),
        ownerId: req.session.userId,
      },
      select: {
        navItems: true,
        worldName: true,
      },
    });
    if (navs) {
      const navItems = navs.navItems;
      const worldName = navs.worldName;
      res.send({ navItems, worldName });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});

app.post("/fillNavs", async (req, res) => {
  let navContents = req.body;
  let pages = {};
  Object.values(navContents).forEach((nav) => {
    nav.forEach((navItem) => {
      pages[navItem] = { content: [], imgId: null };
    });
  });
  pages = JSON.stringify(pages);
  navContents = JSON.stringify(navContents);
  try {
    const result = await prisma.worlds.update({
      where: {
        id: parseInt(req.session.worldId),
        ownerId: req.session.userId,
      },
      data: {
        pages: pages,
        navItems: navContents,
      },
    });
    console.log(result);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});

app.get("/viewMainPage", async (req, res) => {
  try {
    const worldId = req.query.id;
    console.log(worldId);
    const mainPage = await prisma.worlds.findUnique({
      where: {
        id: parseInt(worldId),
      },
      select: {
        mainPage: true,
        worldName: true,
        img1Id: true,
        img2Id: true,
        navItems: true,
        pages: true,
        mapMarkers: true,
        ownerId: true,
        public: true,
      },
    });
    if (mainPage != null) {
      const editAccess = mainPage.ownerId == req.session.userId;
      const mainPageJSON = mainPage.mainPage;
      const worldName = mainPage.worldName;
      const img1Id = mainPage.img1Id;
      const img2Id = mainPage.img2Id;
      const navItems = mainPage.navItems;
      const pages = mainPage.pages;
      const mapMarkers = mainPage.mapMarkers;
      const public = mainPage.public;
      res.send({
        mainPageJSON,
        worldName,
        img1Id,
        img2Id,
        navItems,
        pages,
        mapMarkers,
        editAccess,
        public,
      });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});
app.get("/viewImage", async (req, res) => {
  try {
    const imageId = req.query.imgId;
    const image = await prisma.images.findUnique({
      where: {
        id: parseInt(imageId),
      },
      select: {
        src: true,
      },
    });
    if (image) {
      const src = image.src;
      res.send({ src });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});

app.post("/updatePage", async (req, res) => {
  console.log;
  const page = req.body;
  const pageJSON = JSON.stringify(page);
  const worldId = req.query.id; // Extract worldId from the query string
  try {
    const result = await prisma.worlds.update({
      where: {
        id: parseInt(worldId),
        ownerId: req.session.userId,
      },
      data: {
        pages: pageJSON,
      },
    });
    console.log(result);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});
app.post("/updateMainPage", async (req, res) => {
  const mainPage = req.body;
  const mainPageJSON = JSON.stringify(mainPage);
  const worldId = req.query.id;
  try {
    const result = await prisma.worlds.update({
      where: {
        id: parseInt(worldId),
        ownerId: req.session.userId,
      },
      data: {
        mainPage: mainPageJSON,
      },
    });
    console.log(result);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});

app.get("/navItems", async (req, res) => {
  const worldId = req.query.id;
  try {
    const navItems = await prisma.worlds.findUnique({
      where: {
        id: parseInt(worldId),
      },
      select: {
        navItems: true,
        pages: true,
      },
    });
    if (navItems.length > 0) {
      const navItemsJSON = navItems[0].navItems;
      const pages = navItems[0].pages;
      res.send({ navItemsJSON, pages });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});
app.post("/updateNavBarItems", async (req, res) => {
  //could be condensed to reuse code from fillNavs
  const navItems = JSON.stringify(req.body.navItems);
  const worldId = req.query.id;
  try {
    const result = await prisma.worlds.update({
      where: {
        id: parseInt(worldId),
        ownerId: req.session.userId,
      },
      data: {
        navItems: navItems,
      },
    });
    console.log(result);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});
app.post("/editNavBarOptions", async (req, res) => {
  const navItems = JSON.stringify(req.body.newNavItems);
  const newPages = JSON.stringify(req.body.newPages);
  const mapMarkers = JSON.stringify(req.body.mapMarkers);
  const worldId = req.query.id;
  try {
    const result = await prisma.worlds.update({
      where: {
        id: parseInt(worldId),
        ownerId: req.session.userId,
      },
      data: {
        navItems: navItems,
        pages: newPages,
        mapMarkers: mapMarkers,
      },
    });
    console.log(result);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});

app.get("/mapMarkers", async (req, res) => {
  const worldId = req.query.id;
  try {
    const mapMarkers = await prisma.worlds.findUnique({
      where: {
        id: parseInt(worldId),
      },
      select: {
        mapMarkers: true,
      },
    });
    if (mapMarkers.length > 0) {
      const mapMarkersJSON = mapMarkers[0].mapMarkers;
      res.send({ mapMarkersJSON });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});

app.post("/saveMapMarkers", async (req, res) => {
  const mapMarkers = JSON.stringify(req.body.mapMarkers);
  const worldId = req.query.id;
  try {
    const result = await prisma.worlds.update({
      where: {
        id: parseInt(worldId),
        ownerId: req.session.userId,
      },
      data: {
        mapMarkers: mapMarkers,
      },
    });
    console.log(result);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});

app.post("/updateImage", async (req, res) => {
  const src = req.body.src;
  const imgId = req.query.imgId;
  if (imgId == "null") {
    try {
      const result = await prisma.images.create({
        data: {
          src: src,
          ownerId: req.session.userId,
        },
      });
      const newImgId = result.id; // Store the new image ID
      console.log(result);
      res.send({ imgId: newImgId.toString() }); // Send the new image ID to the user
    } catch (err) {
      console.log(err);
      res.status(500).send("ahhhhh");
    }
  } else {
    console.log("updating");
    try {
      const result = await prisma.images.update({
        where: {
          id: parseInt(imgId),
          ownerId: req.session.userId,
        },
        data: {
          src: src,
        },
      });
      console.log(result);
      res.end();
    } catch (err) {
      console.log(err);
      res.status(500).send("ahhhhh");
    }
  }
});

app.post("/TogglePublic", async (req, res) => {
  const public = req.body.public;
  const worldId = req.query.id;
  try {
    const result = await prisma.worlds.update({
      where: {
        id: parseInt(worldId),
        ownerId: req.session.userId,
      },
      data: {
        public: public,
      },
    });
    console.log(result);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});

app.post("/deleteWorld", async (req, res) => {
  const worldId = req.query.id;
  try {
    const result = await prisma.worlds.delete({
      where: {
        id: parseInt(worldId),
        ownerId: req.session.userId,
      },
    });
    console.log(result);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("nuh uh");
  }
});
