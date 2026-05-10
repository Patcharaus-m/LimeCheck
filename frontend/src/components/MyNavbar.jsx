import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { Leaf, Menu } from 'lucide-react';

const MyNavbar = () => {
  return (
    <Navbar bg="white" className="py-3 border-bottom sticky-top">
      <Container> {/* ล็อกเนื้อหาให้อยู่ตรงกลางจอคอม ไม่ให้หลุดขอบ */}
        <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
          <div className="bg-light p-2 rounded-3 text-success">
            <Leaf size={24} />
          </div>
          <div>
            <span className="fw-bold text-dark h4 m-0">NorthGarden</span>
            <div className="text-muted fw-bold d-none d-sm-block" style={{ fontSize: '10px' }}>
              NORTH BANGKOK UNIVERSITY
            </div>
          </div>
        </Navbar.Brand>
        <Button variant="light" className="rounded-circle border-0">
          <Menu size={24} className="text-secondary" />
        </Button>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;