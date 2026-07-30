import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import Navbar from './components/Navbar';
import MovieList from './components/MovieList';
import CourseDetails from './components/CourseDetails';

import { StateContext } from './contexts/StateContext';
import { SessionProvider } from './contexts/SessionContext';

const App = () => {
  return (
    <div>
       <BrowserRouter>
      <SessionProvider>
      <StateContext>
      <Navbar />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/" element={<MovieList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
      </StateContext>
      </SessionProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
