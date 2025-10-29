from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from PIL import Image
import io
import numpy as np
import tensorflow as tf
import pandas as pd
import os

app = FastAPI()

# # --- Allow frontend access ---
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Adjust in production
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- Load CTG model (adjust path) ---
# MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ctg_model.h5")
# model = tf.keras.models.load_model(MODEL_PATH)

# # --- Endpoint: CTG prediction ---
# @app.post("/predict/")
# async def predict_ctg(file: UploadFile = File(...)):
#     try:
#         contents = await file.read()
#         image = Image.open(io.BytesIO(contents)).convert("RGB")
#         image = image.resize((224, 224))
#         image_array = np.expand_dims(np.array(image) / 255.0, axis=0)

#         prediction = model.predict(image_array)
#         result = float(prediction[0][0])

#         return {"prediction": result}
#     except Exception as e:
#         return JSONResponse(status_code=500, content={"error": str(e)})

# --- Endpoint: Data analysis ---
# @app.get("/api/analysis")
# def analyze_data():
#     try:
#         # File path: src/assets/fatal_health.csv
#         csv_path = os.path.join(os.path.dirname(__file__), "assets", "fatal_health.csv")
#         df = pd.read_csv(csv_path)

#         total_rows = len(df)
#         columns = list(df.columns)
#         summary = df.describe(include='all').fillna(0).to_dict()

#         result = {
#             "total_rows": total_rows,
#             "columns": columns,
#             "summary": summary
#         }
#         return result
#     except FileNotFoundError:
#         return JSONResponse(status_code=404, content={"error": "fatal_health.csv not found"})
#     except Exception as e:
#         return JSONResponse(status_code=500, content={"error": str(e)})

# # --- Run the server ---
# if __name__ == "__main__":
#     uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
