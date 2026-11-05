import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  chats: string;
  status: string;
  calls: string;
  groups: string;
  profile: string;
  searchPlaceholder: string;
  typeMessage: string;
  online: string;
  offline: string;
  typing: string;
  lastSeen: string;
  today: string;
  yesterday: string;
  recordVoice: string;
  recording: string;
  slideCancel: string;
  audioCall: string;
  videoCall: string;
  ringing: string;
  connected: string;
  callEnded: string;
  endCall: string;
  mute: string;
  unmute: string;
  camera: string;
  speaker: string;
  flipCamera: string;
  incomingCall: string;
  incomingAudioCall: string;
  incomingVideoCall: string;
  accept: string;
  decline: string;
  simulateIncoming: string;
  newChat: string;
  newGroup: string;
  groupName: string;
  groupSubjectPlaceholder: string;
  selectMembers: string;
  createGroup: string;
  members: string;
  admin: string;
  about: string;
  phone: string;
  languageSelect: string;
  save: string;
  cancel: string;
  send: string;
  voiceMessage: string;
  photo: string;
  video: string;
  viewPhoto: string;
  statusUpdates: string;
  myStatus: string;
  addStatus: string;
  tapToAddStatus: string;
  recentUpdates: string;
  loginTitle: string;
  loginSubtitle: string;
  enterMobile: string;
  getOtp: string;
  enterOtp: string;
  verifyLogin: string;
  quickLogin: string;
  demoAbu: string;
  demoRahul: string;
  demoPriya: string;
  editProfile: string;
  quickPhrases: string;
  translateMsg: string;
  showOriginal: string;
  switchDeviceView: string;
  androidFrame: string;
  fullScreen: string;
  darkTheme: string;
  lightTheme: string;
}

export const translations: Record<Language, Translations> = {
  bn: {
    appName: 'আবু চ্যাট',
    tagline: 'বাংলা ও হিন্দিতে দ্রুত ও সহজ চ্যাট',
    chats: 'চ্যাট',
    status: 'স্ট্যাটাস',
    calls: 'কল',
    groups: 'গ্রুপ',
    profile: 'প্রোফাইল',
    searchPlaceholder: 'চ্যাট বা বার্তা খুঁজুন...',
    typeMessage: 'একটি বার্তা লিখুন...',
    online: 'অনলাইন',
    offline: 'অফলাইন',
    typing: 'টাইপ করছেন...',
    lastSeen: 'শেষ দেখা',
    today: 'আজ',
    yesterday: 'গতকাল',
    recordVoice: 'ভয়েস রেকর্ড করতে চেপে রাখুন',
    recording: 'রেকর্ডিং হচ্ছে...',
    slideCancel: 'বাতিল করতে বামে টানুন',
    audioCall: 'অডিও কল',
    videoCall: 'ভিডিও কল',
    ringing: 'রিং হচ্ছে...',
    connected: 'সংযুক্ত হয়েছে',
    callEnded: 'কল সমাপ্ত',
    endCall: 'কল শেষ করুন',
    mute: 'মিউট',
    unmute: 'আনমিউট',
    camera: 'ক্যামেরা',
    speaker: 'স্পিকার',
    flipCamera: 'ক্যামেরা পাল্টান',
    incomingCall: 'ইনকামিং কল',
    incomingAudioCall: 'ইনকামিং অডিও কল...',
    incomingVideoCall: 'ইনকামিং ভিডিও কল...',
    accept: 'উত্তর দিন',
    decline: 'কেটে দিন',
    simulateIncoming: 'টেস্ট ইনকামিং কল',
    newChat: 'নতুন চ্যাট',
    newGroup: 'নতুন গ্রুপ তৈরি',
    groupName: 'গ্রুপের নাম',
    groupSubjectPlaceholder: 'গ্রুপের নাম লিখুন...',
    selectMembers: 'সদস্য নির্বাচন করুন',
    createGroup: 'গ্রুপ তৈরি করুন',
    members: 'সদস্যগণ',
    admin: 'গ্রুপ অ্যাডমিন',
    about: 'অ্যাবাউট / স্ট্যাটাস',
    phone: 'মোবাইল নম্বর',
    languageSelect: 'ভাষা পরিবর্তন করুন',
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল',
    send: 'পাঠান',
    voiceMessage: 'ভয়েস মেসেজ',
    photo: 'ছবি',
    video: 'ভিডিও',
    viewPhoto: 'ছবি দেখুন',
    statusUpdates: 'স্ট্যাটাস আপডেট',
    myStatus: 'আমার স্ট্যাটাস',
    addStatus: 'নতুন স্ট্যাটাস দিন',
    tapToAddStatus: 'ছবি বা লেখা শেয়ার করতে ট্যাপ করুন',
    recentUpdates: 'সাম্প্রতিক আপডেট',
    loginTitle: 'আবু চ্যাটে স্বাগতম',
    loginSubtitle: 'আপনার মোবাইল নম্বর দিয়ে প্রবেশ করুন',
    enterMobile: 'মোবাইল নম্বর লিখুন',
    getOtp: 'OTP পাঠান',
    enterOtp: '৬ ডিজিটের কোড দিন',
    verifyLogin: 'ভেরিফাই ও লগইন',
    quickLogin: 'দ্রুত ডেমো লগইন',
    demoAbu: 'আবু হিসেবে ঢুকুন',
    demoRahul: 'রাহুল হিসেবে ঢুকুন',
    demoPriya: 'প্রিয়া হিসেবে ঢুকুন',
    editProfile: 'প্রোফাইল এডিট করুন',
    quickPhrases: 'কুইক বাক্য',
    translateMsg: 'অনুবাদ করুন',
    showOriginal: 'আসল দেখুন',
    switchDeviceView: 'মোবাইল ফ্রেম',
    androidFrame: 'Android ফোন লুক',
    fullScreen: 'ফুল স্ক্রিন লুক',
    darkTheme: 'ডার্ক মোড',
    lightTheme: 'লাইট মোড',
  },
  hi: {
    appName: 'अबू चैट',
    tagline: 'हिंदी और बंगाली में तेज़ और आसान बातचीत',
    chats: 'चैट्स',
    status: 'स्टेटस',
    calls: 'कॉल्स',
    groups: 'ग्रुप्स',
    profile: 'प्रोफाइल',
    searchPlaceholder: 'चैट या संदेश खोजें...',
    typeMessage: 'संदेश टाइप करें...',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    typing: 'टाइप कर रहे हैं...',
    lastSeen: 'अंतिम बार देखा गया',
    today: 'आज',
    yesterday: 'कल',
    recordVoice: 'वॉयस रिकॉर्ड करने के लिए दबाएं',
    recording: 'रिकॉर्डिंग चालू है...',
    slideCancel: 'रद्द करने के लिए बाईं ओर खींचें',
    audioCall: 'ऑडियो कॉल',
    videoCall: 'वीडियो कॉल',
    ringing: 'घंटी बज रही है...',
    connected: 'जुड़ गया',
    callEnded: 'कॉल समाप्त',
    endCall: 'कॉल काटें',
    mute: 'म्यूट',
    unmute: 'अनम्यूट',
    camera: 'कैमरा',
    speaker: 'स्पीकर',
    flipCamera: 'कैमरा बदलें',
    incomingCall: 'इनकमिंग कॉल',
    incomingAudioCall: 'इनकमिंग ऑडियो कॉल...',
    incomingVideoCall: 'इनकमिंग वीडियो कॉल...',
    accept: 'उठाएं',
    decline: 'काटें',
    simulateIncoming: 'टेस्ट इनकमिंग कॉल',
    newChat: 'नई चैट',
    newGroup: 'नया ग्रुप बनाएं',
    groupName: 'ग्रुप का नाम',
    groupSubjectPlaceholder: 'ग्रुप का नाम दर्ज करें...',
    selectMembers: 'सदस्य चुनें',
    createGroup: 'ग्रुप बनाएं',
    members: 'सदस्य',
    admin: 'ग्रुप एडमिन',
    about: 'अबाउट / स्टेटस',
    phone: 'मोबाइल नंबर',
    languageSelect: 'भाषा बदलें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    send: 'भेजें',
    voiceMessage: 'वॉयस संदेश',
    photo: 'तस्वीर',
    video: 'वीडियो',
    viewPhoto: 'तस्वीर देखें',
    statusUpdates: 'स्टेटस अपडेट्स',
    myStatus: 'मेरा स्टेटस',
    addStatus: 'स्टेटस लगाएं',
    tapToAddStatus: 'तस्वीर या स्टेटस शेयर करने के लिए टैप करें',
    recentUpdates: 'हालिया अपडेट्स',
    loginTitle: 'अबू चैट में आपका स्वागत है',
    loginSubtitle: 'अपने मोबाइल नंबर से लॉगिन करें',
    enterMobile: 'मोबाइल नंबर दर्ज करें',
    getOtp: 'OTP भेजें',
    enterOtp: '६ अंकों का कोड डालें',
    verifyLogin: 'सत्यापित करें और लॉगिन करें',
    quickLogin: 'त्वरित डेमो लॉगिन',
    demoAbu: 'अबू के रूप में प्रवेश करें',
    demoRahul: 'राहुल के रूप में प्रवेश करें',
    demoPriya: 'प्रिया के रूप में प्रवेश करें',
    editProfile: 'प्रोफाइल संपादित करें',
    quickPhrases: 'त्वरित वाक्य',
    translateMsg: 'अनुवाद करें',
    showOriginal: 'मूल संदेश देखें',
    switchDeviceView: 'डिवाइस दृश्य बदलें',
    androidFrame: 'Android मोबाइल फ्रेम',
    fullScreen: 'फुल स्क्रीन दृश्य',
    darkTheme: 'डार्क मोड',
    lightTheme: 'लाइट मोड',
  },
  en: {
    appName: 'Abu Chat',
    tagline: 'Fast Bengali & Hindi messenger with voice, calls & stories',
    chats: 'Chats',
    status: 'Status',
    calls: 'Calls',
    groups: 'Groups',
    profile: 'Profile',
    searchPlaceholder: 'Search chats or messages...',
    typeMessage: 'Type a message...',
    online: 'Online',
    offline: 'Offline',
    typing: 'Typing...',
    lastSeen: 'Last seen',
    today: 'Today',
    yesterday: 'Yesterday',
    recordVoice: 'Hold to record voice',
    recording: 'Recording audio...',
    slideCancel: 'Slide left to cancel',
    audioCall: 'Audio Call',
    videoCall: 'Video Call',
    ringing: 'Ringing...',
    connected: 'Connected',
    callEnded: 'Call ended',
    endCall: 'End Call',
    mute: 'Mute',
    unmute: 'Unmute',
    camera: 'Camera',
    speaker: 'Speaker',
    flipCamera: 'Flip Camera',
    incomingCall: 'Incoming Call',
    incomingAudioCall: 'Incoming Audio Call...',
    incomingVideoCall: 'Incoming Video Call...',
    accept: 'Accept',
    decline: 'Decline',
    simulateIncoming: 'Test Incoming Call',
    newChat: 'New Chat',
    newGroup: 'New Group',
    groupName: 'Group Name',
    groupSubjectPlaceholder: 'Enter group subject...',
    selectMembers: 'Select members',
    createGroup: 'Create Group',
    members: 'Members',
    admin: 'Group Admin',
    about: 'About / Bio',
    phone: 'Phone Number',
    languageSelect: 'Choose Language',
    save: 'Save',
    cancel: 'Cancel',
    send: 'Send',
    voiceMessage: 'Voice message',
    photo: 'Photo',
    video: 'Video',
    viewPhoto: 'View Photo',
    statusUpdates: 'Status Updates',
    myStatus: 'My Status',
    addStatus: 'Add Status',
    tapToAddStatus: 'Tap to add status update',
    recentUpdates: 'Recent updates',
    loginTitle: 'Welcome to Abu Chat',
    loginSubtitle: 'Log in with your mobile number to get started',
    enterMobile: 'Enter Mobile Number',
    getOtp: 'Get OTP',
    enterOtp: 'Enter 6-digit OTP',
    verifyLogin: 'Verify & Login',
    quickLogin: 'Quick Demo Login',
    demoAbu: 'Login as Abu',
    demoRahul: 'Login as Rahul',
    demoPriya: 'Login as Priya',
    editProfile: 'Edit Profile',
    quickPhrases: 'Quick Phrases',
    translateMsg: 'Translate',
    showOriginal: 'Show Original',
    switchDeviceView: 'Toggle Frame',
    androidFrame: 'Android Phone Look',
    fullScreen: 'Full Screen Look',
    darkTheme: 'Dark Theme',
    lightTheme: 'Light Theme',
  },
};

// Helpful Bengali & Hindi phrase templates for quick chat
export const QUICK_PHRASES = [
  {
    category: 'Greetings',
    bn: 'শুভ সকাল! কেমন আছেন?',
    hi: 'शुभ प्रभात! आप कैसे हैं?',
    en: 'Good morning! How are you?',
  },
  {
    category: 'Greetings',
    bn: 'কেমন আছো বন্ধু? কি করছো?',
    hi: 'कैसा है भाई? क्या कर रहे हो?',
    en: 'How are you friend? What are you doing?',
  },
  {
    category: 'Status',
    bn: 'আমি একটু ব্যস্ত আছি, পরে কথা বলি।',
    hi: 'मैं थोड़ा व्यस्त हूँ, बाद में बात करते हैं।',
    en: 'I am a bit busy, let us talk later.',
  },
  {
    category: 'Status',
    bn: 'আমি এখন রাস্তায়, ১০ মিনিটে পৌঁছাচ্ছি।',
    hi: 'मैं रास्ते में हूँ, १० मिनट में पहुँच रहा हूँ।',
    en: 'I am on the way, reaching in 10 mins.',
  },
  {
    category: 'Care',
    bn: 'খেয়েছো তুমি? শরীর কেমন আছে?',
    hi: 'खाना खाया तुमने? तबीयत कैसी है?',
    en: 'Did you have food? How is your health?',
  },
  {
    category: 'Call',
    bn: 'ফ্রি হলে আমাকে একটা কল দিও।',
    hi: 'फ्री हो तो मुझे एक कॉल करना।',
    en: 'Give me a call when you are free.',
  },
  {
    category: 'Appreciation',
    bn: 'অনেক ধন্যবাদ! দারুণ লাগলো!',
    hi: 'बहुत-बहुत धन्यवाद! बहुत बढ़िया लगा!',
    en: 'Thank you so much! Loved it!',
  },
  {
    category: 'Night',
    bn: 'শুভ রাত্রি! মিষ্টি স্বপ্ন দেখো।',
    hi: 'शुभ रात्रि! मीठे सपने।',
    en: 'Good night! Sweet dreams.',
  },
];

// Contextual auto-replies when user sends messages
export const MOCK_BOT_REPLIES: Record<Language, string[]> = {
  bn: [
    'হ্যাঁ ভাই, একদম ঠিক বলেছো! ❤️',
    'আমি শুনলাম! খুব সুন্দর খবর। কেমন চলছে সব?',
    'আমি একটু ব্যস্ত ছিলাম, এখন ফ্রি হলাম। বলো কেমন আছো?',
    'বাহ! দারুণ কথা। চলো আজ সন্ধ্যায় একটা অডিও কল করি?',
    'অসাধারণ! মা-বাবা কেমন আছেন? সবাই ভালো তো?',
    'আমি তোমার মেসেজ পেয়েছি। একটু পর বিস্তারিত জানাচ্ছি। ☕',
  ],
  hi: [
    'हाँ भाई, बिल्कुल सही कहा तुमने! ❤️',
    'अरे वाह! बहुत बढ़िया बात है। सब कैसा चल रहा है?',
    'मैं थोड़ा व्यस्त था, अब फ्री हुआ हूँ। बताओ क्या हाल है?',
    'वाह भाई! शाम को वीडियो कॉल पे मिलते हैं?',
    'सब बढ़िया है यहाँ भी! घर पर सब कैसे हैं?',
    'मस्त! मैंने तुम्हारा संदेश देख लिया, अभी बताता हूँ। ☕',
  ],
  en: [
    'Yes brother, absolutely right! ❤️',
    'That sounds fantastic! How has your day been?',
    'Just saw your message, was caught up with work. Free now!',
    'Awesome! Let us hop on a quick call later this evening?',
    'Everything good on this side! How is everyone at home?',
    'Got it! Let me reply to you in detail in a moment. ☕',
  ],
};
