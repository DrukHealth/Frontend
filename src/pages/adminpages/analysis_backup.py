from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/analysis")
def get_analysis():
    """
    Generate random NSP prediction data between Jan 2024 and today.
    Each month will have randomized N, S, and P counts.
    """
    start_date = datetime(2024, 1, 1)
    end_date = datetime.today()

    # Generate all months between 2024-01 and now
    months = []
    current = start_date
    while current <= end_date:
        months.append(current.strftime("%Y-%m"))
        # Move to the next month
        if current.month == 12:
            current = datetime(current.year + 1, 1, 1)
        else:
            current = datetime(current.year, current.month + 1, 1)

    # Randomized data per month
    predictions = []
    for month in months:
        N = random.randint(10, 100)
        S = random.randint(5, 40)
        P = random.randint(1, 20)
        predictions.append({
            "date": month,
            "N": N,
            "S": S,
            "P": P
        })
      
    total_patients = sum(d["N"] + d["S"] + d["P"] for d in predictions)
    positive_cases = sum(d["P"] for d in predictions)
    accuracy = round((1 - positive_cases / total_patients) * 100, 2)

    return {
        "patients": total_patients,
        "positive_cases": positive_cases,
        "accuracy": accuracy,
        "predictions": predictions
    }
