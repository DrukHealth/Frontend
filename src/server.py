from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from PIL import Image
import io
import numpy as np
import tensorflow as tf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained CTG model
model = tf.keras.models.load_model("ctg_model.h5")

@app.post("/predict/")
async def predict_ctg(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image = image.resize((224, 224))  # adjust to your model input
    image_array = np.expand_dims(np.array(image)/255.0, axis=0)

    prediction = model.predict(image_array)
    result = float(prediction[0][0])  # adjust depending on your model output
    return {"prediction": result}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
