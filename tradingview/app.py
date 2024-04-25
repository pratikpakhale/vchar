import urllib.parse
import requests
from flask import Flask, request, jsonify
from tradingview_ta import TA_Handler
from config import config

app = Flask(__name__)

@app.route('/tradingview', methods=['GET'])
def get_analysis():
    company_name = request.args.get('company_name')
    interval = request.args.get('interval')
    print(company_name, interval)
    if not all([company_name, interval]):
        return 'Missing required parameters', 400

    try:

        # Retrieve symbol from Screener API
        url = f"https://www.screener.in/api/company/search/?q={company_name}"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            # print(data)
            symbol = data[0]['url'].split('/')[-3] # Extract symbol from API response
            print(symbol)
        else:
            return jsonify({"error": "Failed to fetch data from Screener API"}), response.status_code

        print("hereee")
        # Get TradingView analysis
        handler = TA_Handler(
            symbol=symbol,
            exchange="NSE",
            screener="india",
            interval=interval
        )
        analysis = handler.get_analysis()

        return jsonify({
    'values': {
        'opening_price': analysis.indicators['open'],
        'closing_price': analysis.indicators['close'],
        'momentum': analysis.indicators['Mom'],
        'rsi': analysis.indicators['RSI'],
        'macd': analysis.indicators['MACD.macd'],
        'moving_average': analysis.indicators['Recommend.MA'],
        'lower_bb': analysis.indicators['BB.lower'],
        'upper_bb': analysis.indicators['BB.upper'],
        'stochastic': analysis.indicators['Stoch.K'],
        'adx': analysis.indicators['ADX'],
        'volume': analysis.indicators['volume']
    },
    'symbol': symbol
})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=config['tradingview']['port'], host='0.0.0.0')
