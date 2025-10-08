import { useCallback } from 'react';
import { saveHome, saveOurStory, savePortfolio, saveContactUs, getWebsiteContent } from '../services/websiteAPI';

export default function useWebsiteContent() {
  const saveHomeContent = useCallback((payload) => saveHome(payload), []);
  const saveOurStoryContent = useCallback((payload) => saveOurStory(payload), []);
  const savePortfolioContent = useCallback((payload) => savePortfolio(payload), []);
  const saveContactUsContent = useCallback((payload) => saveContactUs(payload), []);
  const fetchContent = useCallback((section) => getWebsiteContent(section), []);

  return {
    saveHomeContent,
    saveOurStoryContent,
    savePortfolioContent,
    saveContactUsContent,
    fetchContent,
  };
}


