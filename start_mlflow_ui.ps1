Write-Host "======================================================================" -ForegroundColor Green
Write-Host "Launching Smart Irrigation MLflow Tracking Dashboard..." -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "Experiment: Smart_Irrigation_Optimization"
Write-Host "Database: sqlite:///mlruns/mlflow.db"
Write-Host "URL: http://127.0.0.1:5000"
Write-Host "Press Ctrl+C to stop the dashboard server."
Write-Host "======================================================================" -ForegroundColor Green

python -m mlflow server --backend-store-uri sqlite:///mlruns/mlflow.db --port 5000 --host 127.0.0.1
