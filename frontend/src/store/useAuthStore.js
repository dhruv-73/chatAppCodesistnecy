import { create } from "zustand"
import axiosInstance from "../lib/axios"
import toast from "react-hot-toast"
import { io } from "socket.io-client"

const BASE_URL=import.meta.env.MODE==='development' ? 'http://localhost:3000' : '/';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/users/check")
            if (res.status === 200) {
                set({ authUser: res.data })
                get().connectToSocket()
            }
        } catch (error) {
            console.error("Error checking auth:", error);
            set({ authUser: null })

        }
        finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/users/register", data)
            if (res.status === 201) {
                set({ authUser: res.data.newUser })
                get().connectToSocket()
                toast.success("Account created successfully!")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed. Please try again.")
            console.error("Signup error:", error)
        }
        finally {
            set({ isSigningUp: false })
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/users/logout")
            if (res.status === 200) {
                set({ authUser: null })
                get().disconnectFromSocket()
                toast.success("Logged out successfully!")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed. Please try again.")
            console.error("Logout error:", error)
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/users/login", data)
            if (res.status === 200) {
                set({ authUser: res.data.user })
                get().connectToSocket()
                toast.success("Logged in successfully!")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed. Please try again.")
            console.error("Login error:", error)
        }
        finally {
            set({ isLoggingIn: false })
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.post("/users/update-profile", data)
            if (res.status === 200) {
                set({ authUser: res.data.user })
                toast.success("Profile updated successfully!")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile update failed. Please try again.")
            console.error("Profile update error:", error)
        }
        finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectToSocket: () => {    
        const socket = io(BASE_URL, {
            query: { userid: get().authUser._id }
        })

        if (!get().authUser || socket.connected) return;

        socket.on("connect", () => {
            console.log("Connected to socket server")
        })
        set({ socket: socket })

        socket.on("getOnlineUsers", (users) => {
            set({ onlineUsers: users })
        })
    },
    disconnectFromSocket: () => {
        const socket = get().socket
        if (socket) {
            socket.disconnect()
            set({ socket: null })
            console.log("Disconnected from socket server")
        }
    }

}))