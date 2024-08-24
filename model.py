import joblib
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import pandas as pd

# Load vectorizer and model
vectorizer = joblib.load('vectorizer.pkl')
model = joblib.load('bns_model.pkl')

nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def clean_text(text):
    text = re.sub(r'\W', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    text = text.lower()
    text = ' '.join(lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words)
    return text

def predict_bns(prompt, multiplier=1000, threshold=3.0):
    clean_prompt = clean_text(prompt)
    prompt_tfidf = vectorizer.transform([clean_prompt])
    probabilities = model.predict_proba(prompt_tfidf)
    
    # Sort the probabilities in descending order
    top_indices = probabilities[0].argsort()[::-1]
    top_bns = model.classes_[top_indices]
    top_probabilities = probabilities[0][top_indices] * multiplier  # Normalizing by multiplying 1000
    
    # Threshold to filter results
    filtered_bns = [bns for bns, prob in zip(top_bns, top_probabilities) if prob >= threshold]
    
    return filtered_bns

def getAct(predicted_bns):
    df = pd.read_excel('Dataset.xlsx')

    bns_to_act = dict(zip(df['Clause'], df['Act']))

    results = []

    # Find corresponding Acts for predicted BNS
    for bns in predicted_bns:
        act = bns_to_act.get(bns, 'Not Found')
        results.append({'Predicted BNS': bns, 'Act': act})

    results_df = pd.DataFrame(results)

    return results_df

import pandas as pd
import os

LOG_FILE_PATH = 'prediction_log/log.xlsx'

def log_predictions(prompt, bns_predicted, clause_predicted):
    if not os.path.exists(LOG_FILE_PATH):
        df = pd.DataFrame(columns=['Prompt', 'BNS Predicted', 'Clause Predicted'])
        df.to_excel(LOG_FILE_PATH, index=False, engine='openpyxl')
    
    try:
        df = pd.read_excel(LOG_FILE_PATH, engine='openpyxl')
    except Exception as e:
        print(f"Error reading the Excel file: {e}")
        df = pd.DataFrame(columns=['Prompt', 'BNS Predicted', 'Clause Predicted'])
        df.to_excel(LOG_FILE_PATH, index=False, engine='openpyxl')
    
    # Append new row
    new_row = pd.DataFrame({
        'Prompt': [prompt],
        'BNS Predicted': [', '.join(bns_predicted)],
        'Clause Predicted': [', '.join(clause_predicted)]
    })
    df = pd.concat([df, new_row], ignore_index=True)
    
    # Save and close the file
    df.to_excel(LOG_FILE_PATH, index=False, engine='openpyxl')
