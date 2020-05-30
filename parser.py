import re

lines: list = [
    "30 мая мой сахар был равен 10",
    "Встала сегодня в 8 утра , сахар был 4.5",
    "покушала 3 половника супа, сахар поднялся до 7,6",
    "уколола одну единичку короткого, сахар опустился до 6",
    "сахар 3,9, съем сахара одну ложку",
    "сахар три и девять, съем сахара одну ложку"
]

for line in lines:
    line = line.replace(',', '.')
    match = re.search('сахар.*?(\d.*\d+)|сахар.*?(\d)', line)
    sugar = float()
    try:
        if match.group(1):
            sugar = float(match.group(1))
        elif match.group(2):
            sugar = float(match.group(2))
    except AttributeError as e:
        continue
    print(sugar)
