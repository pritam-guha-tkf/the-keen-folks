import React from 'react';
import { Card, Tag, Typography } from 'antd';

const { Paragraph, Text } = Typography;
const { Meta } = Card;

const MenuItemCardComponent = ({ item, categoryName }) => {
  const fields = item?.fields || {};
  const { name, description, price, image } = fields;

  const imageUrl = image?.fields?.file?.url;
  const imageAltText = image?.fields?.description || image?.fields?.title || name || 'Menu item';

  return (
    <Card
      hoverable
      style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}
      cover={imageUrl && (
        <img
          alt={imageAltText}
          src={`https:${imageUrl}?w=300&h=200&q=80`}
          style={{ objectFit: 'cover', height: '200px' }}
        />
      )}
      bodyStyle={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
    >
      <Meta
        title={name || 'Unnamed Item'}
        description={
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between', height: '100%' }}>
            <div>
              {categoryName && (
                <Tag color="blue" style={{ marginBottom: '8px' }}>
                  {categoryName}
                </Tag>
              )}
              {description && (
                <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }} style={{ marginBottom: '8px' }}>
                  {description}
                </Paragraph>
              )}
            </div>
            {typeof price === 'number' && (
              <Text strong style={{ fontSize: '1.2em', color: '#27ae60', marginTop: 'auto' }}>
                ${price.toFixed(2)}
              </Text>
            )}
          </div>
        }
      />
    </Card>
  );
};

const MenuItemCard = React.memo(MenuItemCardComponent);

export default MenuItemCard;