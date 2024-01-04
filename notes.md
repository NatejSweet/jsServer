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

complete edit images functionality
    need to test on hub pages(means I need to store hubImgIds now)
    need to make work on mainpage secondary image

cannot handle two images on upload                                          goping to disable second image then
    change to have add secondary image button on the edit page mode
        impliment canmge main image as well, allowing for updating images

edit nav options -> mainPage, does not load nav

2 images on wqorld startup is too heavy for a request
    change to force only one image (main) on creation
    add functionality to allow for updating images and adding images for pages/ secondary on main

need to change new pages to be created and mantained as hub:{content:[], imgId:null}

add a home button that returns to the dash.html page

probably want ot rework how image ids are stored, however it is not a problem



