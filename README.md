

SCANOVA – AI-Powered Supermarket Self-Checkout System

A computer-vision based self-checkout application that identifies fruits and vegetables without barcodes and automates the entire billing process. Built using TensorFlow/Keras, Flask, and React.js.


---

🚀 Overview

Traditional supermarket checkouts depend on manual barcode scanning, leading to long queues and slow billing.
Scanova solves this by enabling contactless, AI-driven self-checkout using a camera that identifies produce in real time.

This project integrates:
✅ A trained CNN model for item classification
✅ A Flask backend API for prediction and billing
✅ A modern React.js frontend for scanning and checkout
✅ A lightweight database module for prices, cart, and receipts


---

✨ Features

Real-time produce scanning using webcam

AI-based item recognition with confidence score

Automatic cart update + pricing

Checkout summary & payment simulation

Receipt generation (ID, timestamp, total)

Modern UI with smooth styling

Modular architecture (Frontend + Backend + Model)



---

🧠 Tech Stack

Frontend: React.js, JavaScript, HTML/CSS
Backend: Python, Flask (REST API)
AI/ML: TensorFlow/Keras, OpenCV
Database: Python Dictionary (Mock DB)
Others: Webcam Integration, JSON APIs


---

🏗️ System Architecture

Camera → React Frontend → Flask API → CNN Model → Prediction → Cart → Checkout → Receipt


---

📂 Project Structure

/model/                → Trained CNN model (fruit_class.keras)
/backend/              → Flask server, API endpoints, image processing
/frontend/             → React UI, camera module, cart system
/database/             → Product list, prices, emoji mapping
README.md


---

🔧 How It Works

1. Scanning

User holds produce in front of the camera

React captures the frame and sends it as Base64 to Flask


2. Prediction (Flask + CNN)

Flask decodes the image

Preprocesses it (resize, normalize)

Passes to the CNN model

Returns:

item name

price

emoji

confidence



3. Cart System

Detected items added automatically

Quantity adjustments

Subtotal, tax, and total calculated


4. Checkout

User selects payment method

Receipt is generated with:

Receipt ID

Timestamp

Total amount




---

🖥️ Screenshots

> (Upload your screenshots in GitHub → Add links here)



Real-time scanning interface

Shopping cart

Checkout summary

Payment success screen



---

🏁 How to Run the Project

Backend Setup (Flask)

cd backend
pip install -r requirements.txt
python app.py

Frontend Setup (React)

cd frontend
npm install
npm start

Model

Place the trained model file:

/model/fruit_class.keras


---

📘 Dataset Used

Kaggle Fruit Recognition Dataset

Custom image samples for improved performance



---

📌 Future Enhancements

Deploy on Raspberry Pi

Multi-item detection in a single frame

Real payment gateway integration

Cloud connectivity (Firebase/AWS)

Voice-guided checkout

Weight sensor verification



---

🤝 Contributions

Pull requests are welcome!
If you’d like to improve the model accuracy, UI, or architecture, feel free to contribute.


---

🧑‍💻 Author

Vidhya E S
AI/ML Enthusiast | Computer Vision | PG Diploma in AI & ML