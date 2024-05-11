import React, { useState } from 'react';
import { Container, VStack, Input, Button, Text, Box, Textarea } from '@chakra-ui/react';

const Index = () => {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [quality, setQuality] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [classificationPrompt, setClassificationPrompt] = useState('');

  const handleScrape = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fc-1a67435fe4b54212b98f775c0d8fbc21'
        },
        body: JSON.stringify({ url })
      });
      const { data: { markdown } } = await response.json();
      // Simulate GPT-3.5 summarization and quality categorization
      setSummary('This is a simulated summary of the content.');
      setQuality('High');
      setMarkdownContent(markdown || 'No markdown content available.');
    } catch (error) {
      console.error('Failed to scrape:', error);
      setSummary('Failed to scrape the URL.');
      setQuality('Unknown');
      setMarkdownContent('No markdown content available.');
    }
    setLoading(false);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">URL Scrape and Analyze</Text>
        <Textarea
          placeholder="Enter classification prompt"
          value={classificationPrompt}
          onChange={(e) => setClassificationPrompt(e.target.value)}
          size="sm"
          resize="vertical"
        />
        <Input placeholder="Enter URL to scrape" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Button onClick={handleScrape} isLoading={loading} colorScheme="blue">Scrape URL</Button>
        {summary && (
          <Box p={4} mt={4} borderWidth="1px" borderRadius="lg">
            <Text fontWeight="bold">Summary:</Text>
            <Text>{summary}</Text>
            <Text fontWeight="bold">Quality:</Text>
            <Text>{quality}</Text>
          </Box>
        )}
        {markdownContent && (
          <Box p={4} mt={4} borderWidth="1px" borderRadius="lg">
            <Text fontWeight="bold">Markdown Content:</Text>
            <Text whiteSpace="pre-wrap">{markdownContent}</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;