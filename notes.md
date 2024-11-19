TO-DO:
map slider usage moves dot
add ads
should try to impliment drag and drop edit page divs reorganization
add logo to get rid of favicon error
updating images on main page forces second image too far down witout scroll
limitations on # creations
resizing screen messes up map markers, fixed with reload, not a huge issue, but will be annoying for mobile
switch to JWT for user identification
allow world copying
containerize
search needs to get all then search locally
change maps to have one global and allow a page to have a locla map
uploading a replacement image may not work due to cacheing
need to rout / if have token to dash
might need a full mapmarkers rework, the logic is too complex, start with pseudo
api_rebase_to-do:
guest search needs reworked
dash search needs reworked
dash saved worlds needs reworked

Later Plans(post production):

scan for vulnerabilities(github maybe)

Khorvair Migrations:
pip3 install mysql-connector-python
pip3 install python-dotenv

Google App:
https://console.cloud.google.com/welcome/new?authuser=3&project=lorelibrary-416421&supportedpurview=project

Db Migrate from prisma file:
npx prisma migrate dev --name init

Firebase:
https://console.firebase.google.com/u/3/project/lorekeeper-ebf9b/storage/lorekeeper-ebf9b.appspot.com/files/~2Fimages?consoleUI=FIREBASE
https://firebase.google.com/docs/storage/web/upload-files
