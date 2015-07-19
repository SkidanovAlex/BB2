import json
import requests

def generateContent():
    res = {}
    res["from"] = { "name": "BattleBrains" , "email": "sandbox@sparkpostbox.com"}
    res["subject"] = "Your CodeReview puzzle"
    res["text"] = """
tatic int asn1_cb(const char *elem, int len, 
  void *bitstr)
{
  ....
  case ASN1_GEN_FLAG_FORMAT:
  if (!strncmp(vstart, "ASCII", 5))
    arg->format = ASN1_GEN_FORMAT_ASCII;
  else if (!strncmp(vstart, "UTF8", 4))
    arg->format = ASN1_GEN_FORMAT_UTF8;
  else if (!strncmp(vstart, "HEX", 3))
    arg->format = ASN1_GEN_FORMAT_HEX;
  else if (!strncmp(vstart, "BITLIST", 3))
    arg->format = ASN1_GEN_FORMAT_BITLIST;
  else
  ....
}
"""
    res["html"] = """
<body>
<p>
<pre>
static int asn1_cb(const char *elem, int len, 
  void *bitstr)
{
  ....
  case ASN1_GEN_FLAG_FORMAT:
  if (!strncmp(vstart, "ASCII", 5))
    arg->format = ASN1_GEN_FORMAT_ASCII;
  else if (!strncmp(vstart, "UTF8", 4))
    arg->format = ASN1_GEN_FORMAT_UTF8;
  else if (!strncmp(vstart, "HEX", 3))
    arg->format = ASN1_GEN_FORMAT_HEX;
  else if (!strncmp(vstart, "BITLIST", 3))
    arg->format = ASN1_GEN_FORMAT_BITLIST;
  else
  ....
}
</pre>
</p>
</body>
"""
    return res

def generateRecipients():
    recipients = []
    recipients.append({"address": {"email": "skidanovalexander@gmail.com", "name": "SkidanovAlex"}})
    return recipients

def generateEmail():
    res = {}
    res["substitution_data"] = {}
    res["content"] = generateContent()
    res["recipients"] = generateRecipients()
    return res

def sendEmail():
    email = generateEmail()

    url = "https://api.sparkpost.com/api/v1/transmissions"
    print json.dumps(email)
    headers = {'Content-Type': 'application/json', 'Authorization': 'b8ad75e62a7b0d8da96155f7944827daff9711ff'}
    r = requests.post(url, data=json.dumps(email), headers=headers)
    print r.text
    r.raise_for_status()
