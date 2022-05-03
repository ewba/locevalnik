# !/bin/env python3
# calculates a frequency summary, optionally relative by waste type
import csv 
import json 
import os 


rel=True

total = [] # line count, 160
tc = [0]*9 # deep init, so the objects don't get linked
for i in range(160):
	total.append([0, list(tc)])
	total[i][0] = i+1

file = open("komunale.json", "rb")
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
result = []
for t in total:
	cnt = sum(t[1])
	if cnt == 0:
		continue
	if rel:
		out=""
		out2 = []
		for c in t[1]:
			out+= str(float(c*100) / float(cnt))[:4] + " " 
			out2.append(round(((c*100)/cnt),1))
		print(out)
		result.append(out2)
	else:
		print(t[0], t[1], cnt)

# Save results to csv file 
with open(os.getcwd()+"/assets/data/cat-shares.csv", "w", newline='') as f:
    writer = csv.writer(f)
    writer.writerows(result)
