import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { StaticRouter } from 'react-router-dom';

export function render(url: string) {
  // Ensure the URL is absolute (prepend a slash if not already present)
  const absoluteUrl = url.startsWith('/') ? url : `/${url}`;
  console.log('Incoming URL:', url); // Log the incoming raw URL
  console.log('Resolved Absolute URL:', absoluteUrl); // Log the resolved absolute URL
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={absoluteUrl}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
  return { html };
}
