import json
import requests

def generateContent():
    res = {}
    res["from"] = { "name": "BattleBrains" , "email": "sandbox@sparkpostbox.com"}
    res["subject"] = "BattleBrains game: your move"
    res["text"] = """Your puzzle is here: http://bb2ah8.ddns.net/images/{{puzzle}} """
    res["html"] = """
        <body>
        <p> <img src = 'http://bb2ah8.ddns.net/images/{{puzzle}}'> </p>
        </body>
    """
    return res

def generateDailyHighlightsContent():
    res = {}
    res["from"] = { "name": "BattleBrains" , "email": "sandbox@sparkpostbox.com"}
    res["subject"] = "BattleBrains daily highlights"
    text = open('text.html', 'r').read()
    res["text"] = text
    res["html"] = text

    return res

def generateRecipients():
    recipients = []
    recipients.append({"address": {"email": "skidanovalexander@gmail.com", "name": "SkidanovAlex"}})
    return recipients

imageId = 0
totalImages = 2

def generateEmail():
    global imageId
    res = {}
    imageId = (imageId + 1) % totalImages + 1
    res["substitution_data"] = { 'puzzle': 'puzzles%s.png'%imageId }
    res["content"] = generateContent()
    res["recipients"] = generateRecipients()
    return res

def generateDailyHighlightsEmail():
    res = {}
    res["substitution_data"] = {}
    res["content"] = generateDailyHighlightsContent()
    res["recipients"] = generateRecipients()
    return res

def sendIt(email):
    url = "https://api.sparkpost.com/api/v1/transmissions"
    print json.dumps(email)
    headers = {'Content-Type': 'application/json', 'Authorization': 'b8ad75e62a7b0d8da96155f7944827daff9711ff'}
    r = requests.post(url, data=json.dumps(email), headers=headers)
    print r.text
    r.raise_for_status()

def sendEmail():
    sendIt(generateEmail())

def sendDailyHighlightsEmail():
    sendIt(generateDailyHighlightsEmail())
