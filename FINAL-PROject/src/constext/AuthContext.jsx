import React,{createContext,useContext,useReducer,useEffect} from 'react'


const AuthContext = createContext()


const initialState = {
    user: null,
    isLoggedIn: false,
    isAdmin: false,
    token: localStorage.getItem('token') || null,

};

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload.user,
                isLoggedIn: true,
                isAdmin: action.payload.isAdmin,
                token: action.payload.token,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isLoggedIn: false,
                isAdmin: false,
                token: null,

            };
        default:
            return state;
    }
}
  export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

 useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:5000/api/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                if (data._id) {
                    dispatch({ type: 'LOGIN', payload: { user: data, token } });
                } else {
                    localStorage.removeItem('token');
                }
            })
            .catch(() => localStorage.removeItem('token'));
        }
    }, []);
    const login = (user,token) => {
        localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN', payload: { user, token, isAdmin: user.isAdmin } });
    };
    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };
    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}   
export function useAuth() {
    return useContext(AuthContext);
}

export default AuthContext