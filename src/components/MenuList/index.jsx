import React, { useState, useEffect, useMemo, useCallback } from 'react';
import contentfulClient, { isPreviewMode } from '../../contentfulClient';
import MenuItemCard from '../MenuItem';
import { Pagination, Row, Col, Typography, Spin, Alert, Input, Select } from 'antd';

const { Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const PAGE_SIZE = 4;

function MenuList() {
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const previewModeActive = isPreviewMode();

  useEffect(() => {
    if (!contentfulClient) {
      setError("Contentful client not available. Check configuration.");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuItemResponse, categoryResponse] = await Promise.all([
          contentfulClient.getEntries({
            content_type: 'menuItem',
            order: 'fields.name'
          }),
          contentfulClient.getEntries({
            content_type: 'category',
            order: 'fields.name'
          })
        ]);
        setAllItems(menuItemResponse.items || []);
        setCategories(categoryResponse.items || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load menu data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (previewModeActive && contentfulClient) {
      const handleContentfulMessage = async (event) => {
        if (event.origin !== 'https://app.contentful.com' && !event.origin.endsWith('.contentful.com')) {
          return;
        }

        const messageData = event.data;
        if (messageData && messageData.fromContentful && messageData.action === 'EntrySaved' && messageData.entity) {
          const updatedEntryData = messageData.entity;
          const entryId = updatedEntryData.sys.id;
          const contentTypeId = updatedEntryData.sys.contentType.sys.id;

          console.log(`Live Preview: Received update for entry ${entryId} (type: ${contentTypeId})`);

          try {
            const freshEntry = await contentfulClient.getEntry(entryId, { include: 0 }); // Using include:0 can be lighter

            if (contentTypeId === 'menuItem') {
              setAllItems(prevItems => {
                const itemIndex = prevItems.findIndex(item => item.sys.id === entryId);
                if (itemIndex > -1) {
                  const newItems = [...prevItems];
                  newItems[itemIndex] = freshEntry;
                  return newItems;
                } else {
                  return [...prevItems, freshEntry];
                }
              });
            } else if (contentTypeId === 'category') {
              setCategories(prevCategories => {
                const catIndex = prevCategories.findIndex(cat => cat.sys.id === entryId);
                if (catIndex > -1) {
                  const newCategories = [...prevCategories];
                  newCategories[catIndex] = freshEntry;
                  return newCategories;
                } else {
                  return [...prevCategories, freshEntry];
                }
              });
            }
          } catch (fetchError) {
            console.error(`Live Preview: Error re-fetching entry ${entryId}:`, fetchError);
          }
        }
      };

      window.addEventListener('message', handleContentfulMessage);
      console.log('Live Preview: Event listener for Contentful messages added.');

      return () => {
        window.removeEventListener('message', handleContentfulMessage);
        console.log('Live Preview: Event listener for Contentful messages removed.');
      };
    }
  }, [previewModeActive, contentfulClient, setAllItems, setCategories]);

  const filteredItems = useMemo(() => {
    let items = allItems;
    if (selectedCategoryId && selectedCategoryId !== "") {
      items = items.filter(item => item.fields.category?.sys.id === selectedCategoryId);
    }
    if (searchTerm.trim()) {
      const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
      items = items.filter(item => {
        const name = item.fields.name?.toLowerCase() || '';
        const description = item.fields.description?.toLowerCase() || '';
        return name.includes(lowercasedSearchTerm) || description.includes(lowercasedSearchTerm);
      });
    }
    return items;
  }, [allItems, selectedCategoryId, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategoryId, filteredItems.length]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleCategoryChange = useCallback((value) => {
    setSelectedCategoryId(value === undefined ? '' : value);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading menu..." />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon style={{ margin: '20px 0' }} />;
  }

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentItemsOnPage = filteredItems.slice(startIndex, endIndex);

  return (
    <div className="menu-list-container" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <Select
          value={selectedCategoryId}
          placeholder="Filter by Category"
          onChange={handleCategoryChange}
          allowClear
          style={{ width: 220 }}
          size="large"
        >
          <Option value="">All Categories</Option> { }
          {categories.map(cat => (
            <Option key={cat.sys.id} value={cat.sys.id}>
              {cat.fields.name || 'Unnamed Category'}
            </Option>
          ))}
        </Select>
        <Search
          placeholder="Search within selection..."
          allowClear
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
          style={{ maxWidth: 400, flexGrow: 1 }}
        />
      </div>

      {!loading && allItems.length === 0 && (
        <Paragraph style={{ textAlign: 'center', padding: '20px' }}>
          No menu items available at the moment.
        </Paragraph>
      )}

      {!loading && filteredItems.length === 0 && (allItems.length > 0 || searchTerm.trim() || (selectedCategoryId && selectedCategoryId !== '')) && (
        <Paragraph style={{ textAlign: 'center', padding: '20px' }}>
          No menu items found matching your criteria. Please adjust your filters or search term.
        </Paragraph>
      )}

      <Row gutter={[16, 24]}>
        {currentItemsOnPage.map((item) => {
          const categoryName = item.fields.category?.fields?.name;
          return (
            <Col key={item.sys.id} xs={24} sm={12} md={8} lg={6}>
              <MenuItemCard item={item} categoryName={categoryName} />
            </Col>
          );
        })}
      </Row>

      {filteredItems.length > PAGE_SIZE && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={filteredItems.length}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}

export default MenuList;