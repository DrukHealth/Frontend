from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import pandas as pd
import numpy as np
import cv2, tempfile
import joblib
import os
from pymongo import MongoClient


# ------------------------------
# FastAPI app
# ------------------------------
app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# Load your trained model once
# ------------------------------
model = joblib.load("decision_tree_all_cardio_features.pkl")

# ------------------------------
# Helper functions for CTG signals
# ------------------------------
def extract_ctg_signals(image_path, fhr_top_ratio=0.55, bpm_per_cm=30, toco_per_cm=25,
                        paper_speed_cm_min=2, fhr_min_line=50):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Failed to read image")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    fhr_img = gray[0:int(fhr_top_ratio * gray.shape[0]), :]
    if np.std(fhr_img) < 15 or np.mean(fhr_img) > 200:
        return None, None, None, False  # Not a CTG image

    if np.mean(gray) > 127:
        gray = cv2.bitwise_not(gray)

    height, width = gray.shape
    uc_img = gray[int(fhr_top_ratio * height):, :]

    def extract_signal(trace_img):
        _, thresh = cv2.threshold(trace_img, 50, 255, cv2.THRESH_BINARY)
        h, w = thresh.shape
        signal = []
        for x in range(w):
            y_pixels = np.where(thresh[:, x] > 0)[0]
            y = np.median(y_pixels) if len(y_pixels) > 0 else np.nan
            signal.append(y)
        signal = pd.Series(signal).interpolate(limit_direction='both').values
        return h - signal

    fhr_signal = extract_signal(fhr_img)
    uc_signal = extract_signal(uc_img)

    px_per_cm = height / 10.0
    bpm_per_px = bpm_per_cm / px_per_cm
    toco_per_px = toco_per_cm / px_per_cm
    fhr_signal = fhr_min_line + fhr_signal * bpm_per_px
    uc_signal = uc_signal * toco_per_px
    px_per_sec = (paper_speed_cm_min / 60.0) * px_per_cm
    time_axis = np.arange(len(fhr_signal)) / px_per_sec

    return fhr_signal, uc_signal, time_axis, True  # True = valid CTG

def compute_model_features(fhr_signal, uc_signal, time_axis):
    features = {}
    baseline = np.mean(fhr_signal)
    fhr_diff = np.diff(fhr_signal)
    features['Baseline value (SisPorto)'] = round(float(baseline), 2)
    features['Mean value of long-term variability (SisPorto)'] = round(np.std(fhr_signal), 2)
    features['Mean value of short-term variability (SisPorto)'] = round(np.mean(np.abs(fhr_diff)), 2)
    features['Percentage time with abnormal short-term variability (SisPorto)'] = round(np.sum(np.abs(fhr_diff) > 25) / len(fhr_diff), 2)
    features['Percentage time with abnormal long-term variability (SisPorto)'] = round(np.sum(np.abs(fhr_signal - baseline) > 20) / len(fhr_signal), 2)
    
    # Fill other features as 0 if required by model
    for col in model.feature_names_in_:
        if col not in features:
            features[col] = 0

    return features

# ------------------------------
# Existing API endpoints
# ------------------------------
@app.get("/api/scans/stats")
def get_scan_stats():
    return {
        "daily": 15,
        "weekly": 80,
        "monthly": 310,
        "yearly": 3700,
        "nspStats": {"Normal": 120, "Suspect": 50, "Pathological": 20}
    }

@app.get("/api/analysis")
def get_analysis():
    start_date = datetime(2024, 1, 1)
    end_date = datetime.today()
    months = []
    current = start_date
    while current <= end_date:
        months.append(current.strftime("%Y-%m"))
        if current.month == 12:
            current = datetime(current.year + 1, 1, 1)
        else:
            current = datetime(current.year, current.month + 1, 1)

    predictions = []
    for month in months:
        N = np.random.randint(10, 100)
        S = np.random.randint(5, 40)
        P = np.random.randint(1, 20)
        predictions.append({"date": month, "N": N, "S": S, "P": P})

    total_patients = sum(d["N"] + d["S"] + d["P"] for d in predictions)
    positive_cases = sum(d["P"] for d in predictions)
    accuracy = round((1 - positive_cases / total_patients) * 100, 2)

    return {
        "patients": total_patients,
        "positive_cases": positive_cases,
        "accuracy": accuracy,
        "predictions": predictions
    }

# ------------------------------
# Prediction endpoint using AI model
# ------------------------------
@app.post("/predict/")
async def predict_ctg(file: UploadFile = File(...)):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        fhr, uc, t, is_ctg = extract_ctg_signals(tmp_path)
        if not is_ctg:
            return {"prediction": 0, "label": "Error: Non CTG image", "features": {}}

        features = compute_model_features(fhr, uc, t)
        df = pd.DataFrame([features])
        df = df[model.feature_names_in_]  # align with model

        pred = model.predict(df)[0]
        label = {1: "Normal", 2: "Suspect", 3: "Pathologic"}.get(pred, "Unknown")

        # ✅ Define record and insert
        record = {
            "timestamp": datetime.utcnow(),
            "label": label,
            "features": features
        }
        ctg_collection.insert_one(record)

        return {"prediction": int(pred), "label": label, "features": features}

    finally:
        os.remove(tmp_path)



# MongoDB client
client = MongoClient("mongodb://localhost:27017")
db = client["ctg_db"]
ctg_collection = db["ctg_records"]

# record = {
#     "timestamp": datetime.utcnow(),
#     "label": label,
#     "features": features,
# }

# ctg_collection.insert_one(record)

# Fetch CTG records
@app.get("/records")
def get_records():
    records = list(ctg_collection.find({}, {"_id": 0}).sort("timestamp", -1))
    return {"records": records}


# ------------------------------
# Run server
# ------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
