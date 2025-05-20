import pandas as pd
import joblib
import os
import json

current_dir = os.path.dirname(__file__)
model_path = os.path.join(current_dir, "model.joblib")
model = joblib.load(model_path)

csv_path = os.path.join(current_dir, "export-ml.csv")
df = pd.read_csv(csv_path)

target_employee_id = 23

employee_data = df[df["employeeId"] == target_employee_id].iloc[0]

specialist_ids = df["specialistId"].unique()
recommendation_data = []

for spec_id in specialist_ids:
    specialist_row = df[df["specialistId"] == spec_id].iloc[0]

    row = {
        "employeeDepartment": employee_data["employeeDepartment"],
        "preferredGender": employee_data["preferredGender"],
        "preferredTherapyStyle": employee_data["preferredTherapyStyle"],
        "preferredFormation": employee_data["preferredFormation"],
        "specialistGender": specialist_row["specialistGender"],
        "formation": specialist_row["formation"],
        "therapyStyle": specialist_row["therapyStyle"],
        "preferredMinAge": employee_data["preferredMinAge"],
        "preferredMaxAge": employee_data["preferredMaxAge"],
        "specialistAge": specialist_row["specialistAge"]
    }

    row_df = pd.DataFrame([row])
    predicted_score = model.predict(row_df)[0]
    recommendation_data.append((spec_id, predicted_score))

recommendation_data.sort(key=lambda x: x[1], reverse=True)

result_json = json.dumps([
    {"specialistId": int(spec_id), "score": float(round(score, 2))}
    for spec_id, score in recommendation_data[:3]
])
print(result_json)
