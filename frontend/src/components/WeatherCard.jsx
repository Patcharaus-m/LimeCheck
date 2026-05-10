import React, { useState, useEffect } from 'react';
import { Card, Form, Spinner, Row, Col } from 'react-bootstrap';
import { CloudSun, MapPin, Wind, Droplets } from 'lucide-react';
import axios from 'axios';

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('Bangkok'); 
  const [loading, setLoading] = useState(false);

  const API_KEY = 'a2efa66c50e3a551f9e3ad8606961199'; 

  // รายชื่อจังหวัดตัวอย่าง (สามารถเพิ่มได้ตามต้องการ)
const provinces = [
    // ภาคกลาง
    { name: 'กรุงเทพมหานคร', value: 'Bangkok' },
    { name: 'ปทุมธานี (NBU)', value: 'Pathum Thani' },
    { name: 'นนทบุรี', value: 'Nonthaburi' },
    { name: 'สมุทรปราการ', value: 'Samut Prakan' },
    { name: 'พระนครศรีอยุธยา', value: 'Phra Nakhon Si Ayutthaya' },
    { name: 'สระบุรี', value: 'Saraburi' },
    { name: 'ลพบุรี', value: 'Lop Buri' },
    { name: 'อ่างทอง', value: 'Ang Thong' },
    { name: 'สิงห์บุรี', value: 'Sing Buri' },
    { name: 'ชัยนาท', value: 'Chai Nat' },
    { name: 'นครนายก', value: 'Nakhon Nayok' },
    { name: 'นครปฐม', value: 'Nakhon Pathom' },
    { name: 'สมุทรสาคร', value: 'Samut Sakhon' },
    { name: 'สมุทรสงคราม', value: 'Samut Songkhram' },
    { name: 'สุพรรณบุรี', value: 'Suphan Buri' },
    { name: 'กาญจนบุรี', value: 'Kanchanaburi' },
    { name: 'ราชบุรี', value: 'Ratchaburi' },
    { name: 'เพชรบุรี', value: 'Phetchaburi' },
    { name: 'ประจวบคีรีขันธ์', value: 'Prachuap Khiri Khan' },

    // ภาคเหนือ
    { name: 'เชียงใหม่', value: 'Chiang Mai' },
    { name: 'เชียงราย', value: 'Chiang Rai' },
    { name: 'ลำพูน', value: 'Lamphun' },
    { name: 'ลำปาง', value: 'Lampang' },
    { name: 'แพร่', value: 'Phrae' },
    { name: 'น่าน', value: 'Nan' },
    { name: 'พะเยา', value: 'Phayao' },
    { name: 'แม่ฮ่องสอน', value: 'Mae Hong Son' },
    { name: 'อุตรดิตถ์', value: 'Uttaradit' },
    { name: 'ตาก', value: 'Tak' },
    { name: 'สุโขทัย', value: 'Sukhothai' },
    { name: 'พิษณุโลก', value: 'Phitsanulok' },
    { name: 'พิจิตร', value: 'Phichit' },
    { name: 'กำแพงเพชร', value: 'Kamphaeng Phet' },
    { name: 'นครสวรรค์', value: 'Nakhon Sawan' },
    { name: 'อุทัยธานี', value: 'Uthai Thani' },
    { name: 'พิจิตร', value: 'Phichit' },
    { name: 'เพชรบูรณ์', value: 'Phetchabun' },

    // ภาคตะวันออกเฉียงเหนือ (อีสาน)
    { name: 'ขอนแก่น', value: 'Khon Kaen' },
    { name: 'นครราชสีมา', value: 'Nakhon Ratchasima' },
    { name: 'อุดรธานี', value: 'Udon Thani' },
    { name: 'อุบลราชธานี', value: 'Ubon Ratchathani' },
    { name: 'บุรีรัมย์', value: 'Buri Ram' },
    { name: 'ศรีสะเกษ', value: 'Si Sa Ket' },
    { name: 'สุรินทร์', value: 'Surin' },
    { name: 'ร้อยเอ็ด', value: 'Roi Et' },
    { name: 'ชัยภูมิ', value: 'Chaiyaphum' },
    { name: 'สกลนคร', value: 'Sakon Nakhon' },
    { name: 'กาฬสินธุ์', value: 'Kalasin' },
    { name: 'มหาสารคาม', value: 'Maha Sarakham' },
    { name: 'นครพนม', value: 'Nakhon Phanom' },
    { name: 'เลย', value: 'Loei' },
    { name: 'ยโสธร', value: 'Yasothon' },
    { name: 'หนองคาย', value: 'Nong Khai' },
    { name: 'หนองบัวลำภู', value: 'Nong Bua Lam Phu' },
    { name: 'บึงกาฬ', value: 'Bueng Kan' },
    { name: 'อำนาจเจริญ', value: 'Amnat Charoen' },
    { name: 'มุกดาหาร', value: 'Mukdahan' },

    // ภาคตะวันออก
    { name: 'ชลบุรี', value: 'Chon Buri' },
    { name: 'ระยอง', value: 'Rayong' },
    { name: 'จันทบุรี', value: 'Chanthaburi' },
    { name: 'ตราด', value: 'Trat' },
    { name: 'ฉะเชิงเทรา', value: 'Chachoengsao' },
    { name: 'ปราจีนบุรี', value: 'Prachin Buri' },
    { name: 'สระแก้ว', value: 'Sa Kaeo' },

    // ภาคใต้
    { name: 'ภูเก็ต', value: 'Phuket' },
    { name: 'สุราษฎร์ธานี', value: 'Surat Thani' },
    { name: 'นครศรีธรรมราช', value: 'Nakhon Si Thammarat' },
    { name: 'สงขลา', value: 'Songkhla' },
    { name: 'กระบี่', value: 'Krabi' },
    { name: 'พังงา', value: 'Phang-nga' },
    { name: 'ตรัง', value: 'Trang' },
    { name: 'พัทลุง', value: 'Phatthalung' },
    { name: 'ชุมพร', value: 'Chumphon' },
    { name: 'ระนอง', value: 'Ranong' },
    { name: 'สตูล', value: 'Satun' },
    { name: 'ยะลา', value: 'Yala' },
    { name: 'ปัตตานี', value: 'Pattani' },
    { name: 'นราธิวาส', value: 'Narathiwat' }
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city},TH&appid=${API_KEY}&units=metric&lang=th`
        );
        setWeather(response.data);
      } catch (error) {
        console.error("Weather API Error:", error);
      }
      setLoading(false);
    };

    fetchWeather();
  }, [city]);

  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white animate-fade-in">
      <Card.Body className="p-4">
        <Row className="align-items-center">
          {/* ส่วนเลือกจังหวัด */}
          <Col lg={5} md={12} className="mb-3 mb-lg-0 border-lg-end">
            <div className="d-flex align-items-center gap-2 mb-3 text-success">
              <MapPin size={18} />
              <span className="fw-bold tracking-tight">เลือกพื้นที่สวน</span>
            </div>
            <Form.Select 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
              className="rounded-3 border-light-subtle shadow-sm py-2"
              style={{ cursor: 'pointer' }}
            >
              {provinces.map((p) => (
                <option key={p.value} value={p.value}>{p.name}</option>
              ))}
            </Form.Select>
          </Col>

          {/* ส่วนแสดงผลอากาศ */}
          <Col lg={7} md={12} className="ps-lg-4">
            {loading ? (
              <div className="d-flex justify-content-center py-2">
                <Spinner animation="border" variant="success" size="sm" />
              </div>
            ) : weather ? (
              <div className="d-flex align-items-center justify-content-center" style={{ gap: '1.5rem' }}>
                {/* ไอคอน + อุณหภูมิ */}
                <div className="d-flex align-items-center" style={{ gap: '0.75rem', flex: '0 0 auto' }}>
                  <div className="bg-success bg-opacity-10 p-2 rounded-3 text-success">
                    <CloudSun size={28} />
                  </div>
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: '1.5rem', lineHeight: 1.1 }}>
                      {Math.round(weather.main.temp)}°C
                    </div>
                    <small className="text-muted text-capitalize" style={{ fontSize: '0.75rem' }}>
                      {weather.weather[0].description}
                    </small>
                  </div>
                </div>

                {/* ความชื้น + ลม */}
                <div className="border-start ps-3" style={{ flex: '0 0 auto' }}>
                  <div className="d-flex align-items-center gap-2 text-muted mb-1" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    <Droplets size={14} className="text-info" />
                    <span>ชื้น: {weather.main.humidity}%</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    <Wind size={14} className="text-secondary" />
                    <span>ลม: {weather.wind.speed} m/s</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted small">ขออภัย ไม่สามารถดึงข้อมูลได้</div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default WeatherCard;