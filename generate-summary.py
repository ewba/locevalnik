# !/bin/env python3
# calculates a frequency summary, optionally relative by waste type
import csv
import json # needed for json import
import os # needed to find working directory


rel=True

total = [] # line count, 160
tc = [0]*9 # deep init, so the objects don't get linked
for i in range(160):
	total.append([0, list(tc)])
	total[i][0] = i+1

file = open(os.getcwd()+"\\assets\\data\\komunale.json", "rb")
data = json.load(file)
for line in data:
	record = data[line]['odpadki']

	# convert o123:2 to list
	b = record.split(" ")
	c = map(lambda v: v.split(":"), b)
	i=1
	for v in c:
		if v[0] == '':
#			i += 1
			continue
		try:
			idx = int(v[0][1:])
		except:
			print(111, v)
			print(112, v[0])
		if idx != i:
			print("missing value!", idx, i)
		val = int(v[1])
		try:
			total[idx-1][1][val] += 1
		except:
			print(len(total), idx)
		i += 1

# just copy values to jure.xls
for t in total:
	cnt = sum(t[1])
	if cnt == 0:
		continue
	if rel:
		out=""
		for c in t[1]:
			out+= str(float(c*100) / float(cnt))[:4] + " " 
		print(out)
	else:
		print(t[0], t[1], cnt)
