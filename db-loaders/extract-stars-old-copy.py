from skyfield.api import Star, load
from skyfield.data import hipparcos

planets = load('de421.bsp')
ts = load.timescale()
earth = planets['earth']

with load.open(hipparcos.URL) as f:
	df = hipparcos.load_dataframe(f)

min_mag = -1

bright_df = df[df['magnitude'] <= min_mag]
bright_stars = Star.from_dataframe(bright_df)

csv = bright_df.to_csv().strip().split('\n')
hips = []
mags = []

for i in range(len(csv) - 1):
	cols = csv[i + 1].split(',')
	hips.append(int(cols[0]))
	mags.append(float(cols[1]))

excepted = 'hip,mag,ra,dec\n'
excepted += '32349,-1.44,6.7695722222222222,-16.747944444444446\n'

def extract(y, m, d, h):
	t = ts.utc(y, m, d, h, 0, 0)
	ra_list, dec_list, _ = earth.at(t).observe(bright_stars).radec(epoch='date')
	ra_list = ra_list.hours
	dec_list = dec_list.degrees
	text = 'hip,mag,ra,dec\n'
	for i in range(len(hips)):
		hip = hips[i]
		mag = mags[i]
		ra = ra_list[i]
		dec = dec_list[i]
		line = str(hip) + ',' + str(mag) + ',' + str(ra) + ',' + str(dec)
		text += line + '\n'
	print('Expected:')
	print(excepted)
	print('Actual:')
	print(text)

extract(2023, 1, 1, 0)
