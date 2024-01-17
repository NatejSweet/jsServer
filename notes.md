When storing into the database, a pages data will be stored as [[Title,[Subtext1,[text,text],subtext2[text,text]],[Title2,[subtext1,[text]]]]]
an array of title arrays, the second item in the title array is an subtext array which alternated with even items as subtext content and odd items being an array of text items that fall under the previous subtext item

Whole  world table is [worldName VARCHAR(50), ownerID INT, imgId1 INT, imgId2, mainPage VARCHAR(8192), Pages VARCHAR(65532), navNames, NavItems]

MainPage=[img ID1(likely main image), Img ID2, [content array]]

Pages:
{
    hubName: [PageTitle, imgId,[content array]],
    hubname...
}

content array:
[Title,[subtext,[text]],title[sub[text]]]

NavNames:
[nav1,nav2,nav30]

NavItems:
[[nav1.1,nav1.2],[nav2.1,nav2.2,nav2.3],[nav3.1,nav3.2,nav3.3]]


for creation                    
    CREATE TABLE worlds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    worldName VARCHAR(50) NOT NULL,
    ownerId INT NOT NULL,
    img1Id INT,
    img2Id INT,
    mainPage BLOB,
    pages BLOB,
    navNames BLOB,
    navItems BLOB
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY,KEY,
    
)

fill navs page
    update where id=worldId (navitems) VALUES ([,,,])


TO-DO:
flip some buttons around
be caution of too many navitems forcing buttons down
secure login from spam
add final styling
for private worlds, disable access from simply searching the Id
probably want ot rework how image ids are stored, however it is not a problem
needto rework editNavBarOptions due to changes on navbar(removed labels and replaces with a default option)



