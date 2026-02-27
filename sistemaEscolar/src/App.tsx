import {Button} from '@/components/ui/button';
import {RouterProvider} from 'react-router';
import {appRouter} from './router/app.router';
import './index.css';

const App = () => {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
