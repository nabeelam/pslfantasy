pre requisites ::
	server ::
	mongodb, jade, http, fs, line-reader(some of these might be built-in, watch video to install mongo)
	data_scraper::
	selenium(pip install)
	selenium webchromedriver{download from selenium website}

before running server.js, run load_player_teams.js. This will populate the matches, players and teams tables in the db

on the login page if you click sign up, it will create a new account by the handle and 
the password that you entered. if you click sign in, it will log you in.

to run the data_scraper:
the server needs to be running
export webdriver.chrome.driver = {full path to the chromedriver binary above}
python sel.py

In matches.txt, you need to provide the times of all matches. If a time is less than current time, the data_scraper will
not consider it. For the other matches, it will wait till there is time for a match, after a match starts it will wait for
the match to end(waiting time is 2 minutes for testing, 4 hours in reality). It will then scrape data for that match and
send it to the server.
We assume that no two matches take place at the same  time. As far as PSL is concerned this assumption is correct.


notes:
1) I made changes yesterday but havent tested after that, so dont be surprised if the code breaks.
2) points table has not been implemented
