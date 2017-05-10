# PSL Fantasy League

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

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
Give examples
```

### Installing

A step by step series of examples that tell you have to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc

