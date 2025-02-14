Linter tests must pass before your PR is merged. 

TODO: 
cloudform, terraform, kubernetes (EKS), rn only ECS and ECR

Run frontend: 

```
cd frontend
# setup .env file
npm i
npm run dev
```

Run backend: 
```
cd backend
# setup .env file
python3 -m venv env
source env/bin/activate
python3 install -r requirements.txt
python3 app.py
```

Frontend hosted at https://everythingcalendar.org
Backend hosted at https://backend.everythingcalendar.org
Email team@everythingcalendar.org with questions


