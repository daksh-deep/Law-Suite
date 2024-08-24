from flask import Flask, request, jsonify, render_template, redirect, url_for
from model import predict_bns, getAct, log_predictions

app = Flask(__name__)

maintenance_mode = False

def set_maintenance_mode(mode):
    global maintenance_mode
    maintenance_mode = mode

@app.route('/set-maintenance/<mode>')
def set_maintenance(mode):
    if mode == 'on':
        set_maintenance_mode(True)
    elif mode == 'off':
        set_maintenance_mode(False)
    else:
        # Handle invalid mode input
        return "Invalid mode. Use 'on' or 'off'.", 400
    return redirect(url_for('home'))

@app.route('/', methods=['GET', 'POST'])
def home():
    if maintenance_mode:
        return render_template('maintenance.html')
    return render_template('home.html')

@app.route('/predict', methods=['POST'])
def predict():
    if maintenance_mode:
        return jsonify({'error': 'The site is under maintenance. Please try again later.'}), 503
    user_input = request.form.get('user_input')
    predicted_bns = predict_bns(user_input)
    results_df = getAct(predicted_bns)
    results = results_df.to_dict(orient='records')
    log_predictions(
        prompt=user_input, 
        bns_predicted=[r['Predicted BNS'] for r in results], 
        clause_predicted=[r['Act'] for r in results]
    )
    return jsonify({'results': results})

@app.route('/terms')
def terms():
    if maintenance_mode:
        return render_template('maintenance.html')
    return render_template('terms.html')

@app.route('/about')
def about():
    if maintenance_mode:
        return render_template('maintenance.html')
    return render_template('about.html')

@app.route('/contact')
def contact():
    if maintenance_mode:
        return render_template('maintenance.html')
    return render_template('contact.html')

@app.route('/maintenance')
def maintenance():
    return render_template('maintenance.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7000, debug=True)
