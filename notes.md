TO-DO:
the renaming button is in a wierd spot, should move it
add ads
should try to impliment drag and drop edit page divs reorganization
add logo to get rid of favicon error
updating images on main page forces second image too far down witout scroll
timestamps are added to img urls, this causes some slowdown

Later Plans(post production):
allow world copying
limitations on # creations

Khorvair Migrations:
pip3 install mysql-connector-python
pip3 install python-dotenv

Google App:
https://console.cloud.google.com/welcome/new?authuser=3&project=lorelibrary-416421&supportedpurview=project

Db Migrate from prisma file:
npx prisma migrate dev --name init

Image storage:
get connection to firebase bucket
get uploads and GETs
update text db to handle links to bucket for getting images

https://console.firebase.google.com/u/3/project/lorekeeper-ebf9b/storage/lorekeeper-ebf9b.appspot.com/files/~2Fimages?consoleUI=FIREBASE
https://firebase.google.com/docs/storage/web/upload-files
