When storing into the database, a pages data will be stored as [[Title,[Subtext1,[text,text],subtext2[text,text]],[Title2,[subtext1,[text]]]]]
an array of title arrays, the second item in the title array is an subtext array which alternated with even items as subtext content and odd items being an array of text items that fall under the previous subtext item

Whole world table is [worldName VARCHAR(50), ownerID INT, imgId1 INT, imgId2, mainPage VARCHAR(8192), Pages VARCHAR(65532), navNames, NavItems]

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
editPage-> save page creates an unsave world button
updating image from hub updates main image(khorvair)
impliment saving and renaming world
add ads
resizing page while placing map markers breaks, some times, may not need fixed

Saving
add save button is not owner
call save function
add id to saved worlds
when viewing if not owner, but public, and a saved world
loggin into a non-existant user causes permaload
margin at /
edit page on hub works mostly, but leaves edit map button and does not create edit buttons
should try to impliment drag and drop edit page divs reorganization

when logged in but not owner
world has save button, maybe saved worlds is grabbed on login
if world id not in saved worlds, create savebutton
else do nothing
saved worlds dropdown
div/button with name and side button that when clicked, expects next click on whole button, if next click not on button, cancel delete

Khorvair Migrations:
pip3 install mysql-connector-python
pip3 install python-dotenv
