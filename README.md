# PSL Fantasy League

Developed in fulfilment of coursework for CS 360, Software Engineering, by Dr. Suleman Shahid at the Lahore University of Management Sciences.

PSL Fantasy League is our modest implementation of a fantasy cricket league, in particular the Pakistan Super League. It runs as a client-server interaction in nodeJS.

# Features

PSLFantasy has the following high-level features:
* User Signup and Login,
* Data Scraping from ESPN (via Selenium),
* Buying and Selling Portal,
* Player Information and Statistics,
* Upcoming Fixtures,
* League Table, sorted by score.

## Data Scraper
The data scraper is developed in Selenium WebDriver, which can be installed from [here](http://seleniumhq.org). We write a scraper in its Python bindings, which pulls match data from ESPN and updates ```matches.txt```.

# Getting Started

You can either play online, roll your own local league, or export this to other cricket leagues.

## 1. Playing Online
These instructions will help you set up **PSLFantasy** and join our online player database. To run your own iteration, see the next section below.

### Prerequisites

**PSLfantasy** runs on ```nodeJS``` [(install)](https://nodejs.org/en/download/) with the additional modules below. You can install these via ```npm```, the standard package manager. 

**Modules to install:**
```
socket.io
mongoDB
jade
line-reader
```

**Modules that come built-in:**
```
fs
http
```

### Installing

First, install ```nodeJS```[(install)](https://nodejs.org/en/download/).

Next, install the modules above by running ```npm install <module>``` for each. 

For example, to install **socket.io**, run this in your terminal:
```
npm install socketio
```

Now download the *PSLFantasy* repository and navigate to it. For example: 

```
cd pslfantasy           // navigates to the folder you downloaded
```

Now, let's start the server. Run ```node server.js``` in your terminal.

Finally, browse to ```localhost:12000``` in your browser and sign up!

## 2. Rolling Your Own Local League

This is similar to Step 1 above (Playing with Others), except you must roll your own MongoDB database. For this:

1. Modify the variable ```url``` in ```server.js``` and ```load_player_teams.js``` to point to your own MongoDB database (local or online).

2. Run ```node load_player_teams.js``` **BEFORE** running ```node server.js```. This will populate the matches, players and team data in the database.

3. Navigate to ```localhost:12000``` and begin with a fresh install. 

## 3. Use for Other Cricket Leagues

For this, you need to make three files.

In ```matches.txt```, provide the times of all matches. If a time is less than the current time (in the real world), the data scraper (```scraper.py```) will not consider it. 

The scraper will run regularly until a match occurs (2 minutes for testing, but 4 hours in reality), and scrape data for that match and send it to the server. 

#### Warning:
*We assume that no two matches take place at the same time. As far as the Pakistan Super League is concerned, this is correct.*

To run the scraper (first ensure the server is running):
```
### 
    data_scraper::
    selenium(pip install)
    selenium webchromedriver
    export webdriver.chrome.driver
    python sel.py
```

### Built With

* [NodeJS](http://nodejs.org): Web framework used.
* [Skeleton CSS](http://getskeleton.org): Responsive CSS boilerplate.
* [Selenium](https://seleniumhq.org/): Data scraping and testing.

### Authors

* Nabeel Ahmed (@nabeelam)
* Daniyal Jangda (@daniyaljangda)
* Muhammad Abu Bakar (@MuhammadAbuBakar95)

### License

This project is licensed under the MIT License.

### Acknowledgments

* Advisor: Dr. Suleman Shahid,
* Teaching Assistant: Shahroze Tariq, and 
* The CS 360 Course Staff.

