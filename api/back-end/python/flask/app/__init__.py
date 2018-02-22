from flask import Flask, request, jsonify
from flask_cors import CORS

import chargebee

app = Flask(__name__)
CORS(app)

chargebee.configure("test_0kMishobocuobez4OlrbwultwfHfT51fE", "vivek1-test")

@app.route('/')
def hello_world():
  return 'Hello World'

@app.route('/api/generate_checkout_new_url', methods=['POST'])
def generate_checkout_new_url():
  result = chargebee.HostedPage.checkout_new({
    "subscription" : {
        "plan_id" : request.form.get("plan_id")
    }
  })
  hosted_page = result._response['hosted_page']
  return jsonify(hosted_page)

@app.route('/api/generate_checkout_existing_url', methods=['POST'])
def generate_checkout_existing_url():
  result = chargebee.HostedPage.checkout_existing({
    "subscription" : {
        "id" : "1mhuIhIQhDeD9KFIJ"
    }
  })
  hosted_page = result._response['hosted_page']
  return jsonify(hosted_page)

@app.route('/api/generate_update_payment_method_url', methods=['POST'])
def generate_update_payment_method_url():
  result = chargebee.HostedPage.manage_payment_sources({
    "customer" : {
        "id" : "cbdemo_sir"
    }
  })
  hosted_page = result._response['hosted_page']
  return jsonify(hosted_page)

@app.route('/api/generate_portal_session', methods=['POST'])
def generate_portal_session():
  result = chargebee.PortalSession.create({
    "customer" : {
        "id" : "cbdemo_sir"
    }
  })
  hosted_page = result._response['portal_session']
  return jsonify(hosted_page)
