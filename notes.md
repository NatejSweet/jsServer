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
remove navNames from database
update website to work withou this useless variable
map still needs some work, removed markers are not deleted for some reason
map doesnt reload after saving markers
there is an issue with replacing the navItem(region) and not creating empty pages for it
    adding navOptions(hubs) to the new item also does not create anything other than enteries in navItems(need somethin in pages)
there is also an issue with replacing a navOption(hub), the data for the old option does not dissapear right away
there is also an issue with the map markers duplicating
    this is liekly cause by an incomplete place Previous markers function
add cancel button to edit page mode
add link at worldName to reload to mainPage
make cancelNavOptionsEdit function



