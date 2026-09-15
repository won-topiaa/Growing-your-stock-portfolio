import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { AddHolding } from './pages/AddHolding';
import { HoldingDetail } from './pages/HoldingDetail';
import { HallOfFame } from './pages/HallOfFame';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'add', element: <AddHolding /> },
      { path: 'holding/:id', element: <HoldingDetail /> },
      { path: 'hall-of-fame', element: <HallOfFame /> },
    ],
  },
]);
