import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import contentfulClient, { isPreviewMode } from '../../contentfulClient';
import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { Typography, Image, Spin, Alert, Tag, Breadcrumb, Descriptions, Button, Row, Col } from 'antd';
import { HomeOutlined, ProfileOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const MenuItemDetailPageContent = () => {
    const { itemSlug } = useParams();
    const [initialMenuItem, setInitialMenuItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const inPreview = isPreviewMode();

    useEffect(() => {
        if (!itemSlug || !contentfulClient) {
            setError(new Error("Item slug or Contentful client is missing."));
            setLoading(false);
            return;
        }

        const fetchMenuItem = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await contentfulClient.getEntries({
                    content_type: 'menuItem',
                    'fields.slug': itemSlug,
                    include: 2
                });

                if (response.items && response.items.length > 0) {
                    setInitialMenuItem(response.items[0]);
                } else {
                    setError(new Error(`Menu item with slug "${itemSlug}" not found.`));
                }
            } catch (err) {
                console.error(`Error fetching menu item details for slug "${itemSlug}":`, err);
                setError(new Error("Failed to load menu item details."));
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItem();
    }, [itemSlug]);

    const liveMenuItem = useContentfulLiveUpdates(initialMenuItem);

    const menuItemToDisplay = inPreview && liveMenuItem ? liveMenuItem : initialMenuItem;

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" tip="Loading menu item..." />
            </div>
        );
    }

    if (error) {
        return <Alert message="Error" description={error.message} type="error" showIcon style={{ margin: '20px' }} />;
    }

    if (!menuItemToDisplay || !menuItemToDisplay.fields) {
        return <Alert message="Menu Item Not Found" description={`The menu item "${itemSlug}" could not be loaded or found.`} type="warning" style={{ margin: '20px' }} />;
    }

    const { name, description, price, image, category } = menuItemToDisplay.fields;
    const imageUrl = image?.fields?.file?.url;
    const imageAltText = image?.fields?.description || image?.fields?.title || name || 'Menu Item';
    const categoryName = category?.fields?.name;

    return (
        <div className="menu-item-detail-container" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }} data-contentful-entry-id={menuItemToDisplay.sys.id}>
            <Breadcrumb style={{ marginBottom: '1.5rem' }}>
                <Breadcrumb.Item>
                    <RouterLink to="/"><HomeOutlined /> <span>Home</span></RouterLink>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <RouterLink to="/menu"><ProfileOutlined /> <span>Menu</span></RouterLink>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <span data-contentful-field-id="name">{name || 'Item Details'}</span>
                </Breadcrumb.Item>
            </Breadcrumb>

            <Row gutter={[32, 32]}>
                <Col xs={24} md={12}>
                    {imageUrl && (
                        <Image
                            width="100%"
                            src={`https:${imageUrl}?w=800&q=85`}
                            alt={imageAltText}
                            style={{ borderRadius: '8px', border: '1px solid #f0f0f0' }}
                            data-contentful-field-id="image"
                        />
                    )}
                </Col>
                <Col xs={24} md={12}>
                    <Title level={2} data-contentful-field-id="name" style={{ marginBottom: '0.5rem' }}>{name || 'Unnamed Item'}</Title>

                    {categoryName && (
                        <Tag color="blue" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                            Category: {categoryName}
                        </Tag>
                    )}

                    {typeof price === 'number' && (
                        <div style={{ marginBottom: '1rem' }}>
                            <Text strong style={{ fontSize: '1.8em', color: '#e74c3c' }} data-contentful-field-id="price">
                                ${price.toFixed(2)}
                            </Text>
                        </div>
                    )}

                    {description && (
                        <div data-contentful-field-id="description"> { }
                            <Title level={4} style={{ marginTop: '1rem' }}>Description</Title>
                            <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: '1.1em' }}>{description}</Paragraph>
                            { }
                        </div>
                    )}
                    { }
                    { }
                </Col>
            </Row>

            <Button type="default" style={{ marginTop: '2rem' }} onClick={() => window.history.back()}>
                &larr; Back to Menu
            </Button>
        </div>
    );
};

const MenuItemDetailPage = React.memo(MenuItemDetailPageContent);
export default MenuItemDetailPage;