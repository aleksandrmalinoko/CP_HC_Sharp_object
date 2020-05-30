from natasha import MoneyExtractor

extractor = MoneyExtractor()
lines: list = [
    "30 мая мой сахар был равен 10",
    "Встала сегодня в 8 утра , сахар был 4.5"
    "покушала 3 половника супа, сахар поднялся до 7,6"
    "уколола одну единичку короткого, опустился до 6"
    "сахар 3,9, съем сахара одну ложку"
    "сахар три и девять, съем сахара одну ложку"
]
for line in lines:
    matches = extractor(line)
    match = matches[0]
    fact = match.fact.normalized.as_json
    print(line)
