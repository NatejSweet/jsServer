const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
// const bcrypt = require("bcryptjs");
dotenv.config({ path: "../.env" });
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
app.use(express.json({ limit: "20mb" }));
const mysql = require("mysql");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "158223117090 - mm2f708rmllg070nisolvu1nomefh5mb.apps.googleusercontent.com"
);
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
console.log(process.env.FIREBASE_STORAGE_BUCKET);
const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);

const multer = require("multer");
const upload = multer();

const jwt = require("jsonwebtoken");
const jwtMiddleware = () => {
  return (req, res, next) => {
    let authorization = req.headers.authorization;
    let token;
    if (authorization) {
      token = authorization.split(" ")[1];
    }
    if (!token) {
      res.status(401).send("unauthorized");
      return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send("unauthorized");
        return;
      }
      req.userId = decoded.id;
      next();
    });
  };
};
//db setup
var pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 20, // Increase the limit
  acquireTimeout: 30000, // Increase the timeout
});
module.exports = Object.freeze({
  pool: pool,
});
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));
app.listen(port, () =>
  console.log("server listening at http://localhost:" + port)
);

async function uploadImage(image, name) {
  const file = bucket.file(name);
  await file.save(image.buffer, {
    public: true,
    contentType: image.mimetype,
    metadata: {
      cacheControl: "no-cache, max-age=0",
    },
  });

  // Get the signed URL for the file
  return file
    .getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    })
    .then((signedUrls) => {
      // signedUrls[0] contains the file's public URL
      return signedUrls[0];
    });
}

async function deleteImages(worldId, worldName) {
  const folderName = `images/${worldName}_${worldId}`;
  await bucket.deleteFiles({
    prefix: folderName,
  });
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/guest.html"));
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
    if (!userid) {
      //if there is no user id from google
      res.status(401).send("unauthorized");
      return; // Ensure no further code is executed
    }
    const user = await prisma.users.findUnique({
      where: { id: userid },
    });
    if (!user) {
      //if there is no user in the database
      await prisma.users.create({
        data: {
          id: userid,
          savedWorlds: JSON.stringify([]),
        },
      });
    }
    const token = jwt.sign({ id: userid }, process.env.JWT_SECRET); //create a token
    res.status(200).send({ token });
    return; // Ensure no further code is executed
  } catch (err) {
    console.log(err);
    res.status(500).send("login failed");
  }
});

app.get("/dashboard", jwtMiddleware(), async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.userId },
    });
    if (!user) {
      //user not found
      res.redirect("/");
    }
    res.sendFile(path.join(__dirname + "/public/dashboard.html"));
  } catch (err) {
    console.log(err);
    res.status(500).send("get dashboard failed");
  }
});

app.get("/worlds", async (req, res) => {
  try {
    const items = await prisma.worlds.findMany({
      where: {
        public: true,
      },
      select: {
        id: true,
        worldName: true,
      },
    });
    res.send(items);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/myWorlds", jwtMiddleware(), async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.userId },
    });
    if (!user) {
      //user not found
      res.redirect("/");
    }
    const items = await prisma.worlds.findMany({
      where: {
        ownerId: req.userId,
      },
      select: {
        id: true,
        worldName: true,
      },
    });
    res.send(items);
  } catch (err) {
    console.log(err);
    res.status(500).send("get myWorlds failed");
  }
});

app.get("/savedWorlds", jwtMiddleware(), async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.userId },
    });
    if (!user) {
      //user not found
      res.redirect("/");
    }
    res.send(user.savedWorlds);
  } catch (err) {
    console.log(err);
    res.status(500).send("get savedWorlds failed");
  }
});

app.get("/searchWorlds", async (req, res) => {
  try {
    const query = req.query.query;
    let items;
    if (req.userId) {
      items = await prisma.worlds.findMany({
        where: {
          worldName: {
            contains: query,
          },
          public: true,
          ownerId: {
            not: req.userId,
          },
        },
      });
    } else {
      items = await prisma.worlds.findMany({
        where: {
          worldName: {
            contains: query,
          },
          public: true,
        },
      });
      console.log(items);
    }
    res.send(items);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/saveWorlds", jwtMiddleware(), async (req, res) => {
  //update saved worlds
  const savedWorlds = JSON.stringify(req.body.savedWorlds);
  try {
    const result = await prisma.users.update({
      where: {
        id: req.userId,
      },
      data: {
        savedWorlds: savedWorlds,
      },
    });
    if (!result) {
      //user not found
      res.status(404).send("user not found");
    }
    res.status(200).send("saved worlds");
  } catch (err) {
    console.log(err);
    res.status(500).send("save worlds failed");
  }
});

app.post(
  "/world",
  jwtMiddleware(),
  upload.fields([
    { name: "world", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const world = JSON.parse(req.body.world);
      const name = world.name;
      var navItems = world.navItems;

      var content = world.content;
      content = JSON.stringify(content);
      navItems = JSON.stringify(navItems);

      const worldResult = await prisma.worlds.create({
        data: {
          worldName: name,
          ownerId: req.userId,
          mainPage: content,
          navItems: navItems,
          mapMarkers: "{}",
          public: false,
          mainImgUrl: "",
          altImgUrl: "",
        },
      });
      let worldId = worldResult.id;
      if (worldId) {
        let mainImageUrl = "images/" + name + "_" + worldId + "/mainImg";
        let altImageUrl = "images/" + name + "_" + worldId + "/altImg";
        if (req.files.image) {
          const image = req.files.image[0]; //image file
          mainImageUrl = await uploadImage(image, mainImageUrl); //upload image to
        }

        const result = await prisma.worlds.update({
          where: {
            id: worldId,
          },
          data: {
            mainImgUrl: mainImageUrl,
            altImgUrl: altImageUrl,
          },
        });
        res.status(200).json({ worldId: worldId });
      } else {
        res.status(500).send("create world failed");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("create world failed");
    }
  }
);

app.get("/fillNavs/:id", jwtMiddleware(), async (req, res) => {
  const worldId = parseInt(req.params.id);
  try {
    const navs = await prisma.worlds.findUnique({
      where: {
        id: worldId,
        ownerId: req.userId,
      },
      select: {
        navItems: true,
        worldName: true,
      },
    });
    if (!navs) {
      //world not found
      res.status(404).send("world not found");
    }
    let navItems = navs.navItems;
    let worldName = navs.worldName;
    res.send({ navItems, worldName });
  } catch (err) {
    console.log(err);
    res.status(500).send("fill navs failed");
  }
});

app.post("/fillNavs/:id", jwtMiddleware(), async (req, res) => {
  try {
    let navContents = req.body;
    let pages = {};
    const worldId = parseInt(req.params.id);
    Object.values(navContents).forEach((nav) => {
      nav.forEach((navItem) => {
        pages[navItem] = { content: [], imgId: null };
      });
    });
    pages = JSON.stringify(pages);
    navContents = JSON.stringify(navContents);
    const result = await prisma.worlds.update({
      where: {
        id: parseInt(worldId),
        ownerId: req.userId,
      },
      data: {
        pages: pages,
        navItems: navContents,
      },
    });
    if (!result) {
      //world not found
      res.status(404).send("world not found");
    }
    res.status(200).send("navs filled");
  } catch (err) {
    console.log(err);
    res.status(500).send("fill navs failed");
  }
});

app.get("/world/:id", jwtMiddleware(), async (req, res) => {
  try {
    let worldId = parseInt(req.params.id);
    const world = await prisma.worlds.findUnique({
      where: {
        id: worldId,
      },
    });
    if (!world) {
      //world not found
      res.status(404).send("world not found");
    }
    if (world != null && (world.public || world.ownerId == req.userId)) {
      const editAccess = world.ownerId == req.userId;
      const mainPageJSON = world.mainPage;
      const worldName = world.worldName;
      const mainImgUrl = world.mainImgUrl;
      const altImgUrl = world.altImgUrl;
      const navItems = world.navItems;
      const pagesJSON = world.pages;
      const mapMarkers = world.mapMarkers;
      const public = world.public;
      res.send({
        mainPageJSON,
        worldName,
        mainImgUrl,
        altImgUrl,
        navItems,
        pagesJSON,
        mapMarkers,
        editAccess,
        public,
      });
    } else {
      //unauthorized
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("get world failed");
  }
});
app.patch("/world/:id", jwtMiddleware(), async (req, res) => {
  try {
    let worldId = parseInt(req.params.id);
    const world = await prisma.worlds.findUnique({
      where: {
        id: worldId,
      },
    });
    if (!world) {
      //world not found
      res.status(404).send("world not found");
    }
    if (world.ownerId != req.userId) {
      //unauthorized
      res.status(401).send("unauthorized");
    }
    const worldData = req.body;
    const result = await prisma.worlds.update({
      where: {
        id: worldId,
      },
      data: worldData,
    });
    if (!result) {
      //world not found
      res.status(404).send("world not found");
    }
    res.status(200).send("world updated");
  } catch (err) {
    console.log(err);
    res.status(500).send("update world failed");
  }
});

app.patch("/navbar/:id", jwtMiddleware(), async (req, res) => {
  try {
    let worldId = parseInt(req.params.id);
    const world = await prisma.worlds.findUnique({
      where: {
        id: worldId,
      },
    });
    if (!world) {
      //world not found
      res.status(404).send("world not found");
    }
    if (world.ownerId != req.userId) {
      //unauthorized
      res.status(401).send("unauthorized");
    }
    const navItems = JSON.stringify(req.body);
    const result = await prisma.worlds.update({
      where: {
        id: worldId,
      },
      data: {
        navItems: navItems,
      },
    });
    if (!result) {
      //world not found
      res.status(404).send("world not found");
    }
    res.status(200).send("navbar updated");
  } catch (err) {
    console.log(err);
    res.status(500).send("update navbar failed");
  }
});

app.patch("/pages/:id", jwtMiddleware(), async (req, res) => {
  try {
    let worldId = parseInt(req.params.id);
    const world = await prisma.worlds.findUnique({
      where: {
        id: worldId,
      },
    });
    if (!world) {
      //world not found
      res.status(404).send("world not found");
    }
    if (world.ownerId != req.userId) {
      //unauthorized
      res.status(401).send("unauthorized");
    }
    const pages = JSON.stringify(req.body);
    const result = await prisma.worlds.update({
      where: {
        id: worldId,
      },
      data: {
        pages: pages,
      },
    });
    if (!result) {
      //world not found
      res.status(404).send("world not found");
    }
    res.status(200).send("pages updated");
  } catch (err) {
    console.log(err);
    res.status(500).send("update pages failed");
  }
});

app.patch("/mapMarkers/:id", jwtMiddleware(), async (req, res) => {
  try {
    let worldId = parseInt(req.params.id);
    const world = await prisma.worlds.findUnique({
      where: {
        id: worldId,
      },
    });
    if (!world) {
      //world not found
      res.status(404).send("world not found");
    }
    if (world.ownerId != req.userId) {
      //unauthorized
      res.status(401).send("unauthorized");
    }
    const mapMarkers = JSON.stringify(req.body);
    const result = await prisma.worlds.update({
      where: {
        id: worldId,
      },
      data: {
        mapMarkers: mapMarkers,
      },
    });
    if (!result) {
      //world not found
      res.status(404).send("world not found");
    }
    res.status(200).send("map markers updated");
  } catch (err) {
    console.log(err);
    res.status(500).send("update map markers failed");
  }
});

app.patch("/public/:id", jwtMiddleware(), async (req, res) => {
  try {
    let worldId = parseInt(req.params.id);
    const world = await prisma.worlds.findUnique({
      where: {
        id: worldId,
      },
    });
    if (!world) {
      //world not found
      res.status(404).send("world not found");
    }
    if (world.ownerId != req.userId) {
      //unauthorized
      res.status(401).send("unauthorized");
    }
    const public = req.body.public;
    const result = await prisma.worlds.update({
      where: {
        id: worldId,
      },
      data: {
        public: public,
      },
    });
    if (!result) {
      //world not found
      res.status(404).send("world not found");
    }
    res.status(200).send("public updated");
  } catch (err) {
    console.log(err);
    res.status(500).send("update public failed");
  }
});

app.delete("/world/:id", jwtMiddleware(), async (req, res) => {
  try {
    let worldId = parseInt(req.params.id);
    const world = await prisma.worlds.findUnique({
      where: {
        id: worldId,
      },
    });
    if (!world) {
      //world not found
      res.status(404).send("world not found");
    }
    if (world.ownerId != req.userId) {
      //unauthorized
      res.status(401).send("unauthorized");
    }
    const result = await prisma.worlds.delete({
      where: {
        id: worldId,
      },
    });
    if (!result) {
      //world not found
      res.status(404).send("world not found");
    }
    deleteImages;
    res.status(200).send("world deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("delete world failed");
  }
});

app.post(
  "/image/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    const worldId = parseInt(req.params.id);
    let src;
    let image = req.files.image[0];
    let worldName = req.body.worldName;
    let tag = req.body.imgTag;
    let imageUrl = "images/" + worldName + "_" + worldId + "/" + tag;
    let world;
    try {
      world = await prisma.worlds.findUnique({
        //check that world exists and user has access
        where: {
          id: worldId,
        },
      });
      if (!world) {
        //world not found
        res.status(404).send("world not found");
        return;
      }
      if (world.ownerId != req.userId) {
        //unauthorized
        res.status(401).send("unauthorized");
        return;
      }
      src = await uploadImage(image, imageUrl); //upload image to firebase
    } catch (err) {
      console.log(err);
      res.status(500).send("upload image failed");
      return;
    }
    let result;
    if (src) {
      if (tag == "mainImg") {
        result = await prisma.worlds.update({
          where: {
            id: worldId,
          },
          data: {
            mainImgUrl: src,
          },
        });
      } else if (tag == "altImg") {
        result = await prisma.worlds.update({
          where: {
            id: worldId,
          },
          data: {
            altImgUrl: src,
          },
        });
      } else {
        world.pages = JSON.parse(world.pages);
        world.pages[tag].imgId = src;
        world.pages = JSON.stringify(world.pages);
        result = await prisma.worlds.update({
          where: {
            id: worldId,
          },
          data: {
            pages: world.pages,
          },
        });
      }
    }
    if (!result) {
      //world not found
      res.status(404).send("error updating image src in world");
      return;
    }
    res.send(src);
  }
);
