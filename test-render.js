import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './src/App.jsx';

try {
  const html = ReactDOMServer.renderToString(React.createElement(App));
  console.log("SUCCESS: Rendered HTML length:", html.length);
} catch (error) {
  console.error("EXPLICIT RENDER ERROR:", error);
}
