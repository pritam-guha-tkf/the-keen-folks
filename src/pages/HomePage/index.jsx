import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Card, Row, Col } from 'antd';
import { CrownOutlined, ExperimentOutlined, SmileOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HomePageContent = () => {
  return (
    <div className="homepage-container" style={{ padding: '2rem 1rem' }}>
      {}
      <Title level={1} style={{ textAlign: 'center' }}>Welcome to "The Gourmet Place"!</Title>
      <Paragraph style={{ textAlign: 'center', fontSize: '1.3rem', marginBottom: '2rem' }}>
        Experience the finest dining with fresh ingredients and culinary passion.
        Explore our delicious offerings and unique atmosphere.
      </Paragraph>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Link to="/menu">
          <Button type="primary" size="large" danger>
            View Our Menu
          </Button>
        </Link>
      </div>

      <section className="features-section">
        <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>Why Choose Us?</Title>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card title={<span><ExperimentOutlined /> Fresh Ingredients</span>} hoverable>
              <Paragraph>We source the best local and seasonal ingredients daily.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title={<span><CrownOutlined /> Expert Chefs</span>} hoverable>
              <Paragraph>Our chefs are passionate about creating memorable dishes.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title={<span><SmileOutlined /> Cozy Ambiance</span>} hoverable>
              <Paragraph>Enjoy a warm and welcoming dining experience.</Paragraph>
            </Card>
          </Col>
        </Row>
      </section>
    </div>
  );
}

const HomePage = React.memo(HomePageContent);

export default HomePage;