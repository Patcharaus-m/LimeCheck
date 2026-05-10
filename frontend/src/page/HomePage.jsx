import React, { useState, useRef } from 'react';
import { Container, Row, Col, Button, Card, Badge, Spinner } from 'react-bootstrap';
import { Camera, Leaf, Search, AlertTriangle } from 'lucide-react';
import MyNavbar from '../components/MyNavbar';
import WeatherCard from '../components/WeatherCard'; // นำเข้า WeatherCard

const API_URL = 'http://localhost:8000/predict';

// แปลงชื่อ label จากโมเดลเป็นภาษาไทย
const LABEL_MAP = {
  'NC_Ripe_lime': 'มะนาวสุก',
  'NC_Old_lime': 'มะนาวแก่',
  'NC_Young_lime': 'มะนาวอ่อน',
};
const toThaiLabel = (label) => LABEL_MAP[label] || label;

const HomePage = () => {
  const [imageFile, setImageFile] = useState(null);       // ไฟล์ภาพที่เลือก
  const [imagePreview, setImagePreview] = useState(null);  // URL สำหรับแสดงตัวอย่าง
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);    // ผลลัพธ์จาก API
  const [error, setError] = useState(null);                // ข้อผิดพลาด
  const fileInputRef = useRef(null);

  // --- เลือกรูปภาพและเก็บไว้ใน state ---
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ล้าง URL เก่าเพื่อป้องกัน memory leak
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(previewUrl);
      setPredictions(null);
      setError(null);
    }
  };

  // --- ส่งรูปภาพไปยัง API เพื่อวิเคราะห์ ---
  const handleScan = async () => {
    if (!imageFile) return;

    setLoading(true);
    setPredictions(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`เซิร์ฟเวอร์ตอบกลับผิดพลาด (${response.status})`);
      }

      const data = await response.json();
      setPredictions(data.predictions);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  // --- สร้างข้อความสรุปผลลัพธ์ ---
  const renderResultCard = () => {
    if (!predictions || predictions.length === 0) return null;

    // ใช้ผลลัพธ์ที่มี confidence สูงสุด
    const best = predictions.reduce((a, b) => (a.confidence > b.confidence ? a : b));

    return (
      <div className="position-absolute bottom-0 start-0 w-100 p-3">
        <Card className="border-0 shadow-lg py-3 px-3 rounded-4 bg-white text-center animate-up">
          <small className="text-success fw-bold tracking-widest uppercase" style={{ fontSize: '10px', letterSpacing: '2px' }}>
            ผลการวิเคราะห์
          </small>
          <h3 className="text-dark fw-bold m-0 mt-1">
            {best.confidence}% {toThaiLabel(best.label)}
          </h3>
          {predictions.length > 1 && (
            <div className="mt-2 pt-2 border-top">
              {predictions.map((p, i) => (
                <small key={i} className="d-block text-muted">
                  {toThaiLabel(p.label)}: {p.confidence}%
                </small>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <MyNavbar />
      
      <Container className="py-5">
        <Row className="align-items-start g-5"> {/* เปลี่ยนจาก align-items-center เป็น start เพื่อให้ WeatherCard ดันขึ้นบน */}
          
          {/* ฝั่งซ้าย: ข้อความพาดหัว + WeatherCard */}
          <Col lg={6} className="text-center text-lg-start">
            <Badge pill bg="none" className="mb-4 px-3 py-2 border text-success d-inline-flex align-items-center gap-2" style={{ backgroundColor: '#f0fff4' }}>
              <Leaf size={14} /> AI ตรวจความสุกมะนาว
            </Badge>
            <h1 className="fw-black display-3 text-dark mb-2">ตรวจความสุกมะนาว</h1>
            <h1 className="fw-black display-3 text-success mb-4">ง่ายและแม่นยำ</h1>
            <p className="text-muted fs-5 mb-5">
              แค่ถ่ายรูปมะนาว AI ของ NorthGarden จะวิเคราะห์ระดับความสุกให้คุณทันที
            </p>

            {/* --- วาง WeatherCard ไว้ตรงนี้ --- */}
            <WeatherCard />
            
            <div className="p-3 bg-light rounded-4 border-start border-4 border-success mt-4 d-none d-lg-block">
              <p className="m-0 text-secondary small">
                <b>เคล็ดลับ:</b> ควรเลือกสแกนมะนาวในที่ที่มีแสงสว่างเพียงพอเพื่อให้ AI วิเคราะห์สีผิวได้แม่นยำที่สุด
              </p>
            </div>
          </Col>

          {/* ฝั่งขวา: ส่วนการ์ดสแกน */}
          <Col lg={6} className="d-flex justify-content-center">
            <div className="w-100" style={{ maxWidth: '450px' }}>
              <Card className="border-0 shadow-lg rounded-5 overflow-hidden mb-4 position-relative">
                {imagePreview ? (
                  <div className="position-relative">
                    <img src={imagePreview} alt="ตัวอย่างรูปมะนาว" style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }} />
                    {loading && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white bg-opacity-75 backdrop-blur">
                        <Spinner animation="border" variant="success" className="mb-2" />
                        <span className="fw-bold text-success">กำลังวิเคราะห์...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: '400px' }}>
                    <div className="text-center text-muted opacity-50">
                      <Camera size={64} className="mb-3" />
                      <p className="fw-bold">ยังไม่มีการเลือกรูปภาพ</p>
                    </div>
                  </div>
                )}

                {/* แสดงผลลัพธ์ */}
                {!loading && predictions && renderResultCard()}

                {/* แสดง Error */}
                {!loading && error && (
                  <div className="position-absolute bottom-0 start-0 w-100 p-3">
                    <Card className="border-0 shadow-lg py-3 px-3 rounded-4 bg-white text-center">
                      <div className="d-flex align-items-center justify-content-center gap-2 text-danger">
                        <AlertTriangle size={18} />
                        <small className="fw-bold">{error}</small>
                      </div>
                    </Card>
                  </div>
                )}
              </Card>

              <input type="file" accept="image/*" className="d-none" ref={fileInputRef} onChange={handleImageSelect} />
              
              {/* ปุ่มเลือกรูป / เปลี่ยนรูป */}
              <Button 
                variant="success" size="lg" 
                className="w-100 py-4 rounded-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-3 btn-scan"
                onClick={() => fileInputRef.current.click()}
                disabled={loading}
                style={{ backgroundColor: '#10b981', border: 'none' }}
              >
                <Camera size={24} />
                {imagePreview ? "เปลี่ยนรูปภาพ" : "เลือกรูปภาพ"}
              </Button>

              {/* ปุ่มเริ่มสแกน — แสดงเมื่อมีรูปภาพแล้ว */}
              {imagePreview && (
                <Button 
                  variant="outline-success" size="lg" 
                  className="w-100 py-4 rounded-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-3 mt-3"
                  onClick={handleScan}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      กำลังวิเคราะห์...
                    </>
                  ) : (
                    <>
                      <Search size={24} />
                      เริ่มสแกนเลย
                    </>
                  )}
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;