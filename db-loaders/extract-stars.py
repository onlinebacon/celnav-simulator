from skyfield.api import Star, load
from skyfield.data import hipparcos
import datetime

planets = load('de421.bsp')
with load.open(hipparcos.URL) as f:
	df = hipparcos.load_dataframe(f)

min_mag = 5

bright_df = df[df['magnitude'] <= min_mag]
bright_stars = Star.from_dataframe(bright_df)
csv = bright_df.to_csv().strip().split('\n')

hips = []
mags = []
outputs = []

for i in range(len(csv) - 1):
	cols = csv[i + 1].split(',')
	hips.append(int(cols[0]))
	mags.append(float(cols[1]))

class Output:
	def __init__(self, i) -> None:
		self.hip = hips[i]
		self.mag = mags[i]
		self.raList = []
		self.decList = []

for i in range(len(hips)):
	outputs.append(Output(i))

ts = load.timescale()
earth = planets['earth']

def extract(year, month, day, hour, min, sec):
	t = ts.utc(year, month, day, hour, min, sec)
	ra_list, dec_list, _ = earth.at(t).observe(bright_stars).radec()
	ra_list = ra_list.hours
	dec_list = dec_list.degrees
	for i in range(len(hips)):
		outputs[i].raList.append(ra_list[i])
		outputs[i].decList.append(dec_list[i])

startTime = 1672531200
endTime = 1704067200
interval = 3*31*24*60*60

time = startTime
while True:
	dt = datetime.datetime.utcfromtimestamp(time)
	extract(dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second)
	if time >= endTime:
		break
	time += interval

src = '[\n'
for output in outputs:
	src += '\t{\n'
	src += '\t\thip: ' + str(output.hip) + ',\n'
	src += '\t\tmag: ' + str(output.mag) + ',\n'
	src += '\t\tstartTime: ' + str(startTime) + ',\n'
	src += '\t\tinterval: ' + str(interval) + ',\n'
	src += '\t\traList: ' + str(output.raList) + ',\n'
	src += '\t\tdecList: ' + str(output.decList) + ',\n'
	src += '\t},\n'
src += '];\n'

f = open('./stars-skyfield-data.js', 'w')
f.write(src)
f.close()
