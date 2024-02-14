import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineAnnotation,
    HiOutlineQuestionMarkCircle,
    HiOutlineCog
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS_ADMIN = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/',
        icon: <HiOutlineViewGrid />
    },
    {
        key: 'profile',
        label: 'Profile',
        path: '/profile',
        icon: <HiOutlineCube />
    },
    {
        key: 'proposal',
        label: 'Proposal Submission',
        path: '/proposal',
        icon: <HiOutlineDocumentText />
    },
    {
        key: 'supervisor',
        label: 'SupeVisor',
        path: '/supervisor',
        icon: <HiOutlineUsers />
    },

    {
        key: 'student',
        label: 'Students',
        path: '/students',
        icon: <HiOutlineUsers />
    }
]
export const DASHBOARD_SIDEBAR_LINKS_TEACHER = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: <HiOutlineViewGrid />
    },
    {
        key: 'profile',
        label: 'Profile',
        path: '/profile',
        icon: <HiOutlineCube />
    },

    {
        key: 'student',
        label: 'Students',
        path: '/students',
        icon: <HiOutlineUsers />
    },
    {
        key: 'proposals',
        label: 'Proposals',
        path: '/view/proposals/supervisor',
        icon: <HiOutlineUsers />
    },
    {
        key: 'papers',
        label: 'Papers',
        path: '/Viewpapers',
        icon: <HiOutlineUsers />
    },

    {
        key: ' settings',
        label: 'Setting',
        path: '/settings',
        icon: <HiOutlineUsers />
    }
]
export const DASHBOARD_SIDEBAR_LINKS_STUDENT = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: <HiOutlineViewGrid />
    },
    {
        key: 'profile',
        label: 'Profile',
        path: '/profile',
        icon: <HiOutlineCube />
    },
    {
        key: 'proposal',
        label: 'Proposals',
        path: '/proposal',
        icon: <HiOutlineDocumentText />
    },

    {
        key: 'comments',
        label: 'Comments',
        path: '/comments',
        icon: <HiOutlineUsers />
    },
    {
        key: 'mycommetti',
        label: 'My Commetti',
        path: '/mycommetti',
        icon: <HiOutlineUsers />
    },
    {
        key: 'Documents',
        label: 'Documents',
        path: '/mypapers',
        icon: <HiOutlineUsers />
    },
    {
        key: 'applicaionform',
        label: 'Application Form',
        path: '/application-form',
        icon: <HiOutlineUsers />
    },
    {
        key: 'templates',
        label: 'Templates',
        path: '/templates',
        icon: <HiOutlineDocumentText />
    },
    {
        key: ' settings',
        label: 'Setting',
        path: '/settings',
        icon: <HiOutlineUsers />
    }
]


export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
    {
        key: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: <HiOutlineCog />
    },
    {
        key: 'support',
        label: 'Help & Support',
        path: '/support',
        icon: <HiOutlineQuestionMarkCircle />
    }
]

export const DASHBOARD_SIDEBAR_LINKS_COMMETTI = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: <HiOutlineViewGrid />
    },
    {
        key: 'profile',
        label: 'Profile',
        path: '/profile',
        icon: <HiOutlineCube />
    },

    {
        key: 'student',
        label: 'Students',
        path: '/students',
        icon: <HiOutlineUsers />
    },
    {
        key: 'papers',
        label: 'Documents',
        path: '/Viewpapers',
        icon: <HiOutlineUsers />
    },

    {
        key: ' settings',
        label: 'Setting',
        path: '/settings',
        icon: <HiOutlineUsers />
    }
]

export const DASHBOARD_SIDEBAR_LINKS_DAC = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: <HiOutlineViewGrid />
    },
    {
        key: 'profile',
        label: 'Profile',
        path: '/profile',
        icon: <HiOutlineCube />
    },
    {
        key: 'papers',
        label: 'Documents',
        path: '/Viewpapers',
        icon: <HiOutlineUsers />
    },

    {
        key: ' settings',
        label: 'Setting',
        path: '/settings',
        icon: <HiOutlineUsers />
    }
]