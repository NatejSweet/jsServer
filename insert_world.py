
import mysql.connector
import os
from dotenv import load_dotenv

world_id = 1
world_name = "Khorvair"
mainPage = "1"
img1Id = 1
img2Id = 2
NavItems = """{"Bringdon":{"content":[["Bringdon",[]],["Districts",[["Commerce",[]],["Factory",[]],["Residential",[]],["Scholar",[]],["Military",[]]]],["Guild HQs:",[["Smiths",[]],["Trades",[]],["Farmers",[]],["Jewelers",[]],["Mages",[]],["Miners",[]],["Hunters",[]],["Mercenaries",[]]]],["Taverns",[["The Worthless Knife Inn",[]],["The Faded Cashew Bar",[]],["Ye Olde Trespasser Bar",[]],["The Venomous Salad",[]],["The Nifty Bears Inn",[]]]],["Shops",[["Nincomsoup",["soup shop, but will also sell potions in the form of soups at a discounted price"]],["The Fantastic Antenna",["Mail shop, used to send physical mail or magic messages for a higher price"]],["The Sleeping Tusk",[" Weapons and armor supply store"]],["The Elder Bull",["Weapons and armor Store"]],["The Sweet Tower",["Goofy Magic shop, usually has gimmick items, but occasionally had utility items"]],["The Needy Cloak Hardware Store",["Tinkering hardware store"]],["The Smelly Mantle Market",["General commerce square, all shops go under this name"]],["The Abiding Boar Music Store",["music store"]],["The Rainy Sail Tradepost",["General supply store"]],["Florist Gump",["Sells flowers and other herbalist materials, can procure ingredients for potions"]],["The Wandering Wizard",["Actual magic shop, however very spendy, protected by mercenaries 24/7, will have easily apparent good items"]]]],["People of Interest",[["King Eisel",[]]]]],"imgId":null},"Driften":{"content":[],"imgId":null},"Glasskiln":{"content":[],"imgId":null},"Iskip":{"content":[],"imgId":null},"Krystall":{"content":[],"imgId":null},"Orsen":{"content":[],"imgId":null},"Thistleton":{"content":[],"imgId":null},"Torin":{"content":[["Torin",[]],["Districts",[["Hunters",[]],["Trade",[]],["Residential",[]]]],["Guild HQs",[["Hunters",[]]]],["Taverns",[["The Shattered Mountain",[]],["The Greasy Barrel",[]]]],["Shops",[["Squimble's Knick Knacks",[]],["The Merc-Antile",[]],["Wards n' Wands",[]]]],["People of Interest ",[["Mayor Hundere Deepbreaker",[]],["Duke Harold Greyzin",[]],["Squimble",[]],["Grand Cleric Davis",[]],["War Wizard Elvis",[]]]]],"imgId":null},"Castle Adere":{"content":[],"imgId":null},"Castle Shadowbell":{"content":[],"imgId":null},"Castle Soupeak":{"content":[],"imgId":null},"Blummen":{"content":[],"imgId":null},"Diffelheim":{"content":[],"imgId":null},"Grird":{"content":[],"imgId":null},"Grost":{"content":[["Grost",[]],["Districs",[["Residential",["small urban area consisting of trades workers, some farmhands and guards"]],["Farming",["Huge area surrounding the city, large portion of the city lives on their farms"]],["Commerce",["Medium commerce center, mostly food and tools"]]]],["Taverns",[["The Ghost Stars Inn",["Medium inn, medium quality with an beautiful bio-lumiscent filled plants layout"]],["The Aromatic Cucumber",["Basic in, used by many farmers and travelers"]]]],["Shops",[["The Brewing Brothers",["Medium shop run by two half brothers, one half orc, one half elf. The elf runs the store while the orc brews some of the best mead and ale in the southern province. The two brothers don't price gouge though"]],["The Waving Phone Butcher Shop",["Small butcher shop, however the group can buy preserved food in bulk here"]],["The Blind Compass Outfitter",["Basic trade store with a small smithy attached for repairs and making of tools/weapons"]]]],["People of Interest",[["John Greenfield",["Half-orc brewer, quiet and well mannered"]],["Jay Greenfield",["Half elf salesman for the brewery, outgoing,friendly, and helpful"]],["Captain Quail",["Aaracockra guards captain, hardy and blunt"]],["Governor Pi",["Gnome scholar who found himself in charge of a city on accident"]]]]],"imgId":null},"Grovetide":{"content":[["Grovetide",[]],["Districts",[]],["",[]],["",[]],["",[]],["",[]]],"imgId":null},"Hidun":{"content":[],"imgId":null},"Hifledown":{"content":[],"imgId":null},"Hoist":{"content":[],"imgId":null},"Pralle":{"content":[],"imgId":null},"Castle Deepriven":{"content":[],"imgId":null},"Castle Eastrock":{"content":[],"imgId":null},"Castle Mountaincross":{"content":[],"imgId":null},"Castle Nortguard":{"content":[],"imgId":null},"Alaskar":{"content":[],"imgId":null},"Bigjungle":{"content":[],"imgId":null},"Groveils":{"content":[],"imgId":null},"Rovern":{"content":[],"imgId":null},"Sonnensetz":{"content":[["Sonnensetz",[]],["Districts",[["Commerce",[]],["Residential",[]],["Wharf",[]]]],["Shops",[["The Kraken's Bane",[]],["Seas End",[]],["Sun's Armory",[]]]],["Taverns",[["The Pirates Haven",[]]]]],"imgId":null},"Suden":{"content":[],"imgId":null},"Castle Crosswatch":{"content":[],"imgId":null},"Castle Donners":{"content":[],"imgId":null}}"""
mapMarkers = '{"Nothern Territories":["Bringdon","Driften","Glasskiln","Iskip","Krystall","Orsen","Thistleton","Torin","Castle Adere","Castle Shadowbell","Castle Soupeak"],"Southern Terrirories":["Blummen","Diffelheim","Grird","Grost","Grovetide","Hidun","Hifledown","Hoist","Pralle","Castle Deepriven","Castle Eastrock","Castle Mountaincross","Castle Nortguard"],"Ocean Territories":["Alaskar","Bigjungle","Groveils","Rovern","Sonnensetz","Suden","Castle Crosswatch","Castle Donners"]}'
public = {}
ownerId = "0"

conn = mysql.connector.connect(
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_DATABASE')
        )

cursor = conn.cursor()
# Insert the other data

query = 'INSERT INTO worlds (world_id, world_name, mainPage, img1Id, img2Id, NavItems, mapMarkers, public, ownerId) (%s, %s, %s, %s, %s, %s, %s, %s, %s);'
VALUES = (world_id, world_name, mainPage, img1Id, img2Id, NavItems, mapMarkers, public, ownerId)
# Update the pages column
query = 'UPDATE worlds SET pages = pages WHERE world_id = world_id'
cursor.execute(query)
conn.commit()
cursor.close()
conn.close()
