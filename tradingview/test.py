import requests

url = "http://localhost:5123/tradingview"
params = {
    "company_name": "tata motors",
    "interval": "1d"
}

response = requests.get(url, params=params)

print(response.json())  # Assuming the response is in text format

   

 