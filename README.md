# Law Suite

Law Suite is an AI-powered legal research tool that converts natural language descriptions of legal situations into relevant sections from the Bhartiya Nyaya Sahita (BNS) 2023. The platform uses advanced natural language processing and machine learning to understand user queries in plain language and map them to appropriate legal codes and clauses.

## Key Features

- **Natural Language Understanding**: Convert everyday descriptions of legal situations into formal BNS sections
- **Intelligent BNS Mapping**: Automatically identifies relevant sections of the Bhartiya Nyaya Sahita based on user descriptions
- **Real-time Processing**: Instant analysis of natural language queries with immediate BNS recommendations
- **User-friendly Interface**: Modern, responsive design that allows users to describe situations in their own words
- **Prediction Logging**: Automatic logging of all predictions for analysis and improvement
- **Maintenance Mode**: Built-in maintenance mode for system updates
- **Mobile Responsive**: Fully responsive design that works across all devices

## Example Usage

Users can input queries in natural language like:
- "Someone broke into my house and stole my belongings"
- "I was threatened with violence if I didn't pay money"
- "A person is harassing me on social media"

The system will analyze these natural language descriptions and recommend relevant BNS sections and corresponding acts.

## Tech Stack

| **Category**              | **Technology**                                                                 |
|---------------------------|---------------------------------------------------------------------------------|
| **Backend**               | Flask (Python)                                                                  |
| **Natural Language Processing** | NLTK                                                                           |
| **Machine Learning**      | scikit-learn                                                                    |
| **Frontend**              | HTML5, CSS3, JavaScript                                                         |
| **Database**              | Excel (for dataset and logging)                                                 |
| **UI Libraries**          | Tailwind CSS, GSAP (GreenSock Animation Platform), Locomotive Scroll, jQuery     |


## Prerequisites

- Python 3.8 or higher
- Git

## Installation

1. Clone the repository:
```git
git clone https://github.com/daksh-deep/Law-Suite
cd law-suite
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Download required NLTK data:
```python
python -c "import nltk; nltk.download('stopwords'); nltk.download('wordnet'); nltk.download('omw-1.4')"
```

5. Ensure required directories exist:
```bash
mkdir -p prediction_log
```

## Project Structure

```
daksh-deep-Law-Suite/
├── app.py                 # Main Flask application
├── models/               # ML model files
│   ├── bns_vectorizer.pkl  # Text vectorization model
│   └── bns_model.pkl       # BNS prediction model
├── requirements.txt      # Python dependencies
├── Dataset.xlsx         # BNS dataset and mappings
├── templates/           # HTML templates
│   ├── maintenance.html
│   ├── contact.html
│   ├── home.html
│   ├── about.html
│   └── terms.html
├── model.py             # NLP and ML model implementation
└── static/             # Static assets
    ├── resouces/       # Fonts and media
    ├── style.css       # Main stylesheet
    └── script.js       # Frontend JavaScript
```

## Configuration

The application can be configured through the following methods:

1. **Maintenance Mode**: Toggle using the `/set-maintenance/<mode>` endpoint where `mode` is either 'on' or 'off'
2. **Model Parameters**: Adjust in `model.py`:
   - `multiplier`: Controls prediction probability scaling (default: 1000)
   - `threshold`: Minimum probability threshold for predictions (default: 3.0)

## Running the Application

1. Start the Flask server:
```bash
python app.py
```

2. Access the application at `http://localhost:7000`

## API Endpoints

- `GET /`: Home page with query interface
- `POST /predict`: Submit natural language text for BNS analysis
- `GET /set-maintenance/<mode>`: Toggle maintenance mode
- `GET /terms`: Terms of service
- `GET /about`: About page
- `GET /contact`: Contact information

## Natural Language Processing Pipeline

1. **Text Preprocessing**:
   - Removal of special characters
   - Conversion to lowercase
   - Tokenization
   - Stopword removal
   - Lemmatization

2. **Feature Extraction**:
   - TF-IDF vectorization of preprocessed text
   - Vocabulary based on legal terminology

3. **Prediction**:
   - Machine learning model predicts relevant BNS sections
   - Confidence scoring for recommendations
   - Mapping to corresponding legal acts

## Logging

Predictions are automatically logged to `prediction_log/log.xlsx` with the following information:
- Original natural language prompt
- Predicted BNS sections
- Mapped legal acts

## Security Features

1. **Maintenance Mode**: Prevents user interactions during updates
2. **Input Validation**: Validates all user inputs before processing
3. **Error Handling**: Comprehensive error handling and user feedback
4. **Context Menu Protection**: Prevents unauthorized content copying

## Browser Compatibility

This project is compatible with the following browsers:

- Chrome (latest stable)
- Brave (latest stable)
- Safari (latest stable)
- Edge (latest stable)

It is recommended to use the latest stable versions of these browsers for optimal performance and full feature support.

## Known Limitations

1. Excel-based storage may not be suitable for high traffic
2. Prediction accuracy depends on query clarity and legal context
3. Limited to Indian legal system and BNS 2023
4. Requires clear and specific legal terminology for best results
5. May not capture complex legal nuances in very informal language

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open-source and available under the MIT License.

## Support

For support:
- Check Daksh's [LinkedIn](https://www.linkedin.com/in/daksh-deep-791a1a298/) 
- Submit issues on [GitHub](https://github.com/daksh-deep/Law-Suite)

## Authors
For any inquiries or support, please contact:
- Daksh Deep: [dakshsaxena04@gmail.com](mailto:dakshsaxena04@gmail.com)
- Yashvi Arya

## Acknowledgments

- Ministry of Home Affairs, Government of India
- Contributors to the Bhartiya Nyaya Sahita 2023
