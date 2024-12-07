"use client"

import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { BookOpen, BarChart2, Calendar, Clock, Sun, Moon, Printer, Sparkles, GraduationCap, Zap, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, AlertCircle, Trash2, Award, Edit2, MessageCircle, UserCircle, Mail, School, Hash, Building2, HelpCircle, Link, Eye, EyeOff, LogOut, Lock, Unlock, Download, Upload, X, Info, Camera } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { createGlobalStyle } from 'styled-components'

const LazyPieChart = lazy(() => import('recharts').then(module => ({ default: module.PieChart })))
const LazyBarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })))

interface Subject {
  id: string
  name: string
  total: number
  attended: number
  percentage: number
  canBunk: boolean
  required: number | 'N/A'
  bunkable: number
  indicator: string
  color: string
}

interface Timetable {
  [key: string]: string[]
}

interface UserProfile {
  name: string
  usn: string
  college: string
  portfolioLink?: string
  profilePic?: string
}


const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#AED581']
const appNames = ["BB", "Bunk Buddy"]
const LOGO_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Black_and_White_Circle_Business_Logo__1_-removebg-preview%20(1)-QMviOZlsWACAB8MDsr0cXIvB6xV2Rq.png"
const DEVELOPER_PIC_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Simple%20Profile%20Photo%20Instagram%20Post%20(6)-fPATo7ykRgu1WEnrlgKyW8jYNUhP75.png"

const GlobalStyle = createGlobalStyle`
  html {
    scroll-behavior: smooth;
  }
  @media (max-width: 640px) {
    .recharts-wrapper {
      font-size: 12px;
    }
    .recharts-legend-wrapper {
      font-size: 10px;
    }
  }
`

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-blue-400 to-purple-500 dark:from-gray-900 dark:to-indigo-950 flex items-center justify-center z-50">
    <div className="text-center">
      <motion.img
        src={LOGO_URL}
        alt="Bunk Buddy Logo"
        className="w-32 h-32 mx-auto mb-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="w-48 h-2 bg-white/20 rounded-full overflow-hidden mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  </div>
)

const FloatingCard = ({ children }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
  >
    {children}
  </motion.div>
)

const ProgressBar = ({ value, color = "bg-blue-500" }) => {
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      width: `${value}%`,
      transition: { duration: 0.8, ease: "easeOut" }
    })
  }, [value, controls])

  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${color}`}
        initial={{ width: "0%" }}
        animate={controls}
      />
    </div>
  )
}

const TypeWriter = ({ words }) => {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [reverse, setReverse] = useState(false)

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true)
      return
    }

    if (subIndex === 0 && reverse) {
      setReverse(false)
      setIndex((prev) => (prev + 1) % words.length)
      return
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1))
    }, Math.max(reverse ? 75 : subIndex === words[index].length ? 1000 : 150, parseInt(Math.random() * 350)))

    return () => clearTimeout(timeout)
  }, [subIndex, index, reverse, words])

  return (
    <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      {`${words[index].substring(0, subIndex)}${subIndex === words[index].length ? '' : '|'}`}
    </span>
  )
}

const AchievementUnlocked = ({ achievement }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
  >
    <div className="flex items-center">
      <Award className="mr-2" />
      <div>
        <h3 className="font-bold">Achievement Unlocked!</h3>
        <p>{achievement}</p>
      </div>
    </div>
  </motion.div>
)

const PinInput = ({ onSubmit, isNewPin = false }) => {
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pin.length !== 4) {
      setErrorMessage('PIN must be 4 digits')
      toast.error('PIN must be 4 digits')
      return
    }
    onSubmit(pin)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pin" className="text-center block">{isNewPin ? 'Set New PIN' : 'Enter PIN'}</Label>
        <div className="relative">
          <Input
            id="pin"
            type={showPin ? "text" : "password"}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
              setErrorMessage('')
            }}
            maxLength={4}
            pattern="\d{4}"
            required
            className="text-center text-2xl tracking-widest"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPin(!showPin)}
          >
            {showPin ? (
              <EyeOff className="h-5 w-5 text-gray-500" />
            ) : (
              <Eye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-center font-semibold">{errorMessage}</p>
      )}
      <Button type="submit" className="w-full">
        {isNewPin ? 'Set PIN' : 'Submit'}
      </Button>
    </form>
  )
}

const ProfileSetup = ({ onSubmit, initialProfile = null }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || {
    name: '',
    usn: '',
    college: '',
    portfolioLink: '',
    profilePic: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(profile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile({ ...profile, profilePic: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <Avatar className="w-32 h-32">
            <AvatarImage src={profile.profilePic || LOGO_URL} alt="Profile picture" />
            <AvatarFallback>{profile.name ? profile.name[0] : 'BB'}</AvatarFallback>
          </Avatar>
          <label htmlFor="profile-pic" className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer">
            <Camera className="w-5 h-5" />
            <input
              id="profile-pic"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="usn">USN</Label>
          <Input
            id="usn"
            value={profile.usn}
            onChange={(e) => setProfile({ ...profile, usn: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="college">College</Label>
          <Input
            id="college"
            value={profile.college}
            onChange={(e) => setProfile({ ...profile, college: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="portfolioLink">Portfolio Link (Optional)</Label>
          <Input
            id="portfolioLink"
            value={profile.portfolioLink}
            onChange={(e) => setProfile({ ...profile, portfolioLink: e.target.value })}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">{initialProfile ? 'Update Profile' : 'Set Up Profile'}</Button>
    </form>
  )
}

const OfflineMessage = () => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className="fixed top-4 right-4 bg-yellow-500 text-white p-4 rounded-lg shadow-lg z-50"
  >
    <div className="flex items-center">
      <WifiOff className="mr-2" />
      <div>
        <h3 className="font-bold">Offline Mode</h3>
        <p>You are currently offline. Some features may be limited.</p>
      </div>
    </div>
  </motion.div>
)


const ProfileSetup = ({ onSubmit, initialProfile = null }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || {
    name: '',
    usn: '',
    college: '',
    portfolioLink: '',
    profilePic: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(profile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile({ ...profile, profilePic: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <Avatar className="w-32 h-32">
            <AvatarImage src={profile.profilePic || LOGO_URL} alt="Profile picture" />
            <AvatarFallback>{profile.name ? profile.name[0] : 'BB'}</AvatarFallback>
          </Avatar>
          <label htmlFor="profile-pic" className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer">
            <Camera className="w-5 h-5" />
            <input
              id="profile-pic"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="usn">USN</Label>
          <Input
            id="usn"
            value={profile.usn}
            onChange={(e) => setProfile({ ...profile, usn: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="college">College</Label>
          <Input
            id="college"
            value={profile.college}
            onChange={(e) => setProfile({ ...profile, college: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="portfolioLink">Portfolio Link (Optional)</Label>
          <Input
            id="portfolioLink"
            value={profile.portfolioLink}
            onChange={(e) => setProfile({ ...profile, portfolioLink: e.target.value })}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">{initialProfile ? 'Update Profile' : 'Set Up Profile'}</Button>
    </form>
  )
}

export default function Component() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [threshold, setThreshold] = useState<number>(75)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectName, setSubjectName] = useState<string>('')
  const [totalClasses, setTotalClasses] = useState<string>('')
  const [attendedClasses, setAttendedClasses] = useState<string>('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [timetable, setTimetable] = useState<Timetable>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  })
  const [activeTab, setActiveTab] = useState<string>("add-subject")
  const [isLoading, setIsLoading] = useState(true)
  const [showAchievement, setShowAchievement] = useState<string | null>(null)
  const [streakCount, setStreakCount] = useState<number>(0)
  const [isPomodoro, setIsPomodoro] = useState<boolean>(false)
  const [pomodoroTime, setPomodoroTime] = useState<number>(25)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60)
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [isProfileUpdateMode, setIsProfileUpdateMode] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [isNewPin, setIsNewPin] = useState(false)
  const [showForgotPinDialog, setShowForgotPinDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importData, setImportData] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [setupStep, setSetupStep] = useState<'pin' | 'profile' | 'tutorial' | 'complete'>('pin')
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const [showDeveloperDialog, setShowDeveloperDialog] = useState(false)
  const [isOffline, setIsOffline] = useState(false)


  useEffect(() => {
    const savedPin = localStorage.getItem('bunkBuddyPin')
    const savedProfile = localStorage.getItem('bunkBuddyProfile')
    const savedTutorialStatus = localStorage.getItem('bunkBuddyTutorialSeen')

    if (!savedPin) {
      setIsNewPin(true)
      setShowPinDialog(true)
      setSetupStep('pin')
    } else if (!savedProfile) {
      setSetupStep('profile')
    } else if (!savedTutorialStatus) {
      setSetupStep('tutorial')
    } else {
      setSetupStep('complete')
      setShowPinDialog(true)
    }

    const savedSubjects = localStorage.getItem('bunkBuddySubjects')
    const savedTimetable = localStorage.getItem('bunkBuddyTimetable')
    const savedThreshold = localStorage.getItem('bunkBuddyThreshold')
    const savedDarkMode = localStorage.getItem('bunkBuddyDarkMode')
    const savedStreakCount = localStorage.getItem('bunkBuddyStreakCount')

    if (savedSubjects) setSubjects(JSON.parse(savedSubjects))
    if (savedTimetable) setTimetable(JSON.parse(savedTimetable))
    if (savedThreshold) setThreshold(Number(savedThreshold))
    if (savedDarkMode) setIsDarkMode(JSON.parse(savedDarkMode))
    if (savedStreakCount) setStreakCount(Number(savedStreakCount))
    if (savedProfile) setUserProfile(JSON.parse(savedProfile))
    if (savedTutorialStatus) setHasSeenTutorial(JSON.parse(savedTutorialStatus))

    setTimeout(() => setIsLoading(false), 2000)

    window.addEventListener('online', () => setIsOffline(false))
    window.addEventListener('offline', () => setIsOffline(true))

    return () => {
      window.removeEventListener('online', () => setIsOffline(false))
      window.removeEventListener('offline', () => setIsOffline(true))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('bunkBuddySubjects', JSON.stringify(subjects))
    localStorage.setItem('bunkBuddyTimetable', JSON.stringify(timetable))
    localStorage.setItem('bunkBuddyThreshold', threshold.toString())
    localStorage.setItem('bunkBuddyDarkMode', JSON.stringify(isDarkMode))
    localStorage.setItem('bunkBuddyStreakCount', streakCount.toString())
    localStorage.setItem('bunkBuddyTutorialSeen', JSON.stringify(hasSeenTutorial))
  }, [subjects, timetable, threshold, isDarkMode, streakCount, hasSeenTutorial])

  useEffect(() => {
    if (userProfile) localStorage.setItem('bunkBuddyProfile', JSON.stringify(userProfile))
  }, [userProfile])

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
    document.title = "BunkBuddy - Attendance Tracker"
  }, [isDarkMode])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsTimerRunning(false)
      setShowAchievement("Pomodoro Session Completed!")
      setTimeout(() => setShowAchievement(null), 3000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeft])

  const handlePinSubmit = useCallback((pin: string) => {
    if (isNewPin) {
      localStorage.setItem('bunkBuddyPin', pin)
      setIsAuthenticated(true)
      setShowPinDialog(false)
      setSetupStep('profile')
      toast.success('PIN set successfully!')
    } else {
      const savedPin = localStorage.getItem('bunkBuddyPin')
      if (pin === savedPin) {
        setIsAuthenticated(true)
        setShowPinDialog(false)
        setSetupStep('complete')
        toast.success('Login successful!')
      } else {
        setErrorMessage('Incorrect PIN. Please try again.')
        toast.error('Incorrect PIN')
      }
    }
  }, [isNewPin])

  const handleProfileSubmit = useCallback((profileData: UserProfile) => {
    setUserProfile(profileData)
    setShowProfileDialog(false)
    setIsProfileUpdateMode(false)
    localStorage.setItem('bunkBuddyProfile', JSON.stringify(profileData))
    if (!hasSeenTutorial) {
      setSetupStep('tutorial')
      setShowTutorial(true)
    } else {
      setSetupStep('complete')
    }
    toast.success('Profile updated successfully!')
  }, [hasSeenTutorial])

  const handleTutorialComplete = useCallback(() => {
    setShowTutorial(false)
    setHasSeenTutorial(true)
    localStorage.setItem('bunkBuddyTutorialSeen', JSON.stringify(true))
    setSetupStep('complete')
    toast.success('Tutorial completed! Welcome to BunkBuddy!')
  }, [])

  const handleForgotPin = useCallback(() => {
    setShowForgotPinDialog(true)
  }, [])

  const handleResetApp = useCallback(() => {
    localStorage.clear()
    window.location.reload()
  }, [])

  const getAttendanceIndicator = useCallback((attendance: number): string => {
    if (attendance < 50) return 'Low Attendance'
    if (attendance >= 50 && attendance < threshold) return 'Medium Attendance'
    return 'Good Attendance'
  }, [threshold])

  const calculateRequiredClasses = useCallback((total: number, attended: number, threshold: number): number | 'N/A' => {
    const attendance = (attended / total) * 100
    if (attendance >= threshold) return 'N/A'
    return Math.ceil((threshold * total - 100 * attended) / (100 - threshold))
  }, [])

  const calculateBunkableClasses = useCallback((total: number, attended: number, threshold: number): number => {
    const attendance = (attended / total) * 100
    if (attendance <= threshold) return 0
    return Math.floor((attended - (threshold * total) / 100) / (threshold / 100))
  }, [])

  const handleAddSubject = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!subjectName || !totalClasses || !attendedClasses) {
      toast.error('Please fill in all fields!')
      return
    }
    const total = parseInt(totalClasses)
    const attended = parseInt(attendedClasses)
    const attendance = (attended / total) * 100
    const requiredClasses = calculateRequiredClasses(total, attended, threshold)
    const bunkableClasses = calculateBunkableClasses(total, attended, threshold)

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: subjectName,
      total,
      attended,
      percentage: Number(attendance.toFixed(2)),
      canBunk: attendance >= threshold,
      required: requiredClasses,
      bunkable: bunkableClasses,
      indicator: getAttendanceIndicator(attendance),
      color: COLORS[subjects.length % COLORS.length],
    }

    setSubjects(prevSubjects => [...prevSubjects, newSubject])
    setSubjectName('')
    setTotalClasses('')
    setAttendedClasses('')
    setSelectedDays([])

    setStreakCount(prevStreak => {
      const newStreak = prevStreak + 1
      if (newStreak === 5) {
        setShowAchievement("5 Day Streak! Keep it up!")
        setTimeout(() => setShowAchievement(null), 3000)
      }
      return newStreak
    })

    toast.success('Subject added successfully!')
  }, [subjectName, totalClasses, attendedClasses, threshold, subjects.length, calculateRequiredClasses, calculateBunkableClasses, getAttendanceIndicator])

  const handleAddToTimetable = useCallback(() => {
    if (!subjectName || selectedDays.length === 0) {
      toast.error('Please enter a subject name and select at least one day.')
      return
    }

    setTimetable(prevTimetable => {
      const newTimetable = { ...prevTimetable }
      selectedDays.forEach((day) => {
        if (!newTimetable[day].includes(subjectName)) {
          newTimetable[day] = [...newTimetable[day], subjectName]
        }
      })
      return newTimetable
    })
    setSelectedDays([])
    toast.success('Subject added to timetable!')
  }, [subjectName, selectedDays])

  const handleDeleteSubject = useCallback((id: string) => {
    setSubjects(prevSubjects => prevSubjects.filter(subject => subject.id !== id))
    setTimetable(prevTimetable => {
      const newTimetable = { ...prevTimetable }
      Object.keys(newTimetable).forEach(day => {
        newTimetable[day] = newTimetable[day].filter(subject =>
          subject !== subjects.find(s => s.id === id)?.name
        )
      })
      return newTimetable
    })
    toast.info('Subject deleted successfully')
  }, [subjects])

  const handleEditSubject = useCallback((subject: Subject) => {
    setEditingSubject(subject)
    setSubjectName(subject.name)
    setTotalClasses(subject.total.toString())
    setAttendedClasses(subject.attended.toString())
    setActiveTab("add-subject")
  }, [])

  const handleUpdateSubject = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSubject || !subjectName || !totalClasses || !attendedClasses) {
      toast.error('Please fill in all fields!')
      return
    }
    const total = parseInt(totalClasses)
    const attended = parseInt(attendedClasses)
    const attendance = (attended / total) * 100
    const requiredClasses = calculateRequiredClasses(total, attended, threshold)
    const bunkableClasses = calculateBunkableClasses(total, attended, threshold)

    const updatedSubject: Subject = {
      ...editingSubject,
      name: subjectName,
      total,
      attended,
      percentage: Number(attendance.toFixed(2)),
      canBunk: attendance >= threshold,
      required: requiredClasses,
      bunkable: bunkableClasses,
      indicator: getAttendanceIndicator(attendance),
    }

    setSubjects(prevSubjects => prevSubjects.map(s => s.id === editingSubject.id ? updatedSubject : s))
    setSubjectName('')
    setTotalClasses('')
    setAttendedClasses('')
    setEditingSubject(null)
    toast.success('Subject updated successfully')
  }, [editingSubject, subjectName, totalClasses, attendedClasses, threshold, calculateRequiredClasses, calculateBunkableClasses, getAttendanceIndicator])

  const calculateOverallAttendance = useMemo(() => {
    if (subjects.length === 0) return 0
    const totalAttended = subjects.reduce((sum, subject) => sum + subject.attended, 0)
    const totalClasses = subjects.reduce((sum, subject) => sum + subject.total, 0)
    return Number(((totalAttended / totalClasses) * 100).toFixed(2))
  }, [subjects])

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return

    const { source, destination } = result
    const sourceDay = source.droppableId
    const destDay = destination.droppableId

    setTimetable(prevTimetable => {
      const newTimetable = { ...prevTimetable }
      const [removed] = newTimetable[sourceDay].splice(source.index, 1)
      newTimetable[destDay].splice(destination.index, 0, removed)
      return newTimetable
    })
  }, [])

  const getAttendanceTrend = useMemo(() => {
    if (subjects.length < 2) return 'neutral'
    const sortedSubjects = [...subjects].sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())
    const recentAttendance = sortedSubjects[0].percentage
    const previousAttendance = sortedSubjects[1].percentage
    if (recentAttendance > previousAttendance) return 'up'
    if (recentAttendance < previousAttendance) return 'down'
    return 'neutral'
  }, [subjects])

  const getSubjectsAtRisk = useMemo(() => {
    return subjects.filter(subject => subject.percentage < threshold)
  }, [subjects, threshold])

  const getBunkableSubjects = useMemo(() => {
    return subjects.filter(subject => subject.canBunk)
  }, [subjects])

  const getAttendanceDistribution = useMemo(() => {
    const distribution = { Low: 0, Medium: 0, High: 0 }
    subjects.forEach(subject => {
      if (subject.percentage < 50) distribution.Low++
      else if (subject.percentage < threshold) distribution.Medium++
      else distribution.High++
    })
    return [
      { name: 'Low', value: distribution.Low, color: '#EF4444' },
      { name: 'Medium', value: distribution.Medium, color: '#F59E0B' },
      { name: 'High', value: distribution.High, color: '#10B981' }
    ]
  }, [subjects, threshold])

  const getSortedSubjectsForChart = useMemo(() => {
    return [...subjects].sort((a, b) => b.percentage - a.percentage)
  }, [subjects])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const togglePomodoro = useCallback(() => {
    setIsPomodoro(prevState => !prevState)
    setTimeLeft(pomodoroTime * 60)
    setIsTimerRunning(false)
  }, [pomodoroTime])

  const startStopTimer = useCallback(() => {
    setIsTimerRunning(prevState => !prevState)
  }, [])

  const resetTimer = useCallback(() => {
    setTimeLeft(pomodoroTime * 60)
    setIsTimerRunning(false)
  }, [pomodoroTime])

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }, [])

  const handleFeedback = useCallback(() => {
    window.location.href = `mailto:maazmohammed112@gmail.com?subject=BunkBuddy Feedback`
  }, [])

  const handleShowTutorial = useCallback(() => {
    setShowTutorial(true)
    setTutorialStep(0)
  }, [])

  const handleExportData = useCallback(() => {
    const data = {
      subjects,
      timetable,
      threshold,
      streakCount,
      userProfile,
    }
    const dataStr = JSON.stringify(data)
    const encryptedData = btoa(dataStr)

    navigator.clipboard.writeText(encryptedData).then(() => {
      toast.success('Data exported and copied to clipboard!')
    }, () => {
      toast.error('Failed to copy data to clipboard')
    })
  }, [subjects, timetable, threshold, streakCount, userProfile])

  const handleImportData = useCallback((encryptedData: string) => {
    try {
      const dataStr = atob(encryptedData)
      const data = JSON.parse(dataStr)
      setSubjects(data.subjects || [])
      setTimetable(data.timetable || {})
      setThreshold(data.threshold || 75)
      setStreakCount(data.streakCount || 0)
      setUserProfile(data.userProfile || null)
      toast.success('Data imported successfully!')
    } catch (error) {
      toast.error('Error importing data. Please try again.')
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (setupStep === 'pin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 dark:from-gray-900 dark:to-indigo-950 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <img
                src={LOGO_URL}
                alt="Bunk Buddy Logo"
                className="w-24 h-24"
              />
            </motion.div>
            <CardTitle className="text-2xl font-bold">
              Welcome to BunkBuddy!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PinInput onSubmit={handlePinSubmit} isNewPin={true} />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (setupStep === 'profile') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 dark:from-gray-900 dark:to-indigo-950 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Set Up Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileSetup onSubmit={handleProfileSubmit} />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 dark:from-gray-900 dark:to-indigo-950 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <img
                src={LOGO_URL}
                alt="Bunk Buddy Logo"
                className="w-24 h-24"
              />
            </motion.div>
            <CardTitle className="text-2xl font-bold">
              Welcome Back!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PinInput onSubmit={handlePinSubmit} isNewPin={false} />
            <Button variant="link" onClick={handleForgotPin} className="w-full mt-4">
              Forgot PIN?
            </Button>
          </CardContent>
        </Card>
        <AlertDialog open={showForgotPinDialog} onOpenChange={setShowForgotPinDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset App</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reset the app? This will delete all your data and you'll need to start over.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetApp}>Reset App</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  return (
    <>
      <GlobalStyle />
      <div
        className={`min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-400 to-purple-500 dark:from-gray-900 dark:to-indigo-950 ${isDarkMode ? 'dark' : ''} overflow-x-hidden transition-opacity duration-500 ease-in-out`}
        style={{ opacity: 1 }}
      >
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

        <AnimatePresence>
          {showAchievement && <AchievementUnlocked achievement={showAchievement} />}
          {isOffline && <OfflineMessage />}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
          <FloatingCard>
            <header className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
              <motion.div
                className="flex items-center space-x-4 mb-4 md:mb-0"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full overflow-hidden bg-black"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <img
                    src={LOGO_URL}
                    alt="Bunk Buddy Logo"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div>
                  <motion.h1
                    className="text-2xl md:text-4xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    BunkBuddy
                  </motion.h1>
                  <motion.p
                    className="text-sm text-gray-500 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <TypeWriter words={["PLAN BUNKS", "TRACK ATTENDANCE", "BOOST PRODUCTIVITY"]} />
                  </motion.p>
                </div>
              </motion.div>
              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="relative"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isDarkMode ? "moon" : "sun"}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                      </motion.div>
                    </AnimatePresence>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrint}
                    className="relative"
                  >
                    <Printer className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={togglePomodoro}
                    className="relative"
                  >
                    <Clock className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShowTutorial}
                    className="relative"
                  >
                    <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </motion.div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative"
                    >
                      <UserCircle className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Profile Information</DialogTitle>
                      <DialogDescription>
                        Your academic profile details
                      </DialogDescription>
                    </DialogHeader>
                    {userProfile && (
                      <div className="py-4">
                        <div className="flex justify-center mb-4">
                          <Avatar className="w-24 h-24">
                            <AvatarImage src={userProfile.profilePic || LOGO_URL} alt="Profile picture" />
                            <AvatarFallback>{userProfile.name ? userProfile.name[0] : 'BB'}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="font-medium">Name</Label>
                            <span className="text-right">{userProfile.name}</span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <Label className="font-medium">USN</Label>
                            <span className="text-right">{userProfile.usn}</span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <Label className="font-medium">College</Label>
                            <span className="text-right">{userProfile.college}</span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <Label className="font-medium">Portfolio</Label>
                            {userProfile.portfolioLink ? (
                              <a href={userProfile.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                View Portfolio
                              </a>
                            ) : (
                              <span>Not provided</span>
                            )}
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            <Label className="font-medium">Overall Attendance</Label>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold">{calculateOverallAttendance.toFixed(2)}%</span>
                              <ProgressBar value={calculateOverallAttendance} color={calculateOverallAttendance >= threshold ? "bg-green-500" : "bg-red-500"} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter className="flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <Button onClick={() => {
                          setIsProfileUpdateMode(true)
                          setShowProfileDialog(true)
                        }} className="w-full">
                          Update Profile
                        </Button>
                        <Button onClick={() => setShowPinDialog(true)} className="w-full">
                          <Lock className="mr-2 h-4 w-4" />
                          Update PIN
                        </Button>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </header>
          </FloatingCard>

          {isPomodoro && (
            <FloatingCard>
              <Card>
                <CardHeader>
                  <CardTitle>Pomodoro Timer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
                    <div className="flex space-x-2">
                      <Button onClick={startStopTimer}>
                        {isTimerRunning ? 'Pause' : 'Start'}
                      </Button>
                      <Button onClick={resetTimer} variant="outline">Reset</Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="pomodoro-time">Session Length (minutes):</Label>
                      <Input
                        id="pomodoro-time"
                        type="number"
                        value={pomodoroTime}
                        onChange={(e) => setPomodoroTime(Number(e.target.value))}
                        className="w-20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FloatingCard>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="grid grid-cols-4 gap-2 md:gap-4 bg-white/20 backdrop-blur-lg p-1 rounded-lg">
                  {["add-subject", "timetable", "statistics"].map((tab) => (
                    <motion.div
                      key={tab}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <TabsTrigger
                        value={tab}
                        className="w-full capitalize text-white data-[state=active]:bg-white data-[state=active]:bg-white data-[state=active]:text-blue-600"
                      >
                        {tab.replace("-", " ")}
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>

                <TabsContent value="add-subject">
                  <FloatingCard>
                    <Card>
                      <CardHeader>
                        <CardTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={editingSubject ? handleUpdateSubject : handleAddSubject} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="subjectName">Subject Name</Label>
                            <Input
                              id="subjectName"
                              value={subjectName}
                              onChange={(e) => setSubjectName(e.target.value)}
                              placeholder="Enter subject name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="totalClasses">Total Classes</Label>
                            <Input
                              id="totalClasses"
                              type="number"
                              value={totalClasses}
                              onChange={(e) => setTotalClasses(e.target.value)}
                              placeholder="Enter total classes"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="attendedClasses">Attended Classes</Label>
                            <Input
                              id="attendedClasses"
                              type="number"
                              value={attendedClasses}
                              onChange={(e) => setAttendedClasses(e.target.value)}
                              placeholder="Enter attended classes"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="threshold">Attendance Threshold (%)</Label>
                            <Slider
                              id="threshold"
                              min={0}
                              max={100}
                              step={1}
                              value={[threshold]}
                              onValueChange={(value) => setThreshold(value[0])}
                            />
                            <div className="text-center">{threshold}%</div>
                          </div>
                          {!editingSubject && (
                            <div className="space-y-2">
                              <Label>Select Days</Label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {Object.keys(timetable).map((day) => (
                                  <div key={day} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={day}
                                      checked={selectedDays.includes(day)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedDays([...selectedDays, day])
                                        } else {
                                          setSelectedDays(selectedDays.filter((d) => d !== day))
                                        }
                                      }}
                                    />
                                    <Label htmlFor={day}>{day}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button type="submit" className="flex-1">
                              <BookOpen className="mr-2 h-4 w-4" />
                              {editingSubject ? 'Update Subject' : 'Add Subject'}
                            </Button>
                            {!editingSubject && (
                              <Button type="button" variant="outline" onClick={handleAddToTimetable} className="flex-1">
                                <Calendar className="mr-2 h-4 w-4" />
                                Add to Timetable
                              </Button>
                            )}
                            {editingSubject && (
                              <Button type="button" variant="outline" onClick={() => setEditingSubject(null)} className="flex-1">
                                Cancel
                              </Button>
                            )}
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </FloatingCard>
                </TabsContent>

                <TabsContent value="timetable">
                  <FloatingCard>
                    <Card>
                      <CardHeader>
                        <CardTitle>Weekly Schedule</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DragDropContext onDragEnd={onDragEnd}>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {Object.entries(timetable).map(([day, subjectNames]) => (
                              <Droppable droppableId={day} key={day}>
                                {(provided) => (
                                  <div {...provided.droppableProps} ref={provided.innerRef}>
                                    <Card>
                                      <CardHeader>
                                        <CardTitle>{day}</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        {subjectNames.map((subjectName, index) => {
                                          const subject = subjects.find(s => s.name === subjectName)
                                          return (
                                            <Draggable key={subjectName} draggableId={`${day}-${subjectName}`} index={index}>
                                              {(provided) => (
                                                <motion.div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  className="bg-secondary p-3 mb-2 rounded-lg shadow-sm"
                                                  whileHover={{ scale: 1.02 }}
                                                  whileTap={{ scale: 0.98 }}
                                                  initial={{ opacity: 0, y: 20 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{ delay: index * 0.1 }}
                                                >
                                                  <div className="flex justify-between items-center">
                                                    <span className="font-medium">{subjectName}</span>
                                                    {subject && (
                                                      <div className={`flex items-center ${
                                                        subject.percentage >= threshold ? 'text-green-500' :
                                                        subject.percentage >= 50 ? 'text-yellow-500' : 'text-red-500'
                                                      }`}>
                                                        {subject.percentage >= threshold ? (
                                                          <>
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            <span className="text-xs">Can bunk</span>
                                                          </>
                                                        ) : subject.percentage >= 50 ? (
                                                          <>
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            <span className="text-xs">Caution</span>
                                                          </>
                                                        ) : (
                                                          <>
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            <span className="text-xs">Cannot bunk</span>
                                                          </>
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                  {subject && (
                                                    <>
                                                      <div className="mt-2">
                                                        <ProgressBar
                                                          value={subject.percentage}
                                                          color={
                                                            subject.percentage >= threshold
                                                              ? "bg-green-500"
                                                              : subject.percentage >= 50
                                                              ? "bg-yellow-500"
                                                              : "bg-red-500"
                                                          }
                                                        />
                                                      </div>
                                                      <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                                                        Attendance: {subject.percentage.toFixed(2)}%
                                                      </div>
                                                    </>
                                                  )}
                                                </motion.div>
                                              )}
                                            </Draggable>
                                          )
                                        })}
                                        {provided.placeholder}
                                      </CardContent>
                                    </Card>
                                  </div>
                                )}
                              </Droppable>
                            ))}
                          </div>
                        </DragDropContext>
                      </CardContent>
                    </Card>
                  </FloatingCard>
                </TabsContent>

                <TabsContent value="statistics">
                  <FloatingCard>
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <motion.div
                          className="space-y-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Overall Attendance</h3>
                            <div className="flex items-center justify-between mb-2">
                              <ProgressBar value={calculateOverallAttendance} color={calculateOverallAttendance >= threshold ? "bg-green-500" : "bg-red-500"} />
                              <span className="text-2xl font-bold ml-4">{calculateOverallAttendance}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                              <span>Threshold: {threshold}%</span>
                              <span>
                                {getAttendanceTrend === 'up' && <TrendingUp className="inline-block mr-1 text-green-500" />}
                                {getAttendanceTrend === 'down' && <TrendingDown className="inline-block mr-1 text-red-500" />}
                                {getAttendanceTrend === 'neutral' && <span className="inline-block mr-1">-</span>}
                                Trend
                              </span>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-2">Subject Breakdown</h3>
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Attendance</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Required</TableHead>
                                    <TableHead>Bunkable</TableHead>
                                    <TableHead>Action</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {subjects.map((subject) => (
                                    <TableRow key={subject.id}>
                                      <TableCell>{subject.name}</TableCell>
                                      <TableCell>
                                        <div className="flex items-center">
                                          <ProgressBar value={subject.percentage} color={subject.percentage >= threshold ? "bg-green-500" : "bg-red-500"} />
                                          <span className="ml-2">{subject.percentage.toFixed(2)}%</span>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                                          ${subject.indicator === 'Low Attendance' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                            subject.indicator === 'Medium Attendance' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                                          {subject.indicator}
                                        </span>
                                      </TableCell>
                                      <TableCell>{subject.required}</TableCell>
                                      <TableCell>{subject.bunkable}</TableCell>
                                      <TableCell>
                                        <div className="flex space-x-2">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEditSubject(subject)}
                                          >
                                            <Edit2 className="h-4 w-4" />
                                            <span className="sr-only">Edit subject</span>
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteSubject(subject.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete subject</span>
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                            <div className="mt-2 flex justify-center md:hidden">
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4 mr-2" />
                                Swipe for more options
                              </Button>
                            </div>
                          </div>

                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Card>
                              <CardHeader>
                                <CardTitle>Attendance Distribution</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Suspense fallback={<div>Loading chart...</div>}>
                                  <LazyPieChart data={getAttendanceDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {getAttendanceDistribution.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                    <Tooltip />
                                    <Legend />
                                  </LazyPieChart>
                                </Suspense>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle>Attendance Trends</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Suspense fallback={<div>Loading chart...</div>}>
                                  <LazyBarChart data={getSortedSubjectsForChart}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="percentage" fill="#3B82F6" />
                                  </LazyBarChart>
                                </Suspense>
                              </CardContent>
                            </Card>
                          </motion.div>

                          <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <Card>
                              <CardHeader>
                                <CardTitle>Total Subjects</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-center">
                                  <BookOpen className="h-8 w-8 text-blue-500 mr-2" />
                                  <span className="text-3xl font-bold">{subjects.length}</span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle>Subjects at Risk</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-center">
                                  <AlertTriangle className="h-8 w-8 text-red-500 mr-2" />
                                  <span className="text-3xl font-bold">{getSubjectsAtRisk.length}</span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle>Bunkable Subjects</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-center">
                                  <Zap className="h-8 w-8 text-yellow-500 mr-2" />
                                  <span className="text-3xl font-bold">{getBunkableSubjects.length}</span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle>Attendance Streak</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-center">
                                  <Award className="h-8 w-8 text-green-500 mr-2" />
                                  <span className="text-3xl font-bold">{streakCount} days</span>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>

                          <div className="flex justify-center space-x-4">
                            <Button onClick={handleExportData}>
                              <Download className="mr-2 h-4 w-4" />
                              Export Data
                            </Button>
                            <Button onClick={() => setShowImportDialog(true)}>
                              <Upload className="mr-2 h-4 w-4" />
                              Import Data
                            </Button>
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </FloatingCard>
                </TabsContent>
              </Tabs>
            </motion.div>
          </AnimatePresence>

          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-white/80 py-4"
          >
            © 2024 BunkBuddy. All rights reserved. Developed by Mohammed Maaz
            <div className="flex justify-center space-x-4 mt-2">
              <Button variant="link" onClick={() => setShowAboutDialog(true)}>About BunkBuddy</Button>
              <Button variant="link" onClick={() => setShowDeveloperDialog(true)}>About Developer</Button>
              <Button variant="link" onClick={handleFeedback}>Feedback</Button>
            </div>
          </motion.footer>
        </div>

        <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isNewPin ? 'Set New PIN' : 'Update PIN'}</DialogTitle>
              <DialogDescription>
                {isNewPin ? 'Please set a 4-digit PIN to secure your BunkBuddy account.' : 'Enter a new 4-digit PIN to update your accountsecurity.'}
              </DialogDescription>
            </DialogHeader>
            <PinInput onSubmit={(pin) => {
              localStorage.setItem('bunkBuddyPin', pin)
              setShowPinDialog(false)
              toast.success('PIN updated successfully!')
            }} isNewPin={true} />
          </DialogContent>
        </Dialog>

        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isProfileUpdateMode ? 'Update Profile' : 'Set Up Profile'}</DialogTitle>
            </DialogHeader>
            <ProfileSetup onSubmit={handleProfileSubmit} initialProfile={userProfile} />
          </DialogContent>
        </Dialog>

        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent>
<continuation_point>
            <DialogHeader>
              <DialogTitle>Import Data</DialogTitle>
              <DialogDescription>
                Paste the encrypted data you received from another device.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="importData" className="text-right">
                  Encrypted Data
                </Label>
                <Input
                  id="importData"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                handleImportData(importData)
                setShowImportDialog(false)
              }}>
                Import
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showAboutDialog} onOpenChange={setShowAboutDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About BunkBuddy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>BunkBuddy is your personal attendance tracker and class management tool. It helps you keep track of your attendance, plan your classes, and manage your academic schedule efficiently.</p>
              <p>Key features:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Track attendance for multiple subjects</li>
                <li>Visualize attendance statistics</li>
                <li>Plan your class schedule with a weekly timetable</li>
                <li>Set attendance goals and get insights</li>
                <li>Secure your data with PIN protection</li>
                <li>Pomodoro timer for focused study sessions</li>
                <li>Offline mode for uninterrupted access</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeveloperDialog} onOpenChange={setShowDeveloperDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About the Developer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img src={DEVELOPER_PIC_URL} alt="Developer" className="w-16 h-16 rounded-full" />
                <div>
                  <h3 className="font-bold">Mohammed Maaz</h3>
                  <p className="text-sm text-gray-500">Full Stack Developer</p>
                </div>
              </div>
              <p>Mohammed Maaz is a passionate full-stack developer with expertise in modern web technologies. He created BunkBuddy to help students manage their academic life more efficiently.</p>
              <div className="flex space-x-4">
                <Button onClick={() => window.open('https://github.com/maazmohammed112', '_blank')}>
                  GitHub
                </Button>
                <Button onClick={() => window.open('https://www.linkedin.com/in/mohammed-maaz-a-0aa730217/', '_blank')}>
                  LinkedIn
                </Button>
                <Button onClick={() => window.open('https://jqncoyzn4fzbwmwzdzisi8s8ydbfazzh.vercel.app/', '_blank')}>
                  Portfolio
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <Card className="w-full max-w-md">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>Welcome to BunkBuddy!</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setShowTutorial(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>Let's get you started with a quick tutorial:</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Add your subjects using the "Add Subject" tab</li>
                      <li>Enter the total and attended classes for each subject</li>
                      <li>Set your attendance threshold using the slider</li>
                      <li>View your timetable and statistics in the other tabs</li>
                      <li>Use the Export/Import feature in the Statistics tab to backup or transfer your data</li>
                      <li>Use the Pomodoro timer for focused study sessions</li>
                    </ol>
                    <div className="mt-4">
                      <h4 className="font-semibold">Export/Import Feature:</h4>
                      <p>To export your data, click the "Export Data" button in the Statistics tab. This will copy an encrypted version of your data to your clipboard.</p>
                      <p>To import data, click the "Import Data" button and paste the encrypted data into the provided field.</p>
                    </div>
                    <Button onClick={handleTutorialComplete} className="w-full mt-4">
                      Got it, let's start!
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
