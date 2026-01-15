export type Language = 'en' | 'ms';

export interface Translations {
  // Header
  header: {
    howItWorks: string;
    demo: string;
    theProcess: string;
    roomIdeas: string;
    roomPackages: string;
    roomPackagesDesc: string;
    livingRooms: string;
    bedrooms: string;
    diningRooms: string;
    homeOffices: string;
    readingNooks: string;
    fullPackages: string;
    modernCozy: string;
    peacefulRetreats: string;
    gatheringSpaces: string;
    productiveWork: string;
    cozyCorners: string;
    completeHomes: string;
    completeApartments: string;
    fullHomeStagingPackages: string;
    customizeRoomSelection: string;
    buildYourPerfectSpace: string;
    showcase: string;
    beforeAfter: string;
    seeDramaticTransformations: string;
    ourWork: string;
    exploreOurPortfolio: string;
    products: string;
    reviews: string;
    signIn: string;
    myAccount: string;
    savedDesigns: string;
    preferences: string;
    signOut: string;
    menu: string;
    signInCreateAccount: string;
  };
  
  // Hero
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
  };
  
  // How It Works
  howItWorks: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  
  // Why Choose
  whyChoose: {
    title: string;
    subtitle: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    stat4Value: string;
    stat4Label: string;
    feature1Title: string;
    feature1Desc: string;
    feature1Point1: string;
    feature1Point2: string;
    feature1Point3: string;
    feature1Point4: string;
    feature2Title: string;
    feature2Desc: string;
    feature2Point1: string;
    feature2Point2: string;
    feature2Point3: string;
    feature2Point4: string;
    feature3Title: string;
    feature3Desc: string;
    feature3Point1: string;
    feature3Point2: string;
    feature3Point3: string;
    feature3Point4: string;
    feature4Title: string;
    feature4Desc: string;
    feature4Point1: string;
    feature4Point2: string;
    feature4Point3: string;
    feature4Point4: string;
    ctaStart: string;
    ctaBrowse: string;
  };
  
  // Products
  products: {
    title: string;
    subtitle: string;
    all: string;
    seating: string;
    tables: string;
    storage: string;
    decor: string;
    addToCart: string;
    viewAllProducts: string;
  };
  
  // Room Ideas
  roomIdeas: {
    title: string;
    subtitle: string;
    from: string;
    viewPackage: string;
    modernLiving: string;
    minimalistBedroom: string;
    contemporaryDining: string;
    homeOffice: string;
  };
  
  // Showcase
  showcase: {
    title: string;
    subtitle: string;
    beforeLabel: string;
    afterLabel: string;
    cta: string;
  };
  
  // Testimonials
  testimonials: {
    title: string;
    subtitle: string;
  };
  
  // Footer
  footer: {
    tagline: string;
    shop: string;
    allProducts: string;
    roomPackages: string;
    homeStaging: string;
    beforeAfter: string;
    support: string;
    contactUs: string;
    deliveryInstallation: string;
    faq: string;
    returnsPolicy: string;
    company: string;
    aboutUs: string;
    ourServices: string;
    privacyPolicy: string;
    termsOfService: string;
    copyright: string;
  };
  
  // Common
  common: {
    learnMore: string;
    getStarted: string;
    viewMore: string;
    close: string;
    cancel: string;
    confirm: string;
    next: string;
    previous: string;
    submit: string;
    save: string;
  };
  
  // Mobile Navigation
  mobileNav: {
    home: string;
    products: string;
    customize: string;
    cart: string;
    account: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      howItWorks: 'How It Works',
      demo: 'Demo',
      theProcess: 'The Process',
      roomIdeas: 'Room Ideas',
      roomPackages: 'Room Packages',
      roomPackagesDesc: 'Complete furniture collections for every space',
      livingRooms: 'Living Rooms',
      bedrooms: 'Bedrooms',
      diningRooms: 'Dining Rooms',
      homeOffices: 'Home Offices',
      readingNooks: 'Reading Nooks',
      fullPackages: 'Full Packages',
      modernCozy: 'Modern & cozy spaces',
      peacefulRetreats: 'Peaceful retreats',
      gatheringSpaces: 'Gathering spaces',
      productiveWork: 'Productive work',
      cozyCorners: 'Cozy corners',
      completeHomes: 'Complete homes',
      completeApartments: 'Complete Apartments',
      fullHomeStagingPackages: 'Full home staging packages',
      customizeRoomSelection: 'Customize Room Selection',
      buildYourPerfectSpace: 'Build your perfect space step-by-step',
      showcase: 'Showcase',
      beforeAfter: 'Before & After',
      seeDramaticTransformations: 'See dramatic transformations',
      ourWork: 'Our Work',
      exploreOurPortfolio: 'Explore our project portfolio',
      products: 'Products',
      reviews: 'Reviews',
      signIn: 'Sign In',
      myAccount: 'My Account',
      savedDesigns: 'Saved Designs',
      preferences: 'Preferences',
      signOut: 'Sign Out',
      menu: 'Menu',
      signInCreateAccount: 'Sign In / Create Account',
    },
    hero: {
      badge: 'Furniture Made Simple • From Vision to Reality',
      title: 'Transform Your Living Space',
      subtitle: 'Discover how the right furniture can completely reimagine your home. See the dramatic difference quality pieces can make.',
      cta: 'Explore Collections',
      ctaSecondary: 'Watch Video',
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Three simple steps to transform your space with Vision Studio',
      step1Title: 'Choose Your Style',
      step1Desc: 'Browse our curated room collections and select the design style that matches your taste. From modern minimalist to elegant traditional, find your perfect look.',
      step2Title: 'Customize & Finance',
      step2Desc: 'Personalize your selections to fit your space and budget. Apply for flexible financing options to make your dream furniture affordable and accessible.',
      step3Title: 'Delivery & Setup',
      step3Desc: 'Schedule convenient delivery at your preferred time. Our professional team will deliver and install everything, so you can enjoy your new space immediately.',
    },
    whyChoose: {
      title: 'Why Choose Vision Studio?',
      subtitle: 'Experience the difference of working with a furniture company that puts quality, service, and your satisfaction first',
      stat1Value: '15+',
      stat1Label: 'Years of Excellence',
      stat2Value: '50K+',
      stat2Label: 'Happy Customers',
      stat3Value: '98%',
      stat3Label: 'Satisfaction Rate',
      stat4Value: '1000+',
      stat4Label: 'Quality Products',
      feature1Title: 'Quality Craftsmanship',
      feature1Desc: 'We source our furniture from renowned manufacturers who share our commitment to excellence. Every item undergoes rigorous quality control inspections.',
      feature1Point1: 'Premium materials including solid hardwoods and top-grain leather',
      feature1Point2: 'Expert craftsmanship with meticulous attention to detail',
      feature1Point3: 'Sustainable and eco-friendly manufacturing processes',
      feature1Point4: 'Industry-leading warranties on all products',
      feature2Title: 'White-Glove Delivery',
      feature2Desc: 'Our complimentary white-glove delivery service on orders over $500 goes beyond just dropping off your furniture—we ensure everything is perfect.',
      feature2Point1: 'Scheduled delivery at your preferred date and time',
      feature2Point2: 'Professional assembly and installation included',
      feature2Point3: 'Placement of furniture in your desired room',
      feature2Point4: 'Complete removal of all packaging materials',
      feature3Title: 'Hassle-Free Returns',
      feature3Desc: 'We stand behind every piece we sell. If you\'re not completely satisfied with your purchase, our 30-day return policy makes it easy to get a full refund.',
      feature3Point1: 'Full 30-day window to return any item',
      feature3Point2: 'Free return pickup service at your convenience',
      feature3Point3: '100% money-back guarantee, no questions asked',
      feature3Point4: 'No restocking fees or hidden charges',
      feature4Title: 'Expert Design Support',
      feature4Desc: 'Our team of experienced interior designers is here to help you create the perfect space. Get personalized recommendations tailored to your style and budget.',
      feature4Point1: 'Free consultation with professional designers',
      feature4Point2: 'Personalized room planning and layout assistance',
      feature4Point3: 'Style matching and color coordination guidance',
      feature4Point4: 'AI-powered design chatbot available 24/7',
      ctaStart: 'Start Shopping',
      ctaBrowse: 'Browse Collections',
    },
    products: {
      title: 'Featured Products',
      subtitle: 'Handpicked furniture pieces to elevate your home',
      all: 'All',
      seating: 'Seating',
      tables: 'Tables',
      storage: 'Storage',
      decor: 'Decor',
      addToCart: 'Add to Cart',
      viewAllProducts: 'View All Products',
    },
    roomIdeas: {
      title: 'Complete Room Packages',
      subtitle: 'Ready-to-shop curated furniture collections. Click any room to see the complete layout, items included, and pricing.',
      from: 'From',
      viewPackage: 'View Package',
      modernLiving: 'Modern Living Room',
      minimalistBedroom: 'Minimalist Bedroom',
      contemporaryDining: 'Contemporary Dining',
      homeOffice: 'Home Office Setup',
    },
    showcase: {
      title: 'See The Transformation',
      subtitle: 'Drag the slider to compare before and after',
      beforeLabel: 'Before',
      afterLabel: 'After',
      cta: 'Shop the Look',
    },
    testimonials: {
      title: 'What Our Customers Say',
      subtitle: 'Join thousands of happy customers who transformed their homes',
    },
    footer: {
      tagline: 'Transform your space with our curated collection of modern furniture.',
      shop: 'Shop',
      allProducts: 'All Products',
      roomPackages: 'Room Packages',
      homeStaging: 'Home Staging',
      beforeAfter: 'Before & After',
      support: 'Support',
      contactUs: 'Contact Us',
      deliveryInstallation: 'Delivery & Installation',
      faq: 'FAQ',
      returnsPolicy: 'Returns Policy',
      company: 'Company',
      aboutUs: 'About Us',
      ourServices: 'Our Services',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      copyright: '© 2025 Vision Studio. All rights reserved.',
    },
    common: {
      learnMore: 'Learn More',
      getStarted: 'Get Started',
      viewMore: 'View More',
      close: 'Close',
      cancel: 'Cancel',
      confirm: 'Confirm',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      save: 'Save',
    },
    mobileNav: {
      home: 'Home',
      products: 'Products',
      customize: 'Customize',
      cart: 'Cart',
      account: 'Account',
    },
  },
  ms: {
    header: {
      howItWorks: 'Cara Ia Berfungsi',
      demo: 'Demo',
      theProcess: 'Proses',
      roomIdeas: 'Idea Bilik',
      roomPackages: 'Pakej Bilik',
      roomPackagesDesc: 'Koleksi perabot lengkap untuk setiap ruang',
      livingRooms: 'Bilik Tamu',
      bedrooms: 'Bilik Tidur',
      diningRooms: 'Bilik Makan',
      homeOffices: 'Pejabat Rumah',
      readingNooks: 'Sudut Bacaan',
      fullPackages: 'Pakej Penuh',
      modernCozy: 'Ruang moden & selesa',
      peacefulRetreats: 'Persaraan yang aman',
      gatheringSpaces: 'Ruang berkumpul',
      productiveWork: 'Kerja produktif',
      cozyCorners: 'Sudut yang selesa',
      completeHomes: 'Rumah lengkap',
      completeApartments: 'Apartmen Lengkap',
      fullHomeStagingPackages: 'Pakej pentas rumah penuh',
      customizeRoomSelection: 'Sesuaikan Pemilihan Bilik',
      buildYourPerfectSpace: 'Bina ruang sempurna anda langkah demi langkah',
      showcase: 'Pameran',
      beforeAfter: 'Sebelum & Selepas',
      seeDramaticTransformations: 'Lihat transformasi yang dramatik',
      ourWork: 'Karya Kami',
      exploreOurPortfolio: 'Terokai portfolio projek kami',
      products: 'Produk',
      reviews: 'Ulasan',
      signIn: 'Log Masuk',
      myAccount: 'Akaun Saya',
      savedDesigns: 'Reka Bentuk Tersimpan',
      preferences: 'Keutamaan',
      signOut: 'Log Keluar',
      menu: 'Menu',
      signInCreateAccount: 'Log Masuk / Buat Akaun',
    },
    hero: {
      badge: 'Perabot Dibuat Mudah • Dari Visi ke Realiti',
      title: 'Ubah Ruang Tamu Anda',
      subtitle: 'Temui bagaimana perabot yang tepat boleh mengubah sepenuhnya rumah anda. Lihat perbezaan dramatik yang boleh dibuat oleh kepingan berkualiti.',
      cta: 'Terokai Koleksi',
      ctaSecondary: 'Tonton Video',
    },
    howItWorks: {
      title: 'Cara Ia Berfungsi',
      subtitle: 'Tiga langkah mudah untuk mengubah ruang anda dengan Vision Studio',
      step1Title: 'Pilih Gaya Anda',
      step1Desc: 'Layari koleksi bilik kami yang dipilih khas dan pilih gaya reka bentuk yang sesuai dengan citarasa anda. Dari minimalis moden hingga tradisional yang elegan, temui penampilan sempurna anda.',
      step2Title: 'Sesuaikan & Pembiayaan',
      step2Desc: 'Personalisasikan pilihan anda untuk disesuaikan dengan ruang dan bajet anda. Mohon pilihan pembiayaan yang fleksibel untuk menjadikan perabot impian anda mampu dimiliki dan mudah diakses.',
      step3Title: 'Penghantaran & Pemasangan',
      step3Desc: 'Jadualkan penghantaran yang mudah pada masa pilihan anda. Pasukan profesional kami akan menghantar dan memasang segala-galanya, supaya anda boleh menikmati ruang baru anda dengan segera.',
    },
    whyChoose: {
      title: 'Mengapa Pilih Vision Studio?',
      subtitle: 'Rasai perbezaan bekerja dengan syarikat perabot yang mengutamakan kualiti, perkhidmatan, dan kepuasan anda',
      stat1Value: '15+',
      stat1Label: 'Tahun Kecemerlangan',
      stat2Value: '50K+',
      stat2Label: 'Pelanggan Gembira',
      stat3Value: '98%',
      stat3Label: 'Kadar Kepuasan',
      stat4Value: '1000+',
      stat4Label: 'Produk Berkualiti',
      feature1Title: 'Ketukangan Berkualiti',
      feature1Desc: 'Kami mendapatkan perabot kami dari pengeluar terkenal yang berkongsi komitmen kami terhadap kecemerlangan. Setiap item menjalani pemeriksaan kawalan kualiti yang ketat.',
      feature1Point1: 'Bahan premium termasuk kayu keras pepejal dan kulit gred tertinggi',
      feature1Point2: 'Ketukangan pakar dengan perhatian teliti terhadap perincian',
      feature1Point3: 'Proses pembuatan yang mampan dan mesra alam',
      feature1Point4: 'Waranti terkemuka industri untuk semua produk',
      feature2Title: 'Penghantaran Sarung Tangan Putih',
      feature2Desc: 'Perkhidmatan penghantaran sarung tangan putih percuma kami untuk pesanan melebihi $500 bukan sekadar menghantar perabot anda—kami memastikan segala-galanya sempurna.',
      feature2Point1: 'Penghantaran berjadual pada tarikh dan masa pilihan anda',
      feature2Point2: 'Pemasangan dan instalasi profesional disertakan',
      feature2Point3: 'Penempatan perabot di bilik yang anda inginkan',
      feature2Point4: 'Penyingkiran lengkap semua bahan pembungkusan',
      feature3Title: 'Pemulangan Tanpa Kerumitan',
      feature3Desc: 'Kami menyokong setiap perabot yang kami jual. Jika anda tidak berpuas hati sepenuhnya dengan pembelian anda, dasar pemulangan 30 hari kami memudahkan untuk mendapatkan bayaran balik penuh.',
      feature3Point1: 'Tempoh penuh 30 hari untuk memulangkan apa-apa item',
      feature3Point2: 'Perkhidmatan pengambilan pemulangan percuma mengikut kemudahan anda',
      feature3Point3: 'Jaminan wang kembali 100%, tanpa soalan ditanya',
      feature3Point4: 'Tiada bayaran penyimpanan semula atau caj tersembunyi',
      feature4Title: 'Sokongan Reka Bentuk Pakar',
      feature4Desc: 'Pasukan pereka dalaman berpengalaman kami di sini untuk membantu anda mencipta ruang yang sempurna. Dapatkan cadangan diperibadikan yang disesuaikan dengan gaya dan bajet anda.',
      feature4Point1: 'Perundingan percuma dengan pereka profesional',
      feature4Point2: 'Bantuan perancangan bilik dan susun atur diperibadikan',
      feature4Point3: 'Panduan padanan gaya dan koordinasi warna',
      feature4Point4: 'Chatbot reka bentuk berkuasa AI tersedia 24/7',
      ctaStart: 'Mula Membeli-belah',
      ctaBrowse: 'Layari Koleksi',
    },
    products: {
      title: 'Produk Pilihan',
      subtitle: 'Kepingan perabot terpilih untuk meningkatkan rumah anda',
      all: 'Semua',
      seating: 'Tempat Duduk',
      tables: 'Meja',
      storage: 'Penyimpanan',
      decor: 'Hiasan',
      addToCart: 'Tambah ke Troli',
      viewAllProducts: 'Lihat Semua Produk',
    },
    roomIdeas: {
      title: 'Pakej Bilik Lengkap',
      subtitle: 'Koleksi perabot terpilih yang sedia untuk dibeli. Klik mana-mana bilik untuk melihat susun atur lengkap, item yang disertakan, dan harga.',
      from: 'Dari',
      viewPackage: 'Lihat Pakej',
      modernLiving: 'Bilik Tamu Moden',
      minimalistBedroom: 'Bilik Tidur Minimalis',
      contemporaryDining: 'Makan Kontemporari',
      homeOffice: 'Persediaan Pejabat Rumah',
    },
    showcase: {
      title: 'Lihat Transformasi',
      subtitle: 'Seret penggeser untuk membandingkan sebelum dan selepas',
      beforeLabel: 'Sebelum',
      afterLabel: 'Selepas',
      cta: 'Beli Penampilan Ini',
    },
    testimonials: {
      title: 'Apa Kata Pelanggan Kami',
      subtitle: 'Sertai ribuan pelanggan gembira yang mengubah rumah mereka',
    },
    footer: {
      tagline: 'Ubah ruang anda dengan koleksi perabot moden kami yang dipilih khas.',
      shop: 'Beli-belah',
      allProducts: 'Semua Produk',
      roomPackages: 'Pakej Bilik',
      homeStaging: 'Pentas Rumah',
      beforeAfter: 'Sebelum & Selepas',
      support: 'Sokongan',
      contactUs: 'Hubungi Kami',
      deliveryInstallation: 'Penghantaran & Pemasangan',
      faq: 'Soalan Lazim',
      returnsPolicy: 'Dasar Pemulangan',
      company: 'Syarikat',
      aboutUs: 'Tentang Kami',
      ourServices: 'Perkhidmatan Kami',
      privacyPolicy: 'Dasar Privasi',
      termsOfService: 'Syarat Perkhidmatan',
      copyright: '© 2025 Vision Studio. Hak cipta terpelihara.',
    },
    common: {
      learnMore: 'Ketahui Lebih Lanjut',
      getStarted: 'Mulakan',
      viewMore: 'Lihat Lebih',
      close: 'Tutup',
      cancel: 'Batal',
      confirm: 'Sahkan',
      next: 'Seterusnya',
      previous: 'Sebelumnya',
      submit: 'Hantar',
      save: 'Simpan',
    },
    mobileNav: {
      home: 'Rumah',
      products: 'Produk',
      customize: 'Sesuaikan',
      cart: 'Troli',
      account: 'Akaun',
    },
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}