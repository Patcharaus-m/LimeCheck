from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import io
from PIL import Image

app = FastAPI()

# --- ตั้งค่า CORS เพื่อให้ React (Port 5173) คุยกับ Python (Port 8000) ได้ ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # หรือใส่เป็น ["http://localhost:5173"] เพื่อความปลอดภัย
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- โหลดโมเดลที่คุณ Arm เทรนมา (20 รอบ หรือ 150 รอบ) ---
# มั่นใจว่าไฟล์ best.pt อยู่ในโฟลเดอร์เดียวกับ main.py นะครับ
model = YOLO("best.pt")

@app.get("/")
async def root():
    return {"message": "NorthGarden AI API is running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # 1. อ่านไฟล์ภาพที่ส่งมาจาก React
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    # 2. ใช้ YOLOv8 ประมวลผล
    results = model(image)

    # 3. ดึงข้อมูลสรุปผล
    predictions = []
    for r in results:
        for box in r.boxes:
            conf = float(box.conf[0])      # ค่าความมั่นใจ (0.0 - 1.0)
            cls = int(box.cls[0])           # เลข Class (0, 1, 2...)
            label = model.names[cls]        # ชื่อ Class (เช่น Ripe, Unripe)
            
            predictions.append({
                "label": label,
                "confidence": round(conf * 100, 2), # ปรับเป็น % เช่น 95.50
                "box": box.xyxy[0].tolist()         # พิกัดกรอบ [x1, y1, x2, y2]
            })

    return {"predictions": predictions}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)