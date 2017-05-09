from selenium import webdriver
from socketIO_client import SocketIO
import time
import datetime
# import os 
#now = datetime.datetime.now()
waitTime = 120
chromedriver = "E:\chromedriver"
# os.environ["webdriver.chrome.driver"] = chromedriver

class Player(object):
	def __init__(self, name):
		self.name = name
		self.runs_scored = 0
		self.balls_played = 0
		self.runs_conceded = 0
		self.balls_delivered = 0
		self.wickets_taken = 0


	def getString(self):
		ret  = self.name + ':' 
		ret += str(self.runs_scored) + ':' 
		ret += str(self.balls_played) + ':' 
		ret += str(self.runs_conceded) + ':' 
		ret += str(self.balls_delivered) + ':'
		ret += str(self.wickets_taken)
		return ret 
class match_time():
	def __init__(self, index, time):
		self.index = index
		self.time = time

players = []
match_times = []
def on_match_data(*args):
	print 'got match data'
	print args[0]
	a = args[0].split('\n')
	a = a[:-1]
	for t in a:
		[match, s] = t.split('@')
		print s
		to = datetime.datetime.strptime(s, "%M/%H/%d/%m/%Y")
		now = datetime.datetime.now()
		my_datetime = now.replace(hour=to.time().hour, minute=to.time().minute, day=to.date().day, month=to.date().month,microsecond=0)
		if(my_datetime > now):
			mt = match_time(int(match), s)
			match_times.append(mt)
		else: 
			print 'it is lesser'

socketIO = SocketIO('localhost', 12000)
socketIO.emit('data_parser_connecting', "")
socketIO.on('sending_match_data', on_match_data)
socketIO.wait(seconds=5)

driver = webdriver.Chrome(chromedriver)

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False
def find_in_players(name):
	for i, player in enumerate(players):
		if(player.name == name):
			return i
	player = Player(name)
	players.append(player)
	return len(players) - 1
def handle_batting(xpath):
	tables = driver.find_elements_by_xpath(xpath)
	for table in tables:
		all_rows = table.find_elements_by_tag_name("tr")
		j = 0
		for row in all_rows:
			j += 1
			if(j%2 == 1 or j >= len(all_rows) - 1):
				continue
			s = row.text
			s = s.split()
			print(repr(s))
			if(s[0] == 'Misbah-ul-Haq*'):
				sname = 'Misbah-ul-Haq'
			elif(s[0] == 'Mahmudullah'):
				sname = 'Mahmudullah'
			elif(s[0] == 'Shakib'):
				sname = 'Shakib Al Hasan'
			elif(s[1][-1].isalpha()):
				print(s[1][-1])
				sname = s[0] + ' ' + s[1]
			elif(s[1][-2].isalpha()):
				sname = s[0] + ' ' + s[1][:-1]	
			else:	
				sname = s[0] + ' ' + s[1][:-2]		
			index = find_in_players(sname)
			players[index].runs_scored = s[-5]
			players[index].balls_played = s[-4]

def handle_bowling(xpath):
	tables = driver.find_elements_by_xpath(xpath)
	for table in tables:
		all_rows = table.find_elements_by_tag_name("tr")
		j = 0
		for row in all_rows:
			j += 1
			if(j%2 == 1):
				continue
			s = row.text
			print(repr(s))
			if(s[0] == ' ' and s[1] == ' '):
				s = s[2:]			
			s = s.split()
			if(s[-1][0] == '('):
				s = s[:-1]
			elif(s[-2][0] == '('):
				s = s[:-2]

			if(s[0] == 'Misbah-ul-Haq*'):
				sname = 'Misbah-ul-Haq'
			elif(s[0] == 'Mahmudullah'):
				sname = 'Mahmudullah'
			elif(s[0] == 'Shakib'):
				sname = 'Shakib Al Hasan'
			elif(s[1][-1].isalpha()):
				print(s[1][-1])
				sname = s[0] + ' ' + s[1]
			elif(s[1][-2].isalpha()):
				sname = s[0] + ' ' + s[1][:-1]	
			else:	
				sname = s[0] + ' ' + s[1][:-2]			
			index = find_in_players(sname)

			players[index].runs_conceded = s[-3]
			overs = s[-5]
			ls = overs.split('.')
			balls = int(ls[0]) * 6
			if(len(ls) > 1):
				balls += int(ls[1])
			players[index].balls_delivered = balls
			players[index].wickets_taken = s[-2]

def write_to_file(index, indata):
	data = indata
	fd = open('matches/match' + str(index) + '.txt','w')
	for player in players:
		line = player.getString()
		line += '\n'
		data += line
		fd.write(line)
	print(data)	
	socketIO.emit('player_match_data', data)
	fd.close()
i = 0
if(len(match_times)):
	i = match_times[0].index
for mt in match_times:
	print i
	while(True):
		to = datetime.datetime.strptime(mt.time, "%M/%H/%d/%m/%Y")
		now = datetime.datetime.now()
		print to.time().hour, now.hour
		print to.time().minute, now.minute
		my_datetime = now.replace(hour=to.time().hour, minute=to.time().minute, day=to.date().day, month=to.date().month,microsecond=0)
		if(now > my_datetime):
			break
		time.sleep(1)
	print 'match started'
	url = "http://www.espncricinfo.com/pakistan-super-league-2016-17/engine/match/" + str(1075986 + i) + ".html"
	driver.get(url)
	res = driver.find_elements_by_xpath('''//*[@id="full-scorecard"]/div[1]/div[1]/div[3]''')
	indata = str(mt.index) + '@' + res[0].text + '@'	
	handle_batting('''//*[@id="full-scorecard"]/div[2]/div/table[1]''')
	handle_bowling('''//*[@id="full-scorecard"]/div[2]/div/table[2]''')
	handle_batting('''//*[@id="full-scorecard"]/div[2]/div/table[3]''')
	handle_bowling('''//*[@id="full-scorecard"]/div[2]/div/table[4]''')
	write_to_file(i + 1, indata)
	players = []
	i += 1
