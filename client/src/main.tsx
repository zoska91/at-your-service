import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import './index.css';
import { router } from './routes/router.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        //  https://ant.design/docs/react/customize-theme
        token: {
          // Seed Token
          // colorPrimary: '#ddd',
          // borderRadius: 2,
          // Alias Token
          // colorBgContainer: '#f6ffed',
        },
        // 1. Use dark algorithm
        // algorithm: theme.darkAlgorithm,
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>
);
