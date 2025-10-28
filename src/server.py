
# from fastapi import FastAPI, File, UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# import uvicorn
# import pandas as pd
# import numpy as np
# import cv2, io
# from scipy.signal import find_peaks
# from PIL import Image
# import joblib
# import tempfile

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load Decision Tree model
# model = joblib.load("decision_tree_all_cardio_features.pkl")

# # --- CTG signal extraction ---
# def extract_ctg_signals(image_path, fhr_top_ratio=0.55, bpm_per_cm=30, toco_per_cm=25,
#                         paper_speed_cm_min=2, fhr_min_line=50):
#     img = cv2.imread(image_path)
#     if img is None:
#         raise ValueError("Failed to read image")

#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#     if np.mean(gray) > 127:
#         gray = cv2.bitwise_not(gray)
#     height, width = gray.shape
#     fhr_img = gray[0:int(fhr_top_ratio * height), :]
#     uc_img = gray[int(fhr_top_ratio * height):, :]

#     def extract_signal(trace_img):
#         _, thresh = cv2.threshold(trace_img, 50, 255, cv2.THRESH_BINARY)
#         h, w = thresh.shape
#         signal = []
#         for x in range(w):
#             y_pixels = np.where(thresh[:, x] > 0)[0]
#             y = np.median(y_pixels) if len(y_pixels) > 0 else np.nan
#             signal.append(y)
#         signal = pd.Series(signal).interpolate(limit_direction='both').values
#         return h - signal

#     fhr_signal = extract_signal(fhr_img)
#     uc_signal = extract_signal(uc_img)

#     px_per_cm = height / 10.0
#     bpm_per_px = bpm_per_cm / px_per_cm
#     toco_per_px = toco_per_cm / px_per_cm
#     fhr_signal = fhr_min_line + fhr_signal * bpm_per_px
#     uc_signal = uc_signal * toco_per_px
#     px_per_sec = (paper_speed_cm_min / 60.0) * px_per_cm
#     time_axis = np.arange(len(fhr_signal)) / px_per_sec
#     return fhr_signal, uc_signal, time_axis


# def compute_model_features(fhr_signal, uc_signal, time_axis):
#     features = {}
#     duration = time_axis[-1] - time_axis[0]
#     baseline = np.mean(fhr_signal)
#     features['Baseline value (SisPorto)'] = round(float(baseline), 2)
#     fhr_diff = np.diff(fhr_signal)
#     features['Mean value of long-term variability (SisPorto)'] = round(np.std(fhr_signal), 2)
#     features['Mean value of short-term variability (SisPorto)'] = round(np.mean(np.abs(fhr_diff)), 2)
#     features['Percentage time with abnormal short-term variability (SisPorto)'] = round(np.sum(np.abs(fhr_diff) > 25) / len(fhr_diff), 2)
#     features['Percentage time with abnormal long-term variability (SisPorto)'] = round(np.sum(np.abs(fhr_signal - baseline) > 20) / len(fhr_signal), 2)
#     features['Accelerations (SisPorto)'] = 0
#     features['Uterine contractions (SisPorto)'] = 0
#     features['Fetal movements (SisPorto)'] = 0
#     features['Light decelerations (raw)'] = 0
#     features['Severe decelerations (raw)'] = 0
#     features['Prolonged decelerations (raw)'] = 0
#     features['Repetitive decelerations (raw)'] = 0
#     # placeholder histogram features
#     for col in [ 'Histogram width','Histogram minimum frequency','Histogram maximum frequency',
#                  'Number of histogram peaks','Number of histogram zeros','Histogram mode',
#                  'Histogram mean','Histogram median','Histogram variance',
#                  'Histogram tendency (-1=left asymmetric; 0=symmetric; 1=right asymmetric)' ]:
#         features[col] = 0
#     return features


# @app.post("/predict/")
# async def predict_ctg(file: UploadFile = File(...)):
#     contents = await file.read()
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
#         tmp.write(contents)
#         tmp_path = tmp.name

#     fhr, uc, t = extract_ctg_signals(tmp_path)
#     features = compute_model_features(fhr, uc, t)
#     df = pd.DataFrame([features])

#     # align with model columns
#     for col in model.feature_names_in_:
#         if col not in df.columns:
#             df[col] = 0
#     df = df[model.feature_names_in_]

#     pred = model.predict(df)[0]
#     label = {1: "Normal", 2: "Suspect", 3: "Pathologic"}[pred]
#     return {"prediction": int(pred), "label": label}

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import pandas as pd
import numpy as np
import cv2, io
from scipy.signal import find_peaks
from PIL import Image
import joblib
import tempfile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained Decision Tree model
model = joblib.load("decision_tree_all_cardio_features.pkl")

# --- Signal extraction ---
def extract_ctg_signals(image_path, fhr_top_ratio=0.55, bpm_per_cm=30, toco_per_cm=25,
                        paper_speed_cm_min=2, fhr_min_line=50):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Failed to read image")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    if np.mean(gray) > 127:
        gray = cv2.bitwise_not(gray)

    height, width = gray.shape
    fhr_img = gray[0:int(fhr_top_ratio * height), :]
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
    return fhr_signal, uc_signal, time_axis


def compute_model_features(fhr_signal, uc_signal, time_axis):
    features = {}
    duration = time_axis[-1] - time_axis[0]
    baseline = np.mean(fhr_signal)
    features['Baseline value (SisPorto)'] = round(float(baseline), 2)
    fhr_diff = np.diff(fhr_signal)
    features['Mean value of long-term variability (SisPorto)'] = round(np.std(fhr_signal), 2)
    features['Mean value of short-term variability (SisPorto)'] = round(np.mean(np.abs(fhr_diff)), 2)
    features['Percentage time with abnormal short-term variability (SisPorto)'] = round(np.sum(np.abs(fhr_diff) > 25) / len(fhr_diff), 2)
    features['Percentage time with abnormal long-term variability (SisPorto)'] = round(np.sum(np.abs(fhr_signal - baseline) > 20) / len(fhr_signal), 2)
    features['Accelerations (SisPorto)'] = 0
    features['Uterine contractions (SisPorto)'] = 0
    features['Fetal movements (SisPorto)'] = 0
    features['Light decelerations (raw)'] = 0
    features['Severe decelerations (raw)'] = 0
    features['Prolonged decelerations (raw)'] = 0
    features['Repetitive decelerations (raw)'] = 0
    for col in ['Histogram width','Histogram minimum frequency','Histogram maximum frequency',
                 'Number of histogram peaks','Number of histogram zeros','Histogram mode',
                 'Histogram mean','Histogram median','Histogram variance',
                 'Histogram tendency (-1=left asymmetric; 0=symmetric; 1=right asymmetric)']:
        features[col] = 0
    return features


@app.post("/predict/")
async def predict_ctg(file: UploadFile = File(...)):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    fhr, uc, t = extract_ctg_signals(tmp_path)
    features = compute_model_features(fhr, uc, t)
    df = pd.DataFrame([features])

    # Align with model features
    for col in model.feature_names_in_:
        if col not in df.columns:
            df[col] = 0
    df = df[model.feature_names_in_]

    pred = model.predict(df)[0]
    label = {1: "Normal", 2: "Suspect", 3: "Pathologic"}[pred]

    return {
        "prediction": int(pred),
        "label": label,
        "features": features
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
