npm install jade
npm install mongodb


Before running the server run load_player_teams.js. This will populate the database with players and teams

on the login page if you click sign up, it will create a new account by the handle and 
the password that you entered. if you click sign in, it will log you in.

in the buying (or selling) portal, if you want to buy (or sell) a player, just click on the button. If the transaction is succesful, the button will change to Bought (or Sold). Otherwise, either you already own that player or you dont have enough money.

TODO:
1) scrape data {very important} ----> please stick to the format specified in player-teams.txt

i.e. e.g. if you want to create a txt file of matches, the format should be something like

Match :1
Team :Real Madrid
Team :Barcelona
Result :3-0
Player :messi
minutes :90
goals :0
tackles :5
dribbles :19
player :Kroos
minutes :90
goals :2
tackles :7
dribbles :11


2) front end ------> The files that should be modified are view_info.jade/js, Buying_portal.jade/js, Selling_portal.jade/js