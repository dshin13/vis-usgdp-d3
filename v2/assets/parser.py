import csv
import re
import json

data_json = {}
quarter_code = {
    'I': '01-01',
    'II': '04-01',
    'III': '07-01',
    'IV': '10-01'
}

def parse_data(row, level, legend1, legend2):
      
    return {
        'name': row[1].strip(),
        'level': level,
        'values': [{'date': legend1[x[0]] + '-' + quarter_code[legend2[x[0]]],
                    'value': float(x[1])}
                   for x in enumerate(row[2:])],
        'children': []
    }

with open('dataset.csv', 'r') as csvfile:
    data = csv.reader(csvfile)
    
    # title
    data_json['title'] = next(data)[0]
    # unit
    data_json['unit'] = next(data)[0]
    # author
    data_json['author'] = next(data)[0]
    # release_date
    data_json['release_date'] = next(data)[0]

    legend1= next(data)[2:]
    legend2= next(data)[2:]
    
    # initialize data with first row
    row1 = next(data)
    data_json['data'] = parse_data(row1, -1, legend1, legend2)
    
    # stack to maintain parent node reference while parsing
    stack = [data_json['data']]
    
    for row in data:
        if (row[1]=="Addenda:"):
            break
            
        # decode row level from whitespace
        level = len(re.search(r'^[ ]*', row[1])[0])//2
        
        while not (level > stack[-1]['level'] or stack==[]):
            stack.pop()

        # add data to dictionary
        stack[-1]['children'].append(parse_data(row, level, legend1, legend2))
        
        # add node reference to stack
        stack.append(stack[-1]['children'][-1])
        
# write out to json
with open('dataset.json', 'w') as f:
    json.dump(data_json, f)