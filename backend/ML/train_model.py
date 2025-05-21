import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import r2_score
import joblib
import os

csv_path = os.path.join(os.path.dirname(__file__), 'export-ml.csv')
df = pd.read_csv(csv_path)

df = df[
    ((df["preferredFormation"] == df["formation"]) | (df["preferredFormation"] == "")) &
    ((df["preferredGender"] == df["specialistGender"]) | (df["preferredGender"] == "")) &
    ((df["preferredTherapyStyle"] == df["therapyStyle"]) | (df["preferredTherapyStyle"] == "")) &
    (df["specialistAge"] >= df["preferredMinAge"]) &
    (df["specialistAge"] <= df["preferredMaxAge"])
]

categorical_features = [
    'employeeDepartment',
    'preferredGender',
    'preferredTherapyStyle',
    'preferredFormation',
    'specialistGender',
    'formation',
    'therapyStyle'
]

numerical_features = [
    'preferredMinAge',
    'preferredMaxAge',
    'specialistAge'
]

target = 'satisfactionScore'

X = df[categorical_features + numerical_features]
y = df[target]

preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ],
    remainder='passthrough'
)

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

pipeline.fit(X, y)
y_pred = pipeline.predict(X)
score = r2_score(y, y_pred)
print(f"✅ Modelul a fost antrenat cu acuratete R² = {score:.3f}")

joblib.dump(pipeline, "model.joblib")

