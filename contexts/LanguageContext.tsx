'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation files
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.products': 'Products',
    'nav.login': 'Login',
    'nav.logout': 'Log out',
    'nav.dashboard': 'Dashboard',
    
    // Hero
    'hero.headline': 'Strategic thinking. Wise execution.',
    'hero.description': 'SageCoin provides expert analysis and exclusive trading strategies for the serious investor.',
    'hero.ctaButton': 'Open live account',
    'hero.visualLabel': 'Abstract 3D Financial Illustration',
    'hero.form.secureUplink': '// SECURE_UPLINK',
    'hero.form.requestAccess': 'Request Access',
    'hero.form.fullIdentity': 'Full Identity',
    'hero.form.communicationPoint': 'Email',
    'hero.form.directPhone': 'Phone',
    'hero.form.processing': 'PROCESSING...',
    'hero.form.establishLink': 'ESTABLISH LINK →',
    'hero.form.errorOccurred': 'An error occurred.',
    
    // User Dashboard
    'dashboard.settings': 'Settings',
    'dashboard.changePassword': 'Change Password',
    'dashboard.changeLeverage': 'Change Leverage',
    'dashboard.current': 'Current:',
    'dashboard.changeLotSize': 'Change Lot/Loot Size',
    'dashboard.marketAnalysis': 'Market Analysis',
    'dashboard.marketAnalysisItem': 'Market Analysis',
    'dashboard.analysisDescription': 'Expert market insights and detailed analysis to help you make informed trading decisions based on current market conditions and trends.',
    
    // Courses
    'courses.title': 'Exclusive Training Courses',
    'courses.patreonPlaceholder': 'Patreon Course Content Embed',
    'courses.courseVideos': 'Course videos and materials will be displayed here',
    'courses.unlockTitle': 'Unlock Exclusive Trading Courses',
    'courses.unlockDescription': 'Subscribe now to access our comprehensive library of trading courses, expert tutorials, and exclusive content designed to elevate your trading skills.',
    'courses.subscribeNow': 'Subscribe Now to Access Courses',
    'courses.expertLessons': 'Expert Lessons',
    'courses.learnFromPro': 'Learn from professional traders',
    'courses.regularUpdates': 'Regular Updates',
    'courses.newContentWeekly': 'New content added weekly',
    'courses.lifetimeAccess': 'Lifetime Access',
    'courses.accessAnytime': 'Access all courses anytime',
    'courses.bookQuote': 'The keys to the kingdom are hidden in the charts...',
    'courses.feature1.title': 'Mastery',
    'courses.feature1.subtitle': 'Foundational Principles',
    'courses.feature1.description': 'Learn the timeless laws that govern market movements. We deconstruct the algorithms used by institutional market makers.',
    'courses.feature2.title': 'Strategy',
    'courses.feature2.subtitle': 'Tactical Execution',
    'courses.feature2.description': 'Access high-probability setups with defined risk-to-reward ratios. Stop gambling and start executing with precision.',
    'courses.feature3.title': 'Mindset',
    'courses.feature3.subtitle': 'Psychological Edge',
    'courses.feature3.description': 'Trading is 10% skill and 90% psychology. Master your emotions to execute without fear or greed.',
    'courses.feature4.title': 'Future',
    'courses.feature4.subtitle': 'Wealth Generation',
    'courses.feature4.description': 'Unlock the path to financial sovereignty. Build a portfolio that generates passive income for generations.',
    
    // VIP Trading
    'vip.title': 'VIP Trading',
    'vip.activeTrades': 'Active VIP Trades',
    'vip.symbol': 'Symbol',
    'vip.type': 'Type',
    'vip.entryPrice': 'Entry Price',
    'vip.currentPrice': 'Current Price',
    'vip.pnl': 'P/L',
    'vip.pnlPercent': 'P/L %',
    'vip.time': 'Time',
    'vip.buy': 'BUY',
    'vip.sell': 'SELL',
    'vip.unlockTitle': 'Unlock VIP Trading Access',
    'vip.unlockDescription': 'VIP access to wise signals, expert insight, and disciplined risk management.',
    'vip.subscribe': 'Subscribe to VIP',
    'vip.liveSignals': 'Live Trade Signals',
    'vip.realTimeSignals': 'Real-time entry and exit signals',
    'vip.expertAnalysis': 'Expert Analysis',
    'vip.dailyInsights': 'In-depth market insights daily',
    'vip.directAccess': 'Direct Access',
    'vip.connectWithExperts': 'Connect with expert traders',
    'vip.vipAccess': 'VIP ACCESS',
    'vip.step1': 'Step 1',
    'vip.step2': 'Step 2',
    'vip.step3': 'Step 3',
    'vip.realTimePrecision': 'Real-Time Precision',
    'vip.realTimePrecisionDescription': 'Wise entry and exit signals with precise timing, clear risk levels, and real-time updates.',
    'vip.expertIntelligenceDescription': 'Daily market insight with clear technical levels and macro context for wiser decisions.',
    'vip.ready': 'Ready?',
    'vip.startJourney': 'Start Your Journey',
    'vip.startJourneyDescription': 'Join thousands of successful traders who trust SageCoin for their trading success. Our VIP community includes both retail traders and professional investors who have achieved consistent profitability through our proven strategies and expert guidance. With an average member satisfaction rate of 94% and a track record of helping traders improve their win rates by up to 35%, SageCoin VIP is the premier choice for serious traders looking to elevate their performance and achieve their financial goals.',
    'vip.institutional': 'INSTITUTIONAL',
    'vip.readyToWin': 'READY|TO WIN?',
    'vip.realTimeEntryExit': 'Real-time|Entry & Exit',
    'vip.dailyMarketIntel': 'Daily|Market Intel',
    'vip.dashboardActive': 'VIP Dashboard Active',
    'vip.liveAccessActive': 'LIVE ACCESS ACTIVE',
    'vip.welcomeBack': 'Welcome Back',
    'vip.trader': 'Trader',
    'vip.dashboardIntro': 'Your VIP dashboard is ready. Access real-time signals, expert analysis, and exclusive trading insights to maximize your trading potential.',
    'vip.viewSignals': 'View Signals',
    'vip.marketAnalysis': 'Market Analysis',
    'vip.latestSignal': 'Latest Signal',
    'vip.expertInsight': 'Expert Insight',
    'vip.analysisPreviewText': 'Gold shows strong bullish momentum with key resistance at 2040.00. Consider long positions on pullbacks.',
    'vip.symbolGold': 'XAUUSD / Gold',
    'vip.buyAt': 'BUY @',
    
    // Public CTA
    'cta.title': 'Ready to Start Your Trading Journey?',
    'cta.description': 'Join thousands of successful traders who trust SageCoin for expert market analysis and proven trading strategies. Take the first step towards mastering the markets today.',
    'cta.joinUs': 'Join Us',
    'cta.openAccount': 'Open Live Account',
    
    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms',
    'footer.contact': 'Contact',
    
    // Dashboard
    'dashboard.title': 'Admin Dashboard',
    'dashboard.subtitle': 'Manage users and requests',
    'dashboard.tabs.users': 'Users',
    'dashboard.tabs.requests': 'Requests',
    'dashboard.tabs.marketAnalysis': 'Market Analysis',
    'dashboard.tabs.vipPreviews': 'VIP Previews',
    
    // Dashboard - Users
    'dashboard.users.searchPlaceholder': 'Search by name or email...',
    'dashboard.users.filters.all': 'All',
    'dashboard.users.filters.regular': 'Regular',
    'dashboard.users.filters.subscriber': 'Subscriber',
    'dashboard.users.filters.admin': 'Admin',
    'dashboard.users.filters.user': 'User',
    'dashboard.users.filters.member': 'Member',
    'dashboard.users.filters.vip': 'VIP', // Legacy
    'dashboard.users.stats.total': 'Total Users',
    'dashboard.users.stats.admin': 'Admins',
    'dashboard.users.stats.member': 'Members',
    'dashboard.users.stats.user': 'Users',
    'dashboard.users.stats.vip': 'VIP Users', // Legacy
    'dashboard.users.stats.subscribers': 'Subscribers', // Legacy
    'dashboard.users.stats.regular': 'Regular Users', // Legacy
    'dashboard.users.table.name': 'Name',
    'dashboard.users.table.email': 'Email',
    'dashboard.users.table.type': 'Type',
    'dashboard.users.table.joinedDate': 'Joined Date',
    'dashboard.users.table.status': 'Status',
    'dashboard.users.table.actions': 'Actions',
    'dashboard.users.table.view': 'View',
    'dashboard.users.types.admin': 'Admin',
    'dashboard.users.types.user': 'User',
    'dashboard.users.types.member': 'Member',
    'dashboard.users.types.regular': 'Regular', // Legacy
    'dashboard.users.types.subscriber': 'Subscriber', // Legacy
    'dashboard.users.types.vip': 'VIP', // Legacy
    'dashboard.users.status.active': 'Active',
    'dashboard.users.status.inactive': 'Inactive',
    'dashboard.users.noUsers': 'No users found',
    'dashboard.users.actions.edit': 'Edit',
    'dashboard.users.actions.changeType': 'Change Type',
    'dashboard.users.actions.type': 'Type',
    'dashboard.users.actions.delete': 'Delete',
    
    // Dashboard - Requests
    'dashboard.requests.searchPlaceholder': 'Search requests...',
    'dashboard.requests.filters.type': 'Filter by Type',
    'dashboard.requests.filters.status': 'Filter by Status',
    'dashboard.requests.types.all': 'All Types',
    'dashboard.requests.types.password': 'Password Change',
    'dashboard.requests.types.leverage': 'Change Leverage',
    'dashboard.requests.types.withdraw': 'Withdraw',
    'dashboard.requests.types.deposit': 'Deposit',
    'dashboard.requests.status.all': 'All Statuses',
    'dashboard.requests.status.pending': 'Pending',
    'dashboard.requests.status.approved': 'Approved',
    'dashboard.requests.status.rejected': 'Rejected',
    'dashboard.requests.stats.total': 'Total Requests',
    'dashboard.requests.stats.pending': 'Pending',
    'dashboard.requests.stats.approved': 'Approved',
    'dashboard.requests.stats.rejected': 'Rejected',
    'dashboard.requests.approve': 'Approve',
    'dashboard.requests.reject': 'Reject',
    'dashboard.requests.setPending': 'Set Pending',
    'dashboard.requests.noRequests': 'No requests found',
    
    // Dashboard - Dialogs
    'dashboard.dialogs.cancel': 'Cancel',
    'dashboard.dialogs.save': 'Save',
    'dashboard.dialogs.delete': 'Delete',
    'dashboard.dialogs.confirm': 'Confirm',
    
    // Edit User Dialog
    'dashboard.dialogs.editUser.title': 'Edit User',
    'dashboard.dialogs.editUser.name': 'Name',
    'dashboard.dialogs.editUser.email': 'Email',
    'dashboard.dialogs.editUser.type': 'User Type',
    'dashboard.dialogs.editUser.status': 'Status',
    
    // Delete User Dialog
    'dashboard.dialogs.deleteUser.title': 'Delete User',
    'dashboard.dialogs.deleteUser.message': 'Are you sure you want to delete user {{name}} ({{email}})? This action cannot be undone.',
    
    // Change User Type Dialog
    'dashboard.dialogs.changeUserType.title': 'Change User Type',
    'dashboard.dialogs.changeUserType.message': 'Change user type for {{name}}',
    'dashboard.dialogs.changeUserType.newType': 'New User Type',
    
    // Request Action Dialog
    'dashboard.dialogs.requestAction.approve': 'Approve Request',
    'dashboard.dialogs.requestAction.reject': 'Reject Request',
    'dashboard.dialogs.requestAction.setPending': 'Set Request as Pending',
    'dashboard.dialogs.requestAction.user': 'User',
    'dashboard.dialogs.requestAction.type': 'Request Type',
    'dashboard.dialogs.requestAction.details': 'Details',
    'dashboard.dialogs.requestAction.notes': 'Notes',
    'dashboard.dialogs.requestAction.optional': 'Optional',
    'dashboard.dialogs.requestAction.notesPlaceholder': 'Add any notes about this action...',
    
    // Dashboard - Market Analysis
    'dashboard.marketAnalysis.title': 'Market Analysis Sections',
    'dashboard.marketAnalysis.addSection': 'Add Section',
    'dashboard.marketAnalysis.editSection': 'Edit Section',
    'dashboard.marketAnalysis.deleteSection': 'Delete Section',
    'dashboard.marketAnalysis.edit': 'Edit',
    'dashboard.marketAnalysis.delete': 'Delete',
    'dashboard.marketAnalysis.saving': 'Saving...',
    'dashboard.marketAnalysis.deleting': 'Deleting...',
    'dashboard.marketAnalysis.noSections': 'No market analysis sections found. Add your first section to get started.',
    'dashboard.marketAnalysis.image': 'Image',
    'dashboard.marketAnalysis.titleEn': 'Title (English)',
    'dashboard.marketAnalysis.titleAr': 'Title (Arabic)',
    'dashboard.marketAnalysis.descriptionEn': 'Description (English)',
    'dashboard.marketAnalysis.descriptionAr': 'Description (Arabic)',
    'dashboard.marketAnalysis.displayOrder': 'Display Order',
    'dashboard.marketAnalysis.isActive': 'Active',
    'dashboard.marketAnalysis.deleteConfirm': 'Are you sure you want to delete the section "{{title}}"? This action cannot be undone.',
    
    // Dashboard - VIP Previews
    'dashboard.vipPreviews.title': 'VIP Dashboard Previews',
    'dashboard.vipPreviews.addPreview': 'Add Preview',
    'dashboard.vipPreviews.editPreview': 'Edit Preview',
    'dashboard.vipPreviews.deletePreview': 'Delete Preview',
    'dashboard.vipPreviews.latestSignals': 'Latest Signals',
    'dashboard.vipPreviews.expertInsights': 'Expert Insights',
    'dashboard.vipPreviews.noLatestSignals': 'No latest signals found. Add your first signal to get started.',
    'dashboard.vipPreviews.noExpertInsights': 'No expert insights found. Add your first insight to get started.',
    'dashboard.vipPreviews.edit': 'Edit',
    'dashboard.vipPreviews.delete': 'Delete',
    'dashboard.vipPreviews.saving': 'Saving...',
    'dashboard.vipPreviews.deleting': 'Deleting...',
    'dashboard.vipPreviews.type': 'Type',
    'dashboard.vipPreviews.typeLatestSignal': 'Latest Signal',
    'dashboard.vipPreviews.typeExpertInsight': 'Expert Insight',
    'dashboard.vipPreviews.symbol': 'Symbol',
    'dashboard.vipPreviews.action': 'Action',
    'dashboard.vipPreviews.price': 'Price',
    'dashboard.vipPreviews.textEn': 'Text (English)',
    'dashboard.vipPreviews.textAr': 'Text (Arabic)',
    'dashboard.vipPreviews.isActive': 'Active',
    'dashboard.vipPreviews.deleteConfirm': 'Are you sure you want to delete this preview? This action cannot be undone.',
    
    // About Journey
    'about.step1.heading': 'WE SAW THE NOISE.',

'about.step1.paragraph1': 'Markets aren’t built for clarity. They operate on imbalance—where data, speed, and structure favor those with preparation. Most traders are left making decisions without context or direction.',

'about.step1.paragraph2': 'We watched countless traders lose capital—not from lack of effort, but from trading without structure, discipline, or informed tools.',

'about.step2.heading': 'WE BUILT THE FRAMEWORK.',

'about.step2.paragraph1': 'Through years of disciplined market study, we distilled the principles that drive price action. We built systems focused on structure, timing, and probability—not prediction.',

'about.step3.heading': 'BEYOND PERFORMANCE.',

'about.step3.paragraph1': 'This is not just about returns. It’s about consistency, control, and confidence. Every signal and every analysis is designed to support wiser decisions and sustainable growth.',

'about.step3.stats.livesChanged': 'Traders Guided',

'about.step3.stats.successRate': 'Signal Accuracy',

'about.step3.stats.avgReturns': 'Risk-Adjusted Returns',

'about.step4.heading': 'THE DECISION.',

'about.step4.question': 'Are you ready to trade wise?',

'about.step4.buttonReady': 'YES, LET’S BEGIN',

'about.step4.buttonNotYet': 'NOT YET',

'about.form.title': 'Get Started',

'about.form.description': 'Share your details and we’ll reach out shortly.',

'about.form.fullName': 'Full Name',

'about.form.email': 'Email Address',

'about.form.phone': 'Phone Number',

'about.form.cancel': 'Cancel',

'about.form.submit': 'Submit',

'about.form.submitting': 'Submitting...',

'about.form.error.fillAll': 'Please fill in all fields',

'about.form.error.unexpected': 'An unexpected error occurred. Please try again.',

'about.aria.close': 'Close',

'about.aria.previousStep': 'Previous step',

'about.aria.nextStep': 'Next step',

'about.aria.closeForm': 'Close form',

'about.aria.goToStep': 'Go to step',

  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.courses': 'الدورات',
    'nav.products': 'المنتجات',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'تسجيل الخروج',
    'nav.dashboard': 'لوحة التحكم',
    
    // Hero
    'hero.headline': 'أتقن الأسواق بدقة المؤسسات المالية.',
    'hero.description': 'يوفر SageCoin تحليلات خبيرة واستراتيجيات تداول حصرية للمستثمر الجاد.',
    'hero.ctaButton': 'فتح حساب حقيقي',
    'hero.visualLabel': 'رسم توضيحي مالي ثلاثي الأبعاد',
    'hero.form.secureUplink': '// رابط آمن',
    'hero.form.requestAccess': 'طلب الوصول',
    'hero.form.fullIdentity': 'الهوية الكاملة',
    'hero.form.communicationPoint': 'نقطة الاتصال',
    'hero.form.directPhone': 'الهاتف المباشر',
    'hero.form.processing': 'جاري المعالجة...',
    'hero.form.establishLink': 'إنشاء رابط →',
    'hero.form.errorOccurred': 'حدث خطأ.',
    
    // User Dashboard
    'dashboard.settings': 'الإعدادات',
    'dashboard.changePassword': 'تغيير كلمة المرور',
    'dashboard.changeLeverage': 'تغيير الرافعة المالية',
    'dashboard.current': 'الحالي:',
    'dashboard.changeLotSize': 'تغيير حجم اللوت/الغنيمة',
    'dashboard.marketAnalysis': 'تحليل السوق',
    'dashboard.marketAnalysisItem': 'تحليل السوق',
    'dashboard.analysisDescription': 'رؤى السوق الخبيرة والتحليل التفصيلي لمساعدتك على اتخاذ قرارات تداول مستنيرة بناءً على ظروف السوق الحالية والاتجاهات.',
    
    // Courses
    'courses.title': 'دورات التدريب الحصرية',
    'courses.patreonPlaceholder': 'محتوى دورة Patreon',
    'courses.courseVideos': 'سيتم عرض مقاطع الفيديو والمواد التعليمية هنا',
    'courses.unlockTitle': 'افتح دورات التداول الحصرية',
    'courses.unlockDescription': 'اشترك الآن للوصول إلى مكتبتنا الشاملة لدورات التداول والبرامج التعليمية الخبيرة والمحتوى الحصري المصمم لتعزيز مهاراتك في التداول.',
    'courses.subscribeNow': 'اشترك الآن للوصول إلى الدورات',
    'courses.expertLessons': 'دروس خبيرة',
    'courses.learnFromPro': 'تعلم من المتداولين المحترفين',
    'courses.regularUpdates': 'تحديثات منتظمة',
    'courses.newContentWeekly': 'محتوى جديد يضاف أسبوعياً',
    'courses.lifetimeAccess': 'وصول مدى الحياة',
    'courses.accessAnytime': 'الوصول إلى جميع الدورات في أي وقت',
    'courses.bookQuote': 'مفاتيح المملكة مخفية في الرسوم البيانية...',
    'courses.feature1.title': 'الإتقان',
    'courses.feature1.subtitle': 'المبادئ الأساسية',
    'courses.feature1.description': 'تعلم القوانين الخالدة التي تحكم تحركات السوق. نحن نفكك الخوارزميات المستخدمة من قبل صانعي السوق المؤسسيين.',
    'courses.feature2.title': 'الاستراتيجية',
    'courses.feature2.subtitle': 'التنفيذ التكتيكي',
    'courses.feature2.description': 'احصل على إعدادات عالية الاحتمالية مع نسب مخاطر إلى مكافآت محددة. توقف عن المقامرة وابدأ التنفيذ بدقة.',
    'courses.feature3.title': 'العقلية',
    'courses.feature3.subtitle': 'الميزة النفسية',
    'courses.feature3.description': 'التداول هو 10% مهارة و 90% نفسية. أتقن عواطفك لتنفيذ بدون خوف أو جشع.',
    'courses.feature4.title': 'المستقبل',
    'courses.feature4.subtitle': 'توليد الثروة',
    'courses.feature4.description': 'افتح الطريق إلى السيادة المالية. أنشئ محفظة تولد دخلًا سلبيًا للأجيال.',
    
    // VIP Trading
    'vip.title': 'تداول VIP',
    'vip.activeTrades': 'صفقات VIP النشطة',
    'vip.symbol': 'الرمز',
    'vip.type': 'النوع',
    'vip.entryPrice': 'سعر الدخول',
    'vip.currentPrice': 'السعر الحالي',
    'vip.pnl': 'الربح/الخسارة',
    'vip.pnlPercent': 'الربح/الخسارة %',
    'vip.time': 'الوقت',
    'vip.buy': 'شراء',
    'vip.sell': 'بيع',
    'vip.unlockTitle': 'افتح وصول تداول VIP',
    'vip.unlockDescription': 'انضم إلى برنامج VIP الحصري الخاص بنا وحول تجربة التداول الخاصة بك باستخدام أدوات ورؤى من مستوى المؤسسات المالية. احصل على الوصول إلى إشارات التداول في الوقت الفعلي المدعومة بخوارزميات متقدمة، وتحليل شامل للسوق من مكتب التداول الخبير لدينا، وقنوات اتصال مباشرة مع المتداولين المحترفين. يتلقى أعضاء VIP لدينا دعمًا ذو أولوية، ووصولاً مبكرًا للميزات الجديدة، واستراتيجيات إدارة المخاطر التفصيلية المصممة لمساعدتك على تعظيم إمكانات التداول الخاصة بك مع تقليل التعرض للمخاطر.',
    'vip.subscribe': 'اشترك في VIP',
    'vip.liveSignals': 'إشارات التداول المباشرة',
    'vip.realTimeSignals': 'إشارات الدخول والخروج في الوقت الفعلي',
    'vip.expertAnalysis': 'تحليل خبير',
    'vip.dailyInsights': 'رؤى السوق المتعمقة يومياً',
    'vip.directAccess': 'وصول مباشر',
    'vip.connectWithExperts': 'تواصل مع المتداولين الخبراء',
    'vip.vipAccess': 'وصول VIP',
    'vip.step1': 'الخطوة 1',
    'vip.step2': 'الخطوة 2',
    'vip.step3': 'الخطوة 3',
    'vip.realTimePrecision': 'دقة الوقت الفعلي',
    'vip.realTimePrecisionDescription': 'احصل على إشارات دخول وخروج من مستوى المؤسسات مباشرة إلى لوحة التحكم الخاصة بك، يتم تسليمها مع توقيت دقيق وتفاصيل تداول شاملة بما في ذلك أحجام اللوت الموصى بها، ومستويات وقف الخسارة، وأهداف جني الأرباح. يحلل نظام الإشارات المتقدم لدينا أطر زمنية متعددة، ومشاعر السوق، والمؤشرات الاقتصادية لتزويدك بفرص تداول عالية الاحتمالية عبر أزواج العملات الرئيسية والمؤشرات والسلع. تتضمن كل إشارة مبررًا تفصيليًا وتقييمًا للمخاطر وتحديثات في الوقت الفعلي مع تطور ظروف السوق.',
    'vip.expertIntelligence': 'ذكاء خبير',
    'vip.expertIntelligenceDescription': 'احصل على تحليلات السوق اليومية الشاملة، والتحليل الفني المتعمق، والرؤى الأساسية من مكتب التداول الرائد لدينا. يوفر محللونا الخبراء تحليلاً تفصيلياً للرسوم البيانية مع مستويات الدعم والمقاومة الرئيسية، وتحديد الاتجاهات، وتحليلات هيكل السوق. احصل على مراجعات التقويم الاقتصادي الأسبوعية، وتحليل سياسات البنوك المركزية، وتقييمات التأثير الجيوسياسي التي تساعدك على فهم الصورة الأكبر وراء تحركات السوق واتخاذ قرارات تداول أكثر استنارة.',
    'vip.ready': 'مستعد؟',
    'vip.startJourney': 'ابدأ رحلتك',
    'vip.startJourneyDescription': 'انضم إلى آلاف المتداولين الناجحين الذين يثقون في SageCoin لنجاحهم في التداول. تتضمن مجتمع VIP لدينا كل من المتداولين الأفراد والمستثمرين المحترفين الذين حققوا ربحية ثابتة من خلال استراتيجياتنا المثبتة وإرشاداتنا الخبيرة. مع معدل رضا الأعضاء المتوسط البالغ 94% وسجل حافل في مساعدة المتداولين على تحسين معدلات الفوز بنسبة تصل إلى 35%، يعتبر SageCoin VIP الخيار الأول للمتداولين الجادين الذين يتطلعون إلى رفع أدائهم وتحقيق أهدافهم المالية.',
    'vip.institutional': 'مؤسسي',
    'vip.readyToWin': 'هل أنت|مستعد للفوز؟',
    'vip.realTimeEntryExit': 'الدخول والخروج|في الوقت الفعلي',
    'vip.dailyMarketIntel': 'ذكاء السوق|اليومي',
    'vip.dashboardActive': 'لوحة تحكم VIP نشطة',
    'vip.liveAccessActive': 'الوصول المباشر نشط',
    'vip.welcomeBack': 'مرحباً بعودتك',
    'vip.trader': 'متداول',
    'vip.dashboardIntro': 'لوحة تحكم VIP الخاصة بك جاهزة. احصل على إشارات في الوقت الفعلي، وتحليل خبير، ورؤى تداول حصرية لتعظيم إمكانات التداول الخاصة بك.',
    'vip.viewSignals': 'عرض الإشارات',
    'vip.marketAnalysis': 'تحليل السوق',
    'vip.latestSignal': 'أحدث إشارة',
    'vip.expertInsight': 'رؤية خبيرة',
    'vip.analysisPreviewText': 'يظهر الذهب زخماً صعودياً قوياً مع مقاومة رئيسية عند 2040.00. ضع في اعتبارك مراكز شراء عند التراجعات.',
    'vip.symbolGold': 'XAUUSD / الذهب',
    'vip.buyAt': 'شراء @',
    
    // Public CTA
    'cta.title': 'هل أنت مستعد لبدء رحلتك في التداول؟',
    'cta.description': 'انضم إلى آلاف المتداولين الناجحين الذين يثقون في SageCoin للحصول على تحليل السوق الخبير واستراتيجيات التداول المثبتة. اتخذ الخطوة الأولى نحو إتقان الأسواق اليوم.',
    'cta.joinUs': 'انضم إلينا',
    'cta.openAccount': 'فتح حساب حقيقي',
    
    // Footer
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'الشروط',
    'footer.contact': 'اتصل بنا',
    
    // Dashboard
    'dashboard.title': 'لوحة التحكم الإدارية',
    'dashboard.subtitle': 'إدارة المستخدمين والطلبات',
    'dashboard.tabs.users': 'المستخدمون',
    'dashboard.tabs.requests': 'الطلبات',
    'dashboard.tabs.marketAnalysis': 'تحليل السوق',
    'dashboard.tabs.vipPreviews': 'معاينات VIP',
    
    // Dashboard - Users
    'dashboard.users.searchPlaceholder': 'البحث بالاسم أو البريد الإلكتروني...',
    'dashboard.users.filters.all': 'الكل',
    'dashboard.users.filters.admin': 'مدير',
    'dashboard.users.filters.user': 'مستخدم',
    'dashboard.users.filters.member': 'عضو',
    'dashboard.users.filters.regular': 'عادي', // Legacy
    'dashboard.users.filters.subscriber': 'مشترك', // Legacy
    'dashboard.users.filters.vip': 'VIP', // Legacy
    'dashboard.users.stats.total': 'إجمالي المستخدمين',
    'dashboard.users.stats.admin': 'المديرين',
    'dashboard.users.stats.member': 'الأعضاء',
    'dashboard.users.stats.user': 'المستخدمين',
    'dashboard.users.stats.vip': 'مستخدمي VIP', // Legacy
    'dashboard.users.stats.subscribers': 'المشتركين', // Legacy
    'dashboard.users.stats.regular': 'المستخدمين العاديين', // Legacy
    'dashboard.users.table.name': 'الاسم',
    'dashboard.users.table.email': 'البريد الإلكتروني',
    'dashboard.users.table.type': 'النوع',
    'dashboard.users.table.joinedDate': 'تاريخ الانضمام',
    'dashboard.users.table.status': 'الحالة',
    'dashboard.users.table.actions': 'الإجراءات',
    'dashboard.users.table.view': 'عرض',
    'dashboard.users.types.admin': 'مدير',
    'dashboard.users.types.user': 'مستخدم',
    'dashboard.users.types.member': 'عضو',
    'dashboard.users.types.regular': 'عادي', // Legacy
    'dashboard.users.types.subscriber': 'مشترك', // Legacy
    'dashboard.users.types.vip': 'VIP', // Legacy
    'dashboard.users.status.active': 'نشط',
    'dashboard.users.status.inactive': 'غير نشط',
    'dashboard.users.noUsers': 'لا يوجد مستخدمون',
    'dashboard.users.actions.edit': 'تعديل',
    'dashboard.users.actions.changeType': 'تغيير النوع',
    'dashboard.users.actions.type': 'النوع',
    'dashboard.users.actions.delete': 'حذف',
    
    // Dashboard - Requests
    'dashboard.requests.searchPlaceholder': 'البحث في الطلبات...',
    'dashboard.requests.filters.type': 'التصفية حسب النوع',
    'dashboard.requests.filters.status': 'التصفية حسب الحالة',
    'dashboard.requests.types.all': 'جميع الأنواع',
    'dashboard.requests.types.password': 'تغيير كلمة المرور',
    'dashboard.requests.types.leverage': 'تغيير الرافعة المالية',
    'dashboard.requests.types.withdraw': 'سحب',
    'dashboard.requests.types.deposit': 'إيداع',
    'dashboard.requests.status.all': 'جميع الحالات',
    'dashboard.requests.status.pending': 'قيد الانتظار',
    'dashboard.requests.status.approved': 'موافق عليه',
    'dashboard.requests.status.rejected': 'مرفوض',
    'dashboard.requests.stats.total': 'إجمالي الطلبات',
    'dashboard.requests.stats.pending': 'قيد الانتظار',
    'dashboard.requests.stats.approved': 'موافق عليه',
    'dashboard.requests.stats.rejected': 'مرفوض',
    'dashboard.requests.approve': 'موافقة',
    'dashboard.requests.reject': 'رفض',
    'dashboard.requests.setPending': 'تعيين كقيد الانتظار',
    'dashboard.requests.noRequests': 'لا توجد طلبات',
    
    // Dashboard - Dialogs
    'dashboard.dialogs.cancel': 'إلغاء',
    'dashboard.dialogs.save': 'حفظ',
    'dashboard.dialogs.delete': 'حذف',
    'dashboard.dialogs.confirm': 'تأكيد',
    
    // Edit User Dialog
    'dashboard.dialogs.editUser.title': 'تعديل المستخدم',
    'dashboard.dialogs.editUser.name': 'الاسم',
    'dashboard.dialogs.editUser.email': 'البريد الإلكتروني',
    'dashboard.dialogs.editUser.type': 'نوع المستخدم',
    'dashboard.dialogs.editUser.status': 'الحالة',
    
    // Delete User Dialog
    'dashboard.dialogs.deleteUser.title': 'حذف المستخدم',
    'dashboard.dialogs.deleteUser.message': 'هل أنت متأكد من حذف المستخدم {{name}} ({{email}})? لا يمكن التراجع عن هذا الإجراء.',
    
    // Change User Type Dialog
    'dashboard.dialogs.changeUserType.title': 'تغيير نوع المستخدم',
    'dashboard.dialogs.changeUserType.message': 'تغيير نوع المستخدم لـ {{name}}',
    'dashboard.dialogs.changeUserType.newType': 'نوع المستخدم الجديد',
    
    // Request Action Dialog
    'dashboard.dialogs.requestAction.approve': 'الموافقة على الطلب',
    'dashboard.dialogs.requestAction.reject': 'رفض الطلب',
    'dashboard.dialogs.requestAction.setPending': 'تعيين الطلب كقيد الانتظار',
    'dashboard.dialogs.requestAction.user': 'المستخدم',
    'dashboard.dialogs.requestAction.type': 'نوع الطلب',
    'dashboard.dialogs.requestAction.details': 'التفاصيل',
    'dashboard.dialogs.requestAction.notes': 'ملاحظات',
    'dashboard.dialogs.requestAction.optional': 'اختياري',
    'dashboard.dialogs.requestAction.notesPlaceholder': 'أضف أي ملاحظات حول هذا الإجراء...',
    
    // Dashboard - Market Analysis
    'dashboard.marketAnalysis.title': 'أقسام تحليل السوق',
    'dashboard.marketAnalysis.addSection': 'إضافة قسم',
    'dashboard.marketAnalysis.editSection': 'تعديل القسم',
    'dashboard.marketAnalysis.deleteSection': 'حذف القسم',
    'dashboard.marketAnalysis.edit': 'تعديل',
    'dashboard.marketAnalysis.delete': 'حذف',
    'dashboard.marketAnalysis.saving': 'جاري الحفظ...',
    'dashboard.marketAnalysis.deleting': 'جاري الحذف...',
    'dashboard.marketAnalysis.noSections': 'لا توجد أقسام تحليل سوق. أضف أول قسم للبدء.',
    'dashboard.marketAnalysis.image': 'الصورة',
    'dashboard.marketAnalysis.titleEn': 'العنوان (الإنجليزية)',
    'dashboard.marketAnalysis.titleAr': 'العنوان (العربية)',
    'dashboard.marketAnalysis.descriptionEn': 'الوصف (الإنجليزية)',
    'dashboard.marketAnalysis.descriptionAr': 'الوصف (العربية)',
    'dashboard.marketAnalysis.displayOrder': 'ترتيب العرض',
    'dashboard.marketAnalysis.isActive': 'نشط',
    'dashboard.marketAnalysis.deleteConfirm': 'هل أنت متأكد من حذف القسم "{{title}}"? لا يمكن التراجع عن هذا الإجراء.',
    
    // Dashboard - VIP Previews
    'dashboard.vipPreviews.title': 'معاينات لوحة تحكم VIP',
    'dashboard.vipPreviews.addPreview': 'إضافة معاينة',
    'dashboard.vipPreviews.editPreview': 'تعديل المعاينة',
    'dashboard.vipPreviews.deletePreview': 'حذف المعاينة',
    'dashboard.vipPreviews.latestSignals': 'أحدث الإشارات',
    'dashboard.vipPreviews.expertInsights': 'رؤى الخبراء',
    'dashboard.vipPreviews.noLatestSignals': 'لا توجد إشارات. أضف أول إشارة للبدء.',
    'dashboard.vipPreviews.noExpertInsights': 'لا توجد رؤى خبيرة. أضف أول رؤية للبدء.',
    'dashboard.vipPreviews.edit': 'تعديل',
    'dashboard.vipPreviews.delete': 'حذف',
    'dashboard.vipPreviews.saving': 'جاري الحفظ...',
    'dashboard.vipPreviews.deleting': 'جاري الحذف...',
    'dashboard.vipPreviews.type': 'النوع',
    'dashboard.vipPreviews.typeLatestSignal': 'أحدث إشارة',
    'dashboard.vipPreviews.typeExpertInsight': 'رؤية خبيرة',
    'dashboard.vipPreviews.symbol': 'الرمز',
    'dashboard.vipPreviews.action': 'الإجراء',
    'dashboard.vipPreviews.price': 'السعر',
    'dashboard.vipPreviews.textEn': 'النص (الإنجليزية)',
    'dashboard.vipPreviews.textAr': 'النص (العربية)',
    'dashboard.vipPreviews.isActive': 'نشط',
    'dashboard.vipPreviews.deleteConfirm': 'هل أنت متأكد من حذف هذه المعاينة? لا يمكن التراجع عن هذا الإجراء.',
    
    // About Journey
    'about.step1.heading': 'رأينا الضوضاء.',
    'about.step1.paragraph1': 'الأسواق ليست مبنية للوضوح. تعمل على عدم التوازن—حيث تفضل البيانات والسرعة والهيكل أولئك الذين لديهم استعداد. يُترك معظم المتداولين يتخذون قرارات بدون سياق أو اتجاه.',
    'about.step1.paragraph2': 'شاهدنا عدداً لا يحصى من المتداولين يفقدون رؤوس أموالهم—ليس بسبب نقص الجهد، ولكن بسبب التداول بدون هيكل أو انضباط أو أدوات مستنيرة.',
    'about.step2.heading': 'بنينا الإطار.',
    'about.step2.paragraph1': 'من خلال سنوات من الدراسة المنضبطة للسوق، استخلصنا المبادئ التي تحرك حركة الأسعار. لقد بنينا أنظمة تركز على الهيكل والتوقيت والاحتمالية—وليس التنبؤ.',
    'about.step3.heading': 'ما وراء الأداء.',
    'about.step3.paragraph1': 'هذا ليس فقط عن العوائد. إنه عن الاتساق والتحكم والثقة. كل إشارة وكل تحليل مصمم لدعم قرارات أكثر حكمة ونمو مستدام.',
    'about.step3.stats.livesChanged': 'المتداولون المسترشدون',
    'about.step3.stats.successRate': 'دقة الإشارات',
    'about.step3.stats.avgReturns': 'العوائد المعدلة للمخاطر',
    'about.step4.heading': 'القرار.',
    'about.step4.question': 'هل أنت مستعد للتداول بحكمة؟',
    'about.step4.buttonReady': 'نعم، لنبدأ',
    'about.step4.buttonNotYet': 'ليس بعد',
    'about.form.title': 'ابدأ الآن',
    'about.form.description': 'شارك تفاصيلك وسنتواصل معك قريباً.',
    'about.form.fullName': 'الاسم الكامل',
    'about.form.email': 'عنوان البريد الإلكتروني',
    'about.form.phone': 'رقم الهاتف',
    'about.form.cancel': 'إلغاء',
    'about.form.submit': 'إرسال',
    'about.form.submitting': 'جاري الإرسال...',
    'about.form.error.fillAll': 'يرجى ملء جميع الحقول',
    'about.form.error.unexpected': 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    'about.aria.close': 'إغلاق',
    'about.aria.previousStep': 'الخطوة السابقة',
    'about.aria.nextStep': 'الخطوة التالية',
    'about.aria.closeForm': 'إغلاق النموذج',
    'about.aria.goToStep': 'الانتقال إلى الخطوة',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    
    // Add smooth transition for direction change
    document.documentElement.style.transition = 'all 0.3s ease-in-out'
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    
    // Remove transition after animation completes
    setTimeout(() => {
      document.documentElement.style.transition = ''
    }, 300)
  }

  // Update document direction when language changes
  useEffect(() => {
    // Add smooth transition for direction change
    document.documentElement.style.transition = 'all 0.3s ease-in-out'
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    
    // Remove transition after animation completes
    const timeoutId = setTimeout(() => {
      document.documentElement.style.transition = ''
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  const isRTL = language === 'ar'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

