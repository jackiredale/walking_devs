import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from './components/Navbar';
import MovieList from './components/MovieList';
import CourseDetails from './components/CourseDetails';
import Films from "./pages/Films.jsx";
import MustWatch from "./pages/MustWatch.jsx";

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
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<MovieList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/films" element={<Films />} />
        <Route path="/must-watch" element={<MustWatch />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
      </StateContext>
      </SessionProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
