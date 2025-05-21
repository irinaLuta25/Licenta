import sys
import json
import pandas as pd
import joblib

model = joblib.load("ML/model.joblib")

if len(sys.argv) < 2:
    print(json.dumps({"error": "Missing payload"}))
    exit(1)

try:
    payload_json = sys.argv[1].replace('\\"', '"')
    data = json.loads(payload_json)
except Exception as e:
    print(json.dumps({"error": "Invalid JSON", "details": str(e)}))
    exit(1)

employee = data["employee"]
specialists = data["specialists"]

recommendations = []

for specialist in specialists:
    if (
        employee["preferredGender"] and specialist["gender"] != employee["preferredGender"]
    ) or (
        employee["preferredFormation"] and specialist["formation"] != employee["preferredFormation"]
    ) or (
        employee["preferredTherapyStyle"] and specialist["therapyStyle"] != employee["preferredTherapyStyle"]
    ) or (
        employee["preferredMinAge"] and specialist["age"] < employee["preferredMinAge"]
    ) or (
        employee["preferredMaxAge"] and specialist["age"] > employee["preferredMaxAge"]
    ):
        continue  

    row = {
        "employeeDepartment": employee["department"],
        "preferredGender": employee["preferredGender"],
        "preferredTherapyStyle": employee["preferredTherapyStyle"],
        "preferredFormation": employee["preferredFormation"],
        "preferredMinAge": employee["preferredMinAge"],
        "preferredMaxAge": employee["preferredMaxAge"],
        "specialistGender": specialist["gender"],
        "formation": specialist["formation"],
        "therapyStyle": specialist["therapyStyle"],
        "specialistAge": specialist["age"]
    }

    df = pd.DataFrame([row])
    score = model.predict(df)[0]
    recommendations.append((specialist["id"], float(round(score, 2))))

recommendations.sort(key=lambda x: x[1], reverse=True)

result = [
    {"specialistId": spec_id, "score": score}
    for spec_id, score in recommendations[:3]
]

print(json.dumps(result))
