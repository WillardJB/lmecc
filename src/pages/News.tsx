// News.tsx
import React, { useState } from "react";
import "../styles/News.css";

import news1 from "../assets/news1.jpg";
import news2 from "../assets/news2.jpg";
import news3 from "../assets/news3.jpg";
import news4 from "../assets/news4.jpg";

interface NewsItem {
  id: number;
  img: string;
  caption: string;
  sizeClass: string;
  category: string;
  date: string;
  fullContent: string;
  author: string;
  readTime: string;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    img: news1,
    caption: "Revolutionary AI Technology Transforms Healthcare Industry",
    sizeClass: "large",
    category: "Technology",
    date: "March 15, 2024",
    author: "Dr. Sarah Johnson",
    readTime: "5 min read",
    fullContent: "Artificial Intelligence is revolutionizing healthcare with breakthrough innovations in diagnostic imaging, personalized treatment plans, and predictive analytics. Recent studies show AI can detect diseases 40% faster than traditional methods, leading to better patient outcomes and reduced healthcare costs. Major hospitals worldwide are implementing AI-powered systems to enhance medical decision-making and improve care quality."
  },
  {
    id: 2,
    img: news2,
    caption: "Global Climate Summit Reaches Historic Agreement",
    sizeClass: "tall",
    category: "Environment",
    date: "March 12, 2024",
    author: "Michael Chen",
    readTime: "7 min read",
    fullContent: "World leaders at the Global Climate Summit have reached a groundbreaking agreement to reduce carbon emissions by 50% over the next decade. The historic pact includes commitments from 195 countries to invest in renewable energy infrastructure, protect biodiversity, and transition to sustainable technologies. This represents the most ambitious climate action plan in history."
  },
  {
    id: 3,
    img: news3,
    caption: "Economic Markets Show Strong Recovery Signals",
    sizeClass: "",
    category: "Finance",
    date: "March 10, 2024",
    author: "Emma Rodriguez",
    readTime: "4 min read",
    fullContent: "Global financial markets are showing robust recovery signals following recent policy changes and increased consumer confidence. Tech stocks have surged 15% this quarter, while emerging markets demonstrate unprecedented growth. Economists predict continued positive trends driven by innovation investments and sustainable business practices."
  },
  {
    id: 4,
    img: news4,
    caption: "Cultural Festival Celebrates Diversity and Innovation",
    sizeClass: "wide",
    category: "Culture",
    date: "March 8, 2024",
    author: "Aisha Patel",
    readTime: "3 min read",
    fullContent: "The International Cultural Festival brought together artists, innovators, and communities from around the world to celebrate diversity and creative collaboration. Over 100,000 visitors experienced traditional performances, modern art installations, and interactive workshops showcasing the intersection of technology and cultural heritage."
  },
];

interface NewsModalProps {
  newsItem: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ newsItem, isOpen, onClose }) => {
  if (!isOpen || !newsItem) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <img src={newsItem.img} alt={newsItem.caption} className="modal-image" />
        <div className="modal-body">
          <div className="modal-header">
            <span className="modal-category">{newsItem.category}</span>
            <span className="modal-date">{newsItem.date}</span>
          </div>
          <h2 className="modal-title">{newsItem.caption}</h2>
          <div className="modal-meta">
            <span>By {newsItem.author}</span>
            <span>•</span>
            <span>{newsItem.readTime}</span>
          </div>
          <p className="modal-text">{newsItem.fullContent}</p>
          <div className="modal-actions">
            <button className="share-btn" onClick={() => navigator.share?.({ title: newsItem.caption, url: window.location.href })}>
              Share Article
            </button>
            <button className="bookmark-btn">Bookmark</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const News: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllNews, setShowAllNews] = useState(false);
  const itemsPerPage = 4;

  const handleReadMore = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  const handleViewAllNews = () => {
    setShowAllNews(!showAllNews);
    if (!showAllNews) {
      // Simulate loading more news items
      console.log("Loading all news items...");
    }
  };

  const handleCategoryFilter = (category: string) => {
    console.log(`Filtering by category: ${category}`);
    // Implement category filtering logic here
  };

  const displayedItems = showAllNews ? newsItems : newsItems.slice(0, itemsPerPage);

  return (
    <>
      <section className="news-section">
        <div className="news-header">
          <h2 className="news-title">Latest News & Events</h2>
          <p className="news-subtitle">Stay updated with the most impactful stories</p>
        </div>
        
        <div className="news-grid">
          {displayedItems.map((newsItem) => (
            <article key={newsItem.id} className={`news-card ${newsItem.sizeClass}`}>
              <div className="news-card-inner">
                <img src={newsItem.img} alt={newsItem.caption} className="news-img" />
                
                <div className="news-overlay">
                  <div 
                    className="news-category"
                    onClick={() => handleCategoryFilter(newsItem.category)}
                  >
                    {newsItem.category}
                  </div>
                  <div className="news-content">
                    <h3 className="news-caption">{newsItem.caption}</h3>
                    <div className="news-meta">
                      <span className="news-date">{newsItem.date}</span>
                      <span 
                        className="read-more"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReadMore(newsItem);
                        }}
                      >
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="news-footer">
          <button className="view-all-btn" onClick={handleViewAllNews}>
            {showAllNews ? "Show Less" : "View All News"}
          </button>
          {showAllNews && (
            <div className="news-stats">
              <p>Showing {displayedItems.length} of {newsItems.length} articles</p>
            </div>
          )}
        </div>
      </section>

      <NewsModal 
        newsItem={selectedNews}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default News;