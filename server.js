const express = require("express");
const { PrismaClient } = require("@prisma/client");
var mariadb = require("mariadb");
const dotenv = require("dotenv");
// const bcrypt = require("bcryptjs");
dotenv.config({ path: "./.env" });
const app = express();
const path = require("path");
const port = 3000;
app.use(express.json({ limit: "50mb" }));
const prisma = new PrismaClient();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "158223117090 - mm2f708rmllg070nisolvu1nomefh5mb.apps.googleusercontent.com"
);
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);

const multer = require("multer");
const upload = multer();

// const filePath = "./public/viewing/images/home.png";
// const destination = "images/home.png";

// bucket
//   .upload(filePath, {
//     destination: destination,
//     public: true,
//   })
//   .then(() => {
//     console.log("File uploaded to", destination);
//   })
//   .catch((err) => {
//     console.error("Error uploading file:", err);
//   });

async function uploadImage(image, name) {
  const file = bucket.file(name);
  await file.save(image.buffer, {
    public: true,
    contentType: image.mimetype,
  });
  return `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/images/${name}`;
}

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
const { env } = require("process");

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
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience:
        "158223117090-mm2f708rmllg070nisolvu1nomefh5mb.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    if (userid) {
      const user = await prisma.users.findFirst({
        where: {
          id: userid,
        },
      });
      console.log(user);
      if (user) {
        req.session.userId = user.id;
        res.send({ savedWorlds: user.savedWorlds });
        return;
      } else {
        const user = await prisma.users.create({
          data: {
            id: userid,
            savedWorlds: "{}",
          },
        });
        console.log(user);
        if (user) {
          req.session.userId = user.id;
          res.send({ savedWorlds: user.savedWorlds });
          return;
        } else {
          res.status(401).send("Not logged in");
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Not logged in");
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

// app.post("/createAccount", async (req, res) => {
//   const { username, password } = req.body;
//   var user = null;
//   try {
//     const passwordHash = await bcrypt.hash(password, 10);
//     const existingUser = await prisma.users.findFirst({
//       where: {
//         username: username,
//       },
//     });

//     if (existingUser) {
//       res.status(400).send("Username already exists");
//       return;
//     } else {
//       user = await prisma.users.create({
//         data: {
//           username: username,
//           password: passwordHash,
//           savedWorlds: "{}",
//         },
//       });
//     }
//     if (user) {
//       req.session.userId = user.id;
//       res.send({ savedWorlds: user.savedWorlds });
//     } else {
//       res.redirect("/");
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("ahhhhh");
//   }
// });

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

app.get("/savedWorlds", async (req, res) => {
  console.log(req.session.userId);
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: req.session.userId,
      },
    });
    if (user) {
      res.send(user.savedWorlds);
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
          contains: query,
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

app.post("/updateSavedWorlds", async (req, res) => {
  const savedWorlds = JSON.stringify(req.body);
  console.log("hi!" + " " + savedWorlds);
  try {
    const result = await prisma.users.update({
      where: {
        id: req.session.userId,
      },
      data: {
        savedWorlds: savedWorlds,
      },
    });
    console.log(result);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("ahhhhh");
  }
});

app.post(
  "/createWorld",
  upload.fields([
    { name: "world", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    const world = JSON.parse(req.body.world);
    const name = world.name;
    var navItems = world.navItems;
    const image = req.files.image[0]; // Assuming 'image' is the name of the file field in the FormData
    var content = world.content;
    content = JSON.stringify(content);
    navItems = JSON.stringify(navItems);
    try {
      // Create the world first
      const worldResult = await prisma.worlds.create({
        data: {
          worldName: name,
          ownerId: req.session.userId,
          mainPage: content,
          navItems: navItems,
          mapMarkers: "{}",
          public: false,
        },
      });
      const worldId = worldResult.id;
      req.session.worldId = worldId.toString(); // Store the worldId in the session

      // Then upload the image using the worldId
      console.log(image);
      let downloadUrl = await uploadImage(image, name + worldId + "mainImg");
      let img1Result = await prisma.images.create({
        data: {
          src: downloadUrl,
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

      // Update the world with the image IDs
      await prisma.worlds.update({
        where: { id: worldId },
        data: { img1Id: img1Id, img2Id: img2Id },
      });

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
    console.log("bye");
  }
);

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
    if (
      mainPage != null &&
      (mainPage.public || mainPage.ownerId == req.session.userId)
    ) {
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
      // alert("You do not have access to this world");
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

app.post("/renameWorld", async (req, res) => {
  const worldName = req.body.worldName;
  const worldId = req.query.id;
  try {
    const result = await prisma.worlds.update({
      where: {
        id: parseInt(worldId),
        ownerId: req.session.userId,
      },
      data: {
        worldName: worldName,
      },
    });
    console.log(result);
    res.end();
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
