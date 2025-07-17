/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Mic, MicOff } from 'lucide-react';
import '../styles/chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text:"Hi, I’m Lexara, your smart AI assistant. I’m here to help answer your questions and guide you around. How can I assist you today?"
,
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationContext, setConversationContext] = useState<any[]>([]);
  
  type SectionContent = {
    text: string;
    headings: { text: string | null, level: number }[];
    paragraphs: string[];
    lists: string[][];
    links: { text: string, href: string }[];
    metadata: Record<string, any>;
  };
  
  const [pageContent, setPageContent] = useState<{ [key: string]: SectionContent }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Enhanced scrolling with smooth behavior
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize speech recognition if available
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev + ' ' + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Enhanced content extraction with semantic analysis
  useEffect(() => {
    const extractPageContent = () => {
      const content: { [key: string]: SectionContent } = {};
      
      // Semantic section detection with priority
      const semanticSections = [
        { name: 'about', selectors: ['[data-section="about"]', '#about', '.about-section'] },
        { name: 'services', selectors: ['[data-section="services"]', '#services', '.services-grid'] },
        { name: 'team', selectors: ['[data-section="team"]', '#team', '.team-members'] },
        { name: 'contact', selectors: ['[data-section="contact"]', '#contact', '.contact-form'] },
        { name: 'pricing', selectors: ['[data-section="pricing"]', '#pricing', '.pricing-table'] },
        { name: 'faq', selectors: ['[data-section="faq"]', '#faq', '.faq-list'] },
        { name: 'blog', selectors: ['[data-section="blog"]', '#blog', '.post-list'] },
        { name: 'testimonials', selectors: ['[data-section="testimonials"]', '#testimonials', '.testimonial-carousel'] }
      ];

      semanticSections.forEach(({name, selectors}) => {
        let element = null;
        for (const selector of selectors) {
          element = document.querySelector(selector);
          if (element) break;
        }

        if (element) {
          const headings = Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6'))
            .map(el => ({
              text: el.textContent,
              level: parseInt(el.tagName.substring(1))
            }));

          const paragraphs = Array.from(element.querySelectorAll('p'))
            .map(el => el.textContent || '')
            .filter(text => text.trim().length > 0);

          const lists = Array.from(element.querySelectorAll('ul, ol'))
            .map(list => 
              Array.from(list.querySelectorAll('li'))
                .map(li => li.textContent || '')
                .filter(text => text.trim().length > 0)
            )
            .filter(listItems => listItems.length > 0);

          const links = Array.from(element.querySelectorAll('a[href]'))
            .map(a => ({
              text: a.textContent || '',
              href: (a as HTMLAnchorElement).href
            }))
            .filter(link => link.text.trim().length > 0);

          content[name] = {
            text: (element as HTMLElement).innerText || '',
            headings,
            paragraphs,
            lists,
            links,
            metadata: {
              importance: headings.some(h => h.level <= 2) ? 'high' : 'medium'
            }
          };
        }
      });

      // Extract main content with semantic segmentation
      const mainContent = document.querySelector('main') || document.body;
      if (mainContent) {
        content.main = {
          text: mainContent.textContent || '',
          headings: Array.from(mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6'))
            .map(el => ({
              text: el.textContent,
              level: parseInt(el.tagName.substring(1))
            })),
          paragraphs: Array.from(mainContent.querySelectorAll('p'))
            .map(el => el.textContent || '')
            .filter(text => text.trim().length > 0),
          lists: Array.from(mainContent.querySelectorAll('ul, ol'))
            .map(list => 
              Array.from(list.querySelectorAll('li'))
                .map(li => li.textContent || '')
                .filter(text => text.trim().length > 0)
            )
            .filter(listItems => listItems.length > 0),
          links: Array.from(mainContent.querySelectorAll('a[href]'))
            .map(a => ({
              text: a.textContent || '',
              href: (a as HTMLAnchorElement).href
            }))
            .filter(link => link.text.trim().length > 0),
          metadata: {
            importance: 'medium'
          }
        };
      }

      // Build knowledge graph from extracted content
      const graph: Record<string, any> = {};
      
      Object.entries(content).forEach(([section, data]) => {
        // Entity extraction
        const entities: Record<string, string[]> = {
          people: [],
          organizations: [],
          dates: [],
          locations: []
        };

        // Simple entity recognition (would be enhanced with NLP in production)
        data.paragraphs.forEach(para => {
          // Extract potential names (title case words)
          const nameMatches = para.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g) || [];
          entities.people.push(...nameMatches);
          
          // Extract potential organizations (words with Inc, Corp, etc.)
          const orgMatches = para.match(/\b[A-Z][a-zA-Z]*(?: Inc| Corp| LLC| Ltd)\b/g) || [];
          entities.organizations.push(...orgMatches);
          
          // Extract dates
          const dateMatches = para.match(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/g) || [];
          entities.dates.push(...dateMatches);
        });

        // Build section nodes
        graph[section] = {
          type: 'section',
          name: section,
          content: data.text.substring(0, 500),
          entities,
          relationships: data.headings.map(h => ({
            type: 'heading',
            text: h.text,
            level: h.level
          })),
          metadata: data.metadata
        };
      });

      setPageContent(content);

      // setKnowledgeGraph(graph); // Removed unused state
    };
    extractPageContent();
    
    // Observe dynamic content changes with debounce
  let debounceTimer: number | undefined;
  const observer = new MutationObserver(() => {
    if (debounceTimer !== undefined) {
      window.clearTimeout(debounceTimer);
    }
    debounceTimer = window.setTimeout(() => {
      extractPageContent();
    }, 500);
  });

  observer.observe(document.body, { 
    childList: true, 
    subtree: true,
    attributes: true,
    characterData: true
  });

  return () => {
    observer.disconnect();
    if (debounceTimer !== undefined) {
      window.clearTimeout(debounceTimer);
    }
  };
}, []);

  // Enhanced NLP-like processing
  const analyzeText = (text: string) => {
    // Tokenize with stemming and lemmatization (simplified)
    const tokens = text.toLowerCase()
      .replace(/[^\w\s'-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !isStopWord(word))
      .map(word => {
        // Simple stemming
        if (word.endsWith('ing')) return word.replace(/ing$/, '');
        if (word.endsWith('ly')) return word.replace(/ly$/, '');
        if (word.endsWith('s')) return word.replace(/s$/, '');
        return word;
      });

    // Extract key phrases (simplified)
    const phrases: string[] = [];
    for (let i = 0; i < tokens.length - 1; i++) {
      const bigram = `${tokens[i]} ${tokens[i+1]}`;
      if (bigram.length > 5 && !isStopPhrase(bigram)) {
        phrases.push(bigram);
      }
    }

    return {
      tokens,
      phrases,
      sentiment: analyzeSentiment(text) // -1 to 1 scale
    };
  };

  const isStopWord = (word: string) => {
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'a', 'an', 'as', 'it', 'its', 'they', 'them', 'their']);
    return stopWords.has(word);
  };

  const isStopPhrase = (phrase: string) => {
    const stopPhrases = new Set(['in the', 'on the', 'at the', 'for the', 'of the', 'with the', 'to the', 'and the', 'it is', 'that is', 'this is', 'there is', 'there are']);
    return stopPhrases.has(phrase);
  };

  const analyzeSentiment = (text: string) => {
    // Simplified sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'wonderful', 'awesome', 'fantastic', 'happy', 'pleased'];
    const negativeWords = ['bad', 'terrible', 'awful', 'poor', 'unhappy', 'angry', 'frustrated'];
    
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    
    return Math.min(1, Math.max(-1, score / 5)); // Normalize to -1..1 range
  };

  // Enhanced semantic similarity with vector space model
  const calculateSemanticSimilarity = (query: string, text: string) => {
    const queryAnalysis = analyzeText(query);
    const textAnalysis = analyzeText(text);
    
    // Term frequency weights
    const queryTerms = new Map<string, number>();
    queryAnalysis.tokens.forEach(token => {
      queryTerms.set(token, (queryTerms.get(token) || 0) + 1);
    });
    
    const textTerms = new Map<string, number>();
    textAnalysis.tokens.forEach(token => {
      textTerms.set(token, (textTerms.get(token) || 0) + 1);
    });
    
    // Calculate cosine similarity
    let dotProduct = 0;
    let queryMagnitude = 0;
    let textMagnitude = 0;
    
    // For terms in query
    queryTerms.forEach((qWeight, term) => {
      const tWeight = textTerms.get(term) || 0;
      dotProduct += qWeight * tWeight;
      queryMagnitude += qWeight * qWeight;
    });
    
    // For terms in text (not in query)
    textTerms.forEach((tWeight) => {
      textMagnitude += tWeight * tWeight;
    });
    
    queryMagnitude = Math.sqrt(queryMagnitude);
    textMagnitude = Math.sqrt(textMagnitude);
    
    const cosineSimilarity = (queryMagnitude * textMagnitude) > 0 
      ? dotProduct / (queryMagnitude * textMagnitude)
      : 0;
    
    // Boost similarity if key phrases match
    const phraseMatchBoost = queryAnalysis.phrases.filter(phrase => 
      textAnalysis.phrases.includes(phrase)
    ).length * 0.1;
    
    // Combine scores with sentiment consideration
    const sentimentAlignment = 1 - Math.abs(queryAnalysis.sentiment - textAnalysis.sentiment) / 2;
    
    return (cosineSimilarity * 0.7 + phraseMatchBoost * 0.2 + sentimentAlignment * 0.1);
  };

  // Enhanced content retrieval with semantic understanding
  const findRelevantContent = (query: string) => {
    type RelevantContent = {
      section: string;
      content: string;
      similarity: number;
      type: 'general' | 'paragraph' | 'heading' | 'list' | 'link';
      source?: any;
      metadata?: any;
    };
    
    const results: RelevantContent[] = [];
    const queryAnalysis = analyzeText(query);
    const intent = detectIntent(query);
    
    // Search through all content sections
    Object.entries(pageContent).forEach(([section, data]) => {
      // Skip sections unlikely to be relevant based on intent
      if (intent === 'contact' && !['contact', 'footer', 'header'].includes(section)) return;
      if (intent === 'team' && section !== 'team') return;
      
      // 1. Check paragraphs (most detailed content)
      data.paragraphs.forEach((paragraph, index) => {
        if (paragraph.length < 30) return; // Skip short paragraphs
        
        const similarity = calculateSemanticSimilarity(query, paragraph);
        if (similarity > 0.2) {
          results.push({
            section,
            content: paragraph,
            similarity: similarity * 1.3, // Boost paragraph importance
            type: 'paragraph',
            source: data,
            metadata: {
              position: index,
              length: paragraph.length
            }
          });
        }
      });
      
      // 2. Check headings (structural importance)
      data.headings.forEach((heading, index) => {
        if (!heading.text || heading.text.length < 5) return;
        
        const similarity = calculateSemanticSimilarity(query, heading.text);
        if (similarity > 0.3) {
          // Find related content under this heading
          let relatedContent = '';
          if (index < data.paragraphs.length) {
            relatedContent = data.paragraphs[index];
          } else if (data.paragraphs.length > 0) {
            relatedContent = data.paragraphs[0];
          }
          
          results.push({
            section,
            content: heading.text + (relatedContent ? `\n\n${relatedContent}` : ''),
            similarity: similarity * (1.5 - (heading.level * 0.1)), // Higher level = more important
            type: 'heading',
            source: data,
            metadata: {
              level: heading.level
            }
          });
        }
      });
      
      // 3. Check lists (often contain key information)
      data.lists.forEach((listItems, listIndex) => {
        listItems.forEach((item, itemIndex) => {
          if (item.length < 10) return;
          
          const similarity = calculateSemanticSimilarity(query, item);
          if (similarity > 0.25) {
            results.push({
              section,
              content: item,
              similarity: similarity * 1.1,
              type: 'list',
              source: data,
              metadata: {
                listIndex,
                itemIndex
              }
            });
          }
        });
      });
      
      // 4. Check links (for navigation questions)
      data.links.forEach((link) => {
        const linkTextSimilarity = calculateSemanticSimilarity(query, link.text);
        const href = link.href.toLowerCase();
        
        // Check if query mentions links or navigation
        if (queryAnalysis.tokens.some(t => ['link', 'go to', 'navigate', 'page'].includes(t))) {
          const hrefSimilarity = calculateSemanticSimilarity(query, href);
          const combinedSimilarity = (linkTextSimilarity + hrefSimilarity) / 2;
          
          if (combinedSimilarity > 0.3) {
            results.push({
              section,
              content: `${link.text} (${href})`,
              similarity: combinedSimilarity * 1.2,
              type: 'link',
              source: data,
              metadata: {
                href,
                isInternal: href.startsWith(window.location.origin)
              }
            });
          }
        }
      });
      
      // 5. Full section text as fallback
      if (data.text.length > 100) {
        const similarity = calculateSemanticSimilarity(query, data.text);
        if (similarity > 0.15) {
          results.push({
            section,
            content: data.text.substring(0, 500) + (data.text.length > 500 ? '...' : ''),
            similarity: similarity * 0.9, // Lower weight for general content
            type: 'general',
            source: data
          });
        }
      }
    });
    
    // Sort by similarity and apply diversity
    results.sort((a, b) => b.similarity - a.similarity);
    
    // Ensure diversity in results (not all from same section)
    const finalResults: RelevantContent[] = [];
    const sectionsUsed = new Set();
    
    for (const result of results) {
      if (!sectionsUsed.has(result.section) || finalResults.length < 3) {
        finalResults.push(result);
        sectionsUsed.add(result.section);
      }
      
      if (finalResults.length >= 5) break;
    }
    
    return finalResults;
  };

  // Advanced intent detection with context awareness
  type IntentType =
    | "services"
    | "team"
    | "contact"
    | "about"
    | "pricing"
    | "news"
    | "help"
    | "how-to"
    | "explanation"
    | "question"
    | "command"
    | "general"
    | "follow-up";

  const detectIntent = (query: string): IntentType => {
    const queryLower = query.toLowerCase();
    const context = conversationContext.slice(-3);
    
    // Check for follow-up questions in context
    if (context.some(c => c.intent === 'question') && (queryLower.includes('this') || queryLower.includes('that'))) {
      return 'follow-up';
    }
    
    // Common intents
    if (/service|offer|provide|product|solution/.test(queryLower)) return 'services';
    if (/team|staff|employee|who is|who are/.test(queryLower)) return 'team';
    if (/contact|reach|phone|email|address|location/.test(queryLower)) return 'contact';
    if (/about|company|business|history|story/.test(queryLower)) return 'about';
    if (/price|cost|fee|how much/.test(queryLower)) return 'pricing';
    if (/news|update|blog|recent|latest/.test(queryLower)) return 'news';
    if (/help|support|problem|issue/.test(queryLower)) return 'help';
    if (/how to|guide|tutorial|steps/.test(queryLower)) return 'how-to';
    if (/why|reason|because/.test(queryLower)) return 'explanation';
    
    // Question patterns
    if (/\bwho\b|\bwhat\b|\bwhen\b|\bwhere\b|\bwhy\b|\bhow\b/.test(queryLower)) {
      return 'question';
    }
    
    // Command patterns
    if (/show me|find|search|look for/.test(queryLower)) return 'command';
    
    return 'general';
  };

  // Context-aware response generation
  const generateSmartResponse = (query: string, relevantContent: ReturnType<typeof findRelevantContent>) => {
    const intent = detectIntent(query);
    const context = conversationContext.slice(-3);
    const queryAnalysis = analyzeText(query);
    
    // Update conversation context
    const newContext = [...context, {
      query,
      intent,
      sentiment: queryAnalysis.sentiment,
      timestamp: new Date().toISOString()
    }];
    setConversationContext(newContext);
    
    // Handle empty results
    if (relevantContent.length === 0) {
      return getContextualResponse(intent);
    }
    
    // Generate response based on intent and content
    switch (intent) {
      case 'services':
        return generateServiceResponse(query, relevantContent);
      case 'team':
        return generateTeamResponse(relevantContent);
      case 'contact':
        return generateContactResponse(relevantContent);
      case 'pricing':
        return generatePricingResponse(relevantContent);
      case 'how-to':
        return generateHowToResponse(query, relevantContent);
      case 'question':
        return generateQuestionResponse(query, relevantContent);
      case 'follow-up':
        return generateFollowUpResponse(query, newContext, relevantContent);
      default:
        return generateGeneralResponse(query, relevantContent);
    }
  };

  // Specialized response generators
  type RelevantContent = {
    section: string;
    content: string;
    similarity: number;
    type: 'general' | 'paragraph' | 'heading' | 'list' | 'link';
    source?: any;
    metadata?: any;
  };

  const generateServiceResponse = (_query: string, content: RelevantContent[]) => {
    const serviceContent = content.filter(c => 
      c.section === 'services' || c.content.toLowerCase().includes('service')
    );
    
    if (serviceContent.length > 0) {
      const primary = serviceContent[0];
      let response = `Our ${primary.section === 'services' ? 'services' : 'offerings'} include:\n`;
      
      // Extract service names from headings or lists
      const serviceNames = primary.source?.headings
        ?.filter((h: any) => h.level <= 3)
        ?.map((h: any) => h.text)
        || primary.source?.lists?.[0]?.slice(0, 5)
        || [];
      
      if (serviceNames.length > 0) {
        response += serviceNames.map((name: string) => `• ${name}`).join('\n');
        response += '\n\nWould you like details about any specific service?';
      } else {
        response = `Regarding ${primary.section}, we offer: ${primary.content.substring(0, 1000)}...`;
      }
      
      return response;
    }
    
    return getGenericResponse('services');
  };

  const generateTeamResponse = (content: any[]) => {
    const teamContent = content.find(c => c.section === 'team');
    
    if (teamContent) {
      // Extract team members (simplified)
      const members = teamContent.source?.lists?.[0] || [];
      if (members.length > 0) {
        return `Our team includes:\n${members.slice(0, 5).map((m: string) => `• ${m}`).join('\n')}\n\nWould you like to know more about any team member?`;
      }
      
      return `Our team information: ${teamContent.content.substring(0, 1500)}...`;
    }
    
    return "I couldn't find specific team information. Would you like to try asking about a specific team member or department?";
  };

  const generateContactResponse = (content: any[]) => {
    const contactContent = content.find(c => 
      c.section === 'contact' || c.type === 'link'
    );
    
    if (contactContent) {
      // Find email and phone patterns
      const emailMatch = contactContent.content.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
      const phoneMatch = contactContent.content.match(/(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/);
      
      let response = 'You can contact us through:';
      if (emailMatch) response += `\nEmail: ${emailMatch[0]}`;
      if (phoneMatch) response += `\nPhone: ${phoneMatch[0]}`;
      
      const addressMatch = contactContent.content.match(/\d+ [A-Za-z]+(?: [A-Za-z]+)*, [A-Za-z]+(?: [A-Za-z]+)* \d{5}/);
      if (addressMatch) response += `\nAddress: ${addressMatch[0]}`;
      
      if (emailMatch || phoneMatch || addressMatch) {
        return response;
      }
      
      return `Contact information: ${contactContent.content.substring(0, 1000)}...`;
    }
    
    return "Our contact page should have the information you need. Would you like me to direct you there?";
  };

  const generatePricingResponse = (content: any[]) => {
    const pricingContent = content.find(c => c.section === 'pricing');
    
    if (pricingContent) {
      // Extract price information
      const priceMatches = pricingContent.content.match(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g) || [];
      if (priceMatches.length > 0) {
        return `Our pricing starts at ${priceMatches[0]}. For more details: ${pricingContent.content.substring(0, 1000)}...`;
      }
      
      return `Pricing information: ${pricingContent.content.substring(0, 1000)}...`;
    }
    
    return "I couldn't find specific pricing information. Would you like me to direct you to our pricing page?";
  };

  const generateHowToResponse = (query: string, content: any[]) => {
    const stepsContent = content.find(c => 
      c.type === 'list' && c.content.toLowerCase().includes('step')
    );
    
    if (stepsContent) {
      return `Here's how to ${query.replace(/how to/i, '')}:\n${stepsContent.content}`;
    }
    
    const relevant = content.find(c => c.type === 'paragraph' && c.content.length > 1000);
    if (relevant) {
      return `To ${query.replace(/how to/i, '')}, ${relevant.content.substring(0, 1000)}...`;
    }
    
    return `I found some information that might help with "${query}": ${content[0]?.content.substring(0, 1000)}...`;
  };

  const generateQuestionResponse = (query: string, content: any[]) => {
    // Try to find the most direct answer
    const answer = content.find(c => 
      c.type === 'paragraph' && 
      c.content.length > 100 && 
      c.content.length < 1100 &&
      !c.content.includes('http') &&
      c.content.split(' ').length > 10
    );
    
    if (answer) {
      return answer.content;
    }
    
    // Fallback to general information
    return `Regarding your question about "${query.split(' ').slice(0, 5).join(' ')}", ${content[0]?.content.substring(0, 1000)}...`;
  };

  const generateFollowUpResponse = (query: string, context: any[], content: any[]) => {
    const lastQuestion = (() => {
      for (let i = context.length - 1; i >= 0; i--) {
        if (context[i].intent === 'question') {
          return context[i];
        }
      }
      return undefined;
    })();
    
    if (lastQuestion) {
      // Try to relate the follow-up to the previous question
      const relatedContent = content.find(c => 
        calculateSemanticSimilarity(lastQuestion.query, c.content) > 0.3
      );
      
      if (relatedContent) {
        return `Building on that, ${relatedContent.content.substring(0, 1000)}...`;
      }
    }
    
    return generateGeneralResponse(query, content);
  };

  const generateGeneralResponse = (query: string, content: any[]) => {
    // Combine the most relevant pieces of information
    let response = '';
    const usedSections = new Set();
    
    for (const item of content) {
      if (!usedSections.has(item.section)) {
        response += `${item.content.substring(0, 1500)}...\n\n`;
        usedSections.add(item.section);
      }
      
      if (response.length > 1000) break;
    }
    
    return response.trim() || getGenericResponse(query);
  };

  const getContextualResponse = (intent: string) => {
    const genericResponses: Record<string, string> = {
      services: "I'd be happy to tell you about our services. Could you specify which service you're interested in?",
      team: "Our team information isn't readily available. Would you like to contact someone specific?",
      contact: "You can reach us through our contact page. Would you like me to direct you there?",
      pricing: "For pricing details, please visit our pricing page or contact our sales team.",
      help: "I'm sorry you're having trouble. Could you describe your issue in more detail?",
      'how-to': "I'll need more details to help with that. Could you explain what you're trying to accomplish?",
      question: "I couldn't find a specific answer to your question. Could you rephrase or provide more context?",
      "follow-up": "I'm not sure I follow. Could you clarify your question?",
      general: "I'm not entirely sure about that. Could you provide more details or try asking differently?"
    };
    
    return genericResponses[intent] || genericResponses.general;
  };

  const getGenericResponse = (query: string) => {
    return getContextualResponse(detectIntent(query));
  };

  // Voice input handler
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Voice input is not supported in your browser or is disabled.",
        isBot: true,
        timestamp: new Date()
      }]);
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Listening... Speak now.",
        isBot: true,
        timestamp: new Date()
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Simulate more realistic processing with variable delay
    const processingTime = 800 + Math.random() * 1200;
    
    setTimeout(() => {
      const relevantContent = findRelevantContent(currentQuery);
      const response = generateSmartResponse(currentQuery, relevantContent);
      
      const botResponse = {
        id: messages.length + 2,
        text: response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, processingTime);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-toggle-button"
          aria-label="Open AI chat"
        >
          <MessageCircle size={24} />
          <div className="chat-toggle-indicator"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <Bot size={20} />
              <div>
                <span className="chat-header-title">LEXARA</span>
                <div className="chat-header-subtitle">Developed by WJBL</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chat-close-button"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-wrapper ${message.isBot ? 'bot' : 'user'}`}
              >
                {message.isBot && (
                  <div className="message-avatar">
                    <Bot size={14} />
                  </div>
                )}
                <div className={`message-bubble ${message.isBot ? 'bot' : 'user'}`}>
                  {message.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < message.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                {!message.isBot && (
                  <div className="message-avatar">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="typing-indicator">
                <div className="message-avatar">
                  <Bot size={14} />
                </div>
                <div className="typing-bubble">
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <div className="input-wrapper">
              <button
                onClick={toggleVoiceInput}
                className={`voice-button ${isListening ? 'active' : ''}`}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about our company..."
                className="message-input"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || inputValue.trim() === ''}
                className="send-button"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="input-hint">
              {isListening ? "Listening... Speak now" : "Press Enter to send"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;