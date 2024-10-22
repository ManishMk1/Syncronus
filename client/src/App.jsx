// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { Button } from './components/ui/button'
// import Chat from './pages/chat'
// import Profile from './pages/profile'
// import Auth from './pages/auth'
// import { useSelector } from 'react-redux'
// import { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { toast } from "sonner"
// import { getUser } from './store/userSlice'

// function App() {
//   const dispatch = useDispatch();

//   const user = useSelector(state => state.user.data?.email)
//   useEffect(() => {
//     const getUserData = async () => {
//       try{
//         dispatch(getUser())
//       }catch(error){
//         console.log(error)
//       }
//   }
  
//   if (!user) {
//     getUserData(getUser());
//   } 
//   }, [user])
 

//   const PrivateRoute = ({ children }) => {
//     const user = useSelector((state) => state.user.data)
//     const isAuthenticated = !!user;
//     return isAuthenticated ? children : <Navigate to="/auth" />
//   }
//   const AuthRoute = ({ children }) => {
//     const user = useSelector((state) => state.user.data)
//     const isAuthenticated = !!user;
//     return isAuthenticated ? <Navigate to="/chat" /> : children
//   }


//   return (
//     <>

//       <BrowserRouter>
//         <Routes>
//           <Route path='/auth' element={<AuthRoute><Auth /></AuthRoute>}></Route>
//           <Route path='/chat' element={<PrivateRoute><Chat /></PrivateRoute>}></Route>
//           <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>}></Route>
//           <Route path='*' element={<Navigate to="/auth" />} />
//         </Routes>
//       </BrowserRouter>

//     </>
//   )
// }

// export default App
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Chat from './pages/chat'
import Profile from './pages/profile'
import Auth from './pages/auth'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { getUser } from './store/userSlice'
import Loading from './Loading'
import { toast } from 'sonner'
function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        await dispatch(getUser());
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);  // Stop loading once user data is fetche
        
      }
    }

    if (!user) {
      getUserData();
    } else {
      setLoading(false);  // If user data is already available
    }
  }, [user, dispatch]);

  const PrivateRoute = ({ children }) => {
    if (loading) return <Loading/>;  // Add loading state
    const isAuthenticated = !!user;
    return isAuthenticated ? children : <Navigate to="/auth" />;
  }

  const AuthRoute = ({ children }) => {
    if (loading) return <Loading/>;  // Add loading state
    const isAuthenticated = !!user;
    return isAuthenticated ? <Navigate to="/chat" /> : children;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<AuthRoute><Auth /></AuthRoute>}></Route>
        <Route path='/chat' element={<PrivateRoute><Chat /></PrivateRoute>}></Route>
        <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>}></Route>
        <Route path='*' element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
