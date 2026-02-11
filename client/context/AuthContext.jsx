import { createContext, useEffect, useState } from "react";
import axios from "../src/lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log("BACKEND URL:", backendUrl);

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]); // ✅ fixed naming
    const [socket, setSocket] = useState(null);

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            setAuthUser(null);
        }
    };

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                localStorage.setItem("token", data.token);
                connectSocket(data.userData);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        socket?.disconnect();
        toast.success("Logged out");
    };

    const updateProfile = async (body) => {
        try {
            const { data } = await axios.post("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const connectSocket = (userData) => {
    if (!userData) return;

    // Always disconnect previous socket
    if (socket) {
        socket.disconnect();
    }

    const newSocket = io(backendUrl, {
        query: { userId: userData._id },
        transports: ["websocket"],
    });

    newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", (userIds) => {
        console.log("ONLINE USERS:", userIds);
        setOnlineUsers(userIds);
    });

    setSocket(newSocket);
};

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                authUser,
                onlineUsers, // ✅ fixed
                socket,
                login,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
