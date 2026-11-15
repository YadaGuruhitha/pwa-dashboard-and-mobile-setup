@echo off
echo ======================================================================
echo Launching Smart Irrigation MLflow Tracking Dashboard...
echo ======================================================================
echo Experiment: Smart_Irrigation_Optimization
echo Database:   sqlite:///mlruns/mlflow.db
echo URL:        http://127.0.0.1:5000
echo ======================================================================
python -m mlflow server --backend-store-uri sqlite:///mlruns/mlflow.db --port 5000 --host 127.0.0.1
pause
