import React, { useState } from 'react';
import { Container, VStack, Input, Button, Text, Box } from '@chakra-ui/react';

const Index = () => {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [quality, setQuality] = useState('');
  const [loading, setLoading] = useState(false);

  const classifyAndSummarize = async (content) => {
    try {
      const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
        },
        body: JSON.stringify({
          prompt: `Summarize the following content and classify its quality:\n\n${content}`,
          max_tokens: 1024
        })
      });
      const data = await response.json();
      return { summary: data.choices[0].text, quality: 'High' }; // Simplified quality assessment
    } catch (error) {
      console.error('Failed to classify and summarize:', error);
      return { summary: 'Failed to classify and summarize the content.', quality: 'Unknown' };
    }
  };

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
      const data = await response.json();
      const classification = await classifyAndSummarize(data.content);
      setSummary(classification.summary);
      setQuality(classification.quality);
    } catch (error) {
      console.error('Failed to scrape:', error);
      setSummary('Failed to scrape the URL.');
      setQuality('Unknown');
    }
    setLoading(false);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">URL Scrape and Analyze</Text>
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
      </VStack>
    </Container>
  );
};

export default Index;