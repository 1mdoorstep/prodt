export const MOCK_JOBS = [
  {
    id: '1',
    title: 'House Cleaning',
    description: 'Need help cleaning a 3-bedroom house',
    location: 'San Francisco, CA',
    budget: 150,
    duration: '4 hours',
    date: '2024-03-25',
    time: '09:00 AM',
    status: 'open',
    category: 'Cleaning',
    employer: {
      id: '101',
      name: 'Sarah Johnson',
      rating: 4.8,
      jobsPosted: 12,
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson',
    }
  },
  {
    id: '2',
    title: 'Moving Assistance',
    description: 'Help needed for moving furniture to new apartment',
    location: 'Los Angeles, CA',
    budget: 200,
    duration: '6 hours',
    date: '2024-03-26',
    time: '10:00 AM',
    status: 'open',
    category: 'Moving',
    employer: {
      id: '102',
      name: 'Mike Smith',
      rating: 4.9,
      jobsPosted: 8,
      avatar: 'https://ui-avatars.com/api/?name=Mike+Smith',
    }
  },
  {
    id: '3',
    title: 'Garden Maintenance',
    description: 'Weekly garden maintenance needed',
    location: 'San Jose, CA',
    budget: 120,
    duration: '3 hours',
    date: '2024-03-27',
    time: '08:00 AM',
    status: 'open',
    category: 'Gardening',
    employer: {
      id: '103',
      name: 'Emily Brown',
      rating: 4.7,
      jobsPosted: 15,
      avatar: 'https://ui-avatars.com/api/?name=Emily+Brown',
    }
  }
];

export const MOCK_WORKERS = [
  {
    id: '201',
    name: 'John Doe',
    skills: ['Cleaning', 'Moving', 'Gardening'],
    rating: 4.9,
    jobsCompleted: 45,
    hourlyRate: 25,
    availability: 'Weekdays',
    location: 'San Francisco, CA',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe',
    bio: 'Experienced in various household tasks with 3+ years of experience',
  },
  {
    id: '202',
    name: 'Lisa Wilson',
    skills: ['Cleaning', 'Pet Care', 'Errands'],
    rating: 4.8,
    jobsCompleted: 32,
    hourlyRate: 30,
    availability: 'Flexible',
    location: 'San Jose, CA',
    avatar: 'https://ui-avatars.com/api/?name=Lisa+Wilson',
    bio: 'Professional house cleaner with pet care expertise',
  },
  {
    id: '203',
    name: 'David Chen',
    skills: ['Moving', 'Assembly', 'Repairs'],
    rating: 4.7,
    jobsCompleted: 28,
    hourlyRate: 35,
    availability: 'Weekends',
    location: 'Los Angeles, CA',
    avatar: 'https://ui-avatars.com/api/?name=David+Chen',
    bio: 'Specialized in furniture assembly and moving services',
  }
];

export const MOCK_CATEGORIES = [
  {
    id: '1',
    name: 'Cleaning',
    icon: '🧹',
    color: '#4F46E5',
  },
  {
    id: '2',
    name: 'Moving',
    icon: '📦',
    color: '#7C3AED',
  },
  {
    id: '3',
    name: 'Gardening',
    icon: '🌱',
    color: '#059669',
  },
  {
    id: '4',
    name: 'Pet Care',
    icon: '🐾',
    color: '#DC2626',
  },
  {
    id: '5',
    name: 'Errands',
    icon: '🛵',
    color: '#2563EB',
  },
  {
    id: '6',
    name: 'Assembly',
    icon: '🔧',
    color: '#D97706',
  },
  {
    id: '7',
    name: 'Repairs',
    icon: '🛠️',
    color: '#4B5563',
  }
];

export const MOCK_CHATS = [
  {
    id: '1',
    participants: ['1', '201'],
    lastMessage: {
      id: 'm1',
      text: 'I can help you with the cleaning job',
      sender: '201',
      timestamp: new Date().getTime() - 3600000,
      read: true,
    },
    unreadCount: 0,
  },
  {
    id: '2',
    participants: ['1', '202'],
    lastMessage: {
      id: 'm2',
      text: 'What time should I arrive tomorrow?',
      sender: '202',
      timestamp: new Date().getTime() - 7200000,
      read: false,
    },
    unreadCount: 2,
  }
];

export const MOCK_MESSAGES = {
  '1': [
    {
      id: 'm1',
      text: 'Hi, I saw your job posting for house cleaning',
      sender: '201',
      timestamp: new Date().getTime() - 7200000,
      read: true,
    },
    {
      id: 'm2',
      text: 'Yes, are you available this Saturday?',
      sender: '1',
      timestamp: new Date().getTime() - 7000000,
      read: true,
    },
    {
      id: 'm3',
      text: 'I can help you with the cleaning job',
      sender: '201',
      timestamp: new Date().getTime() - 3600000,
      read: true,
    }
  ]
}; 