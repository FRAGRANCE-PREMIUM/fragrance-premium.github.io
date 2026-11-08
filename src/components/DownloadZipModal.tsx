import React, { useState } from 'react';
import {
  X,
  Download,
  FileCode,
  Copy,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  Layers,
  Settings,
  Shield,
  ShoppingBag,
  Database,
  Code2,
  FileText,
  Terminal,
  Globe,
} from 'lucide-react';

interface SingleFileItem {
  name: string;
  filename: string;
  path: string;
  size: string;
  category: 'core' | 'catalog' | 'checkout' | 'admin' | 'components' | 'config';
  categoryLabel: string;
  badgeColor: string;
  icon: React.ElementType;
  descriptionBn: string;
  descriptionEn: string;
}

const MAIN_FILES: SingleFileItem[] = [
  {
    name: 'Products & Price Racks Catalog',
    filename: 'products.ts',
    path: '/downloads/products.ts',
    size: '104 KB',
    category: 'catalog',
    categoryLabel: 'Product Catalog',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: Database,
    descriptionBn: 'সম্পূর্ণ ৪০+ আতরের তালিকা, ৬টি প্রাইস র‍্যাক (₹৪০, ₹৫০, ₹৬০, ₹১০০, ₹১৪০, ₹২০০), ৬ ও ১২ পিস বক্সের দাম, নোটস পিরামিড ও ছবি।',
    descriptionEn: 'Core database of all 40+ attars across 6 price racks with single and master box packaging rates.',
  },
  {
    name: 'Order Details & Dispatch Page',
    filename: 'OrderDetailsPage.tsx',
    path: '/downloads/OrderDetailsPage.tsx',
    size: '48 KB',
    category: 'checkout',
    categoryLabel: 'Checkout & Orders',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: ShoppingBag,
    descriptionBn: 'অর্ডার ফর্ম, চুঁচুড়া থেকে লাইভ দূরত্ব ক্যালকুলেটর (২ কিমি ফ্রি, তারপর ₹১০/৫০০মি), ওটিপি মোবাইল ভেরিফিকেশন এবং nskproject01@gmail.com এ অটো মেইল।',
    descriptionEn: 'Full checkout with Chinsurah live GPS delivery fee meter, OTP verification, and nskproject01@gmail.com dispatch.',
  },
  {
    name: 'Store Orders Vault (Admin)',
    filename: 'OrdersDashboardPage.tsx',
    path: '/downloads/OrdersDashboardPage.tsx',
    size: '52 KB',
    category: 'admin',
    categoryLabel: 'Admin Vault',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: Shield,
    descriptionBn: 'অ্যাডমিন অর্ডার কন্ট্রোল প্যানেল: পাসওয়ার্ড সুরক্ষা, স্ট্যাটাস পরিবর্তন (Received, Processing, Dispatched, Delivered) এবং জিমেইলে ফরওয়ার্ড।',
    descriptionEn: 'Admin dashboard to manage order lifecycle, filter statuses, view customer coordinates, and forward to Gmail.',
  },
  {
    name: 'Store Master Configuration',
    filename: 'config.ts',
    path: '/downloads/config.ts',
    size: '3.4 KB',
    category: 'config',
    categoryLabel: 'Configuration',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: Settings,
    descriptionBn: 'চুঁচুড়া স্টোর লোকেশন (WCP3+C4P), ২ কিমি ফ্রি ডেলিভারি রুলস, হেল্পলাইন ফোন নম্বর (+91 8777855462) এবং জিমেইল টার্গেট।',
    descriptionEn: 'Chinsurah atelier GPS coordinates, free delivery radii, primary helpline, and nskproject01@gmail.com target.',
  },
  {
    name: 'Order Confirmation & 1-Tap Gmail',
    filename: 'OrderSuccessPage.tsx',
    path: '/downloads/OrderSuccessPage.tsx',
    size: '19 KB',
    category: 'checkout',
    categoryLabel: 'Order Confirmation',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: FileText,
    descriptionBn: 'অর্ডার কনফার্মেশন স্ক্রিন, অর্ডার রসিদ প্রিন্ট এবং ১-ক্লিকে Gmail অ্যাপ খুলে nskproject01@gmail.com এ অর্ডার কপি পাঠানোর বাটন।',
    descriptionEn: 'Success screen with receipt print and 1-tap open in Gmail app button pre-addressed to nskproject01@gmail.com.',
  },
  {
    name: 'Main App Router & Orchestrator',
    filename: 'App.tsx',
    path: '/downloads/App.tsx',
    size: '8.8 KB',
    category: 'core',
    categoryLabel: 'Core Router',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    icon: Code2,
    descriptionBn: 'সম্পূর্ণ ওয়েবসাইটের মূল কম্পোনেন্ট: পেজ নেভিগেশন (Home, Collection, Checkout, Orders Vault), ড্রয়ার ও মোডাল ম্যানেজমেন্ট।',
    descriptionEn: 'Root React router managing page switches, responsive cart drawer, modals, and context providers.',
  },
  {
    name: 'Cart & Order Management Context',
    filename: 'CartContext.tsx',
    path: '/downloads/CartContext.tsx',
    size: '12 KB',
    category: 'core',
    categoryLabel: 'State Management',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    icon: Layers,
    descriptionBn: 'শপিং ব্যাগ, কোয়ান্টিটি যোগ/বিয়োগ, লোকাল স্টোরেজ ডাটা সংরক্ষণ এবং অর্ডার হিস্ট্রি সেভ করার স্টেট ম্যানেজমেন্ট হুক।',
    descriptionEn: 'React context managing cart bag persistence, unit pricing, real-time totals, and local order storage.',
  },
  {
    name: 'Product Card (Visual Showcase)',
    filename: 'ProductCard.tsx',
    path: '/downloads/ProductCard.tsx',
    size: '11 KB',
    category: 'components',
    categoryLabel: 'Component',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    icon: FileCode,
    descriptionBn: 'প্রতিটি আতরের কার্ড: ছবির নিজস্ব ব্যাকগ্রাউন্ড এক্সটেনশন, আনকাট সেফ জুম (বক্স ও বোতল সম্পূর্ণ দৃশ্যমান) এবং কুইক অ্যাড বাটন।',
    descriptionEn: 'Uniform aspect ratio product card with ambient photo background extension and uncropped gentle zoom.',
  },
  {
    name: 'Product Details Modal',
    filename: 'ProductDetailsModal.tsx',
    path: '/downloads/ProductDetailsModal.tsx',
    size: '29 KB',
    category: 'components',
    categoryLabel: 'Component',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    icon: FileCode,
    descriptionBn: 'আতরের বিস্তারিত পপআপ: সেন্ট পিরামিড (টপ, হার্ট, বেস নোটস), লংজিভিটি, সাইজ সিলেকশন (সিঙ্গেল ও বক্স) এবং ইন্টারেক্টিভ জুম।',
    descriptionEn: 'Interactive modal displaying olfactory pyramids, longevity ratings, size toggles, and high-res zoom.',
  },
  {
    name: 'Main Collection & Filter Page',
    filename: 'CollectionPage.tsx',
    path: '/downloads/CollectionPage.tsx',
    size: '53 KB',
    category: 'catalog',
    categoryLabel: 'Catalog Browsing',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: Database,
    descriptionBn: 'সম্পূর্ণ আতর ব্রাউজিং পেজ: প্রাইজ র‍্যাক ফিল্টার (৪০, ৫০, ৬০, ১০০, ১৪০, ২০০), ক্যাটাগরি ফিল্টার এবং বক্স ফিল্টার।',
    descriptionEn: 'Full collection catalog with instant multi-facet filters, price racks sorting, and search.',
  },
  {
    name: 'Client Contact & Custom Inquiry Page',
    filename: 'ContactPage.tsx',
    path: '/downloads/ContactPage.tsx',
    size: '28 KB',
    category: 'checkout',
    categoryLabel: 'Contact Desk',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: FileText,
    descriptionBn: 'কাস্টমার ইনকোয়ারি ফর্ম, ডাইরেক্ট হেল্পলাইন (+91 8777855462) এবং সরাসরি nskproject01@gmail.com এ মেসেজ প্রেরণ।',
    descriptionEn: 'Inquiry and custom decant request form dispatching straight to nskproject01@gmail.com.',
  },
  {
    name: 'Home Page Hero & Story Showcase',
    filename: 'HomePage.tsx',
    path: '/downloads/HomePage.tsx',
    size: '59 KB',
    category: 'core',
    categoryLabel: 'Landing Page',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    icon: Code2,
    descriptionBn: 'প্রধান ল্যান্ডিং পেজ: হিরো ব্যানার, ৬টি প্রাইজ র‍্যাক ট্যাব, পবিত্র আতর পরিধানের নিয়ম এবং কাস্টমার টেস্টিমোনিয়াল।',
    descriptionEn: 'Luxury landing page with royal hero banner, price rack selectors, and editorial attar ritual story.',
  },
  {
    name: 'Header & Royal Navigation Bar',
    filename: 'Header.tsx',
    path: '/downloads/Header.tsx',
    size: '16 KB',
    category: 'components',
    categoryLabel: 'Component',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    icon: FileCode,
    descriptionBn: 'রয়েল হেডার বার: লোগো, নোটিফিকেশন বার, স্টোর ভল্ট শর্টকাট বাটন, সার্চ ও মোবাইল মেনু।',
    descriptionEn: 'Responsive header with store orders vault quick launch, notification ticker, and mobile nav.',
  },
  {
    name: 'Footer & Heritage Directory',
    filename: 'Footer.tsx',
    path: '/downloads/Footer.tsx',
    size: '9.2 KB',
    category: 'components',
    categoryLabel: 'Component',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    icon: FileCode,
    descriptionBn: 'ফুটার সেকশন: চুঁচুড়া স্টোরের ঠিকানা, পলিসি লিংক, হেল্পলাইন ও nskproject01@gmail.com ইমেইল।',
    descriptionEn: 'Footer with policy links, contact details, telephone helpline, and store address.',
  },
  {
    name: 'TypeScript Data Types Definition',
    filename: 'types.ts',
    path: '/downloads/types.ts',
    size: '2.9 KB',
    category: 'core',
    categoryLabel: 'Type Definitions',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    icon: Code2,
    descriptionBn: 'প্রোডাক্ট, কার্ট আইটেম, কাস্টমার এড্রেস, অর্ডার মডেল ও অ্যাপ্লিকেশন স্টেট ইন্টারফেস।',
    descriptionEn: 'TypeScript type definitions for Products, Sizes, Orders, and Application state.',
  },
  {
    name: 'NPM Project Manifest',
    filename: 'package.json',
    path: '/downloads/package.json',
    size: '887 B',
    category: 'config',
    categoryLabel: 'Build Config',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: Terminal,
    descriptionBn: 'প্রজেক্টের সকল ডিপেন্ডেন্সি (React, Lucide, Tailwind) এবং বিল্ড স্ক্রিপ্ট (npm run dev, npm run build)।',
    descriptionEn: 'NPM configuration, scripts, and runtime dependencies for building and running the app.',
  },
  {
    name: 'HTML5 Entry Point & Meta SEO',
    filename: 'index.html',
    path: '/downloads/index.html',
    size: '1.6 KB',
    category: 'config',
    categoryLabel: 'HTML Entry',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: Globe,
    descriptionBn: 'প্রধান HTML ফাইল: টাইটেল, এসইও মেটা ট্যাগ, গুগল ফন্টস এবং রুট মাউন্ট এলিমেন্ট।',
    descriptionEn: 'HTML5 root template with luxury Google Fonts, OpenGraph tags, and responsive viewport.',
  },
  {
    name: 'Vite Build System Configuration',
    filename: 'vite.config.ts',
    path: '/downloads/vite.config.ts',
    size: '731 B',
    category: 'config',
    categoryLabel: 'Build Config',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: Settings,
    descriptionBn: 'Vite বিল্ড কনফিগারেশন, প্লাগিন এবং সার্ভার পোর্ট সেটিংস।',
    descriptionEn: 'Vite bundler configuration with React plugin and server proxy options.',
  },
  {
    name: 'React Application Entry Point',
    filename: 'main.tsx',
    path: '/downloads/main.tsx',
    size: '159 B',
    category: 'core',
    categoryLabel: 'Application Entry',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    icon: Code2,
    descriptionBn: 'রিয়্যাক্ট DOM রেন্ডারার এবং গ্লোবাল সিএসএস ইমপোর্ট।',
    descriptionEn: 'React DOM root initialization and CSS entry point.',
  },
];

interface DownloadZipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadZipModal: React.FC<DownloadZipModalProps> = ({ isOpen, onClose }) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewFile, setPreviewFile] = useState<SingleFileItem | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async (file: SingleFileItem) => {
    try {
      const res = await fetch(file.path);
      const code = await res.text();
      await navigator.clipboard.writeText(code);
      setCopiedFile(file.filename);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch {
      alert(`Could not copy ${file.filename}. Please use the Download button.`);
    }
  };

  const handlePreviewCode = async (file: SingleFileItem) => {
    if (previewFile?.filename === file.filename) {
      setPreviewFile(null);
      setPreviewContent('');
      return;
    }
    setIsLoadingPreview(true);
    setPreviewFile(file);
    try {
      const res = await fetch(file.path);
      const code = await res.text();
      setPreviewContent(code);
    } catch {
      setPreviewContent('// Failed to load code preview. Please use the direct Download button.');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleDownloadAllSequentially = () => {
    setIsDownloadingAll(true);
    let delay = 0;
    MAIN_FILES.forEach((f) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = f.path;
        link.download = f.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, delay);
      delay += 300;
    });
    setTimeout(() => {
      setIsDownloadingAll(false);
    }, delay + 500);
  };

  const filteredFiles = MAIN_FILES.filter((f) => {
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.filename.toLowerCase().includes(q) ||
        f.name.toLowerCase().includes(q) ||
        f.descriptionBn.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-[#FAF7F0] border-2 border-[#C5A86A] rounded-3xl shadow-2xl overflow-hidden relative text-[#182920] animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#143628] text-[#FAF7F0] px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between border-b-2 border-[#C5A86A] flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#C5A86A] text-[#0F281D] flex items-center justify-center shadow-md flex-shrink-0">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-2xl font-bold tracking-wide text-white">
                  Main Code Files Direct Download
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#C5A86A] text-[#0F281D] text-[10px] font-extrabold uppercase">
                  Single Files · No ZIP
                </span>
              </div>
              <p className="text-xs text-[#C5A86A] font-semibold tracking-wider mt-0.5">
                ১ ক্লিকে আলাদা আলাদা কোড ফাইল ডাউনলোড করে লাইভ করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#FAF7F0]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Ticker & Filter Toolbar */}
        <div className="bg-white border-b border-[#D5CEBF] px-5 sm:px-7 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#143628] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#7A664F] hover:bg-[#EFE9DC]'
              }`}
            >
              All Files ({MAIN_FILES.length})
            </button>
            <button
              onClick={() => setSelectedCategory('catalog')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'catalog'
                  ? 'bg-[#143628] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#7A664F] hover:bg-[#EFE9DC]'
              }`}
            >
              Catalog &amp; Data
            </button>
            <button
              onClick={() => setSelectedCategory('checkout')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'checkout'
                  ? 'bg-[#143628] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#7A664F] hover:bg-[#EFE9DC]'
              }`}
            >
              Checkout &amp; Orders
            </button>
            <button
              onClick={() => setSelectedCategory('components')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'components'
                  ? 'bg-[#143628] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#7A664F] hover:bg-[#EFE9DC]'
              }`}
            >
              Components
            </button>
            <button
              onClick={() => setSelectedCategory('config')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'config'
                  ? 'bg-[#143628] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#7A664F] hover:bg-[#EFE9DC]'
              }`}
            >
              Config &amp; Setup
            </button>
          </div>

          {/* 1-Click Download All Single Files Button */}
          <button
            onClick={handleDownloadAllSequentially}
            disabled={isDownloadingAll}
            className="px-4 py-2 rounded-xl bg-[#C5A86A] hover:bg-[#B5985A] text-[#0F281D] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer whitespace-nowrap self-start sm:self-auto"
            title="Download all 19 files one after another automatically"
          >
            <Download className="w-4 h-4 text-[#0F281D]" />
            <span>{isDownloadingAll ? 'Downloading Files...' : 'Download All 19 Files'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Quick Notice Banner */}
          <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#10B981]/40 text-[#065F46] flex items-center gap-3 text-xs">
            <Sparkles className="w-5 h-5 text-[#10B981] flex-shrink-0" />
            <div>
              <strong className="block font-bold">জিআইপি (ZIP) ফাইল লাগবে না:</strong>
              নিচের প্রতিটি ফাইলের ডানপাশে থাকা সবুজ <strong>&ldquo;Download File&rdquo;</strong> বাটনে চাপলেই সরাসরি সেই ফাইলের সোর্স কোড ডাউনলোড হয়ে যাবে। অথবা <strong>&ldquo;Copy Code&rdquo;</strong> বাটনে চাপ দিয়ে সরাসরি কোড কপি করে আপনার প্রজেক্টে পেস্ট করে নিতে পারবেন।
            </div>
          </div>

          {/* Single Files Cards Grid */}
          <div className="grid grid-cols-1 gap-3">
            {filteredFiles.map((file, idx) => {
              const IconComp = file.icon;
              const isCopied = copiedFile === file.filename;
              const isPreviewing = previewFile?.filename === file.filename;

              return (
                <div
                  key={idx}
                  className="bg-white border border-[#D5CEBF] hover:border-[#143628] rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Left: File Info */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#D5CEBF] flex items-center justify-center text-[#143628] flex-shrink-0 mt-0.5">
                        <IconComp className="w-5 h-5 text-[#143628]" />
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-sm sm:text-base text-[#143628]">
                            {file.filename}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${file.badgeColor}`}
                          >
                            {file.categoryLabel}
                          </span>
                          <span className="text-[11px] font-mono text-[#7A664F] bg-[#FAF7F0] px-2 py-0.5 rounded-md border border-[#D5CEBF]/60">
                            {file.size}
                          </span>
                        </div>

                        <p className="text-xs text-[#182920]/85 font-medium leading-relaxed">
                          {file.descriptionBn}
                        </p>
                      </div>
                    </div>

                    {/* Right: 1-Click Action Buttons */}
                    <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0 pt-1 sm:pt-0">
                      
                      {/* Code Preview Toggle */}
                      <button
                        onClick={() => handlePreviewCode(file)}
                        className="px-3 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#EFE9DC] text-[#143628] border border-[#D5CEBF] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Preview code in modal"
                      >
                        {isPreviewing ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{isPreviewing ? 'Close' : 'View'}</span>
                      </button>

                      {/* Copy Code to Clipboard */}
                      <button
                        onClick={() => handleCopyCode(file)}
                        className="px-3 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#EFE9DC] text-[#143628] border border-[#D5CEBF] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Copy entire file code to clipboard"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#7A664F]" />
                            <span className="hidden sm:inline">Copy Code</span>
                          </>
                        )}
                      </button>

                      {/* 1-Click Direct Download Link */}
                      <a
                        href={file.path}
                        download={file.filename}
                        className="px-4 py-2 rounded-xl bg-[#143628] hover:bg-[#1F4D3B] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                        title={`Directly download ${file.filename} to your computer`}
                      >
                        <Download className="w-3.5 h-3.5 text-[#C5A86A]" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>

                  {/* Inline Code Preview Screen if Opened */}
                  {isPreviewing && (
                    <div className="mt-3 p-3.5 rounded-xl bg-[#0F281D] text-[#FAF7F0] border border-[#C5A86A]/40 space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-[11px] text-[#C5A86A] pb-2 border-b border-white/10 font-mono">
                        <span>Code View: {file.filename}</span>
                        <button
                          onClick={() => handleCopyCode(file)}
                          className="hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy this code</span>
                        </button>
                      </div>
                      {isLoadingPreview ? (
                        <div className="py-6 text-center text-xs text-white/70">
                          Loading file code...
                        </div>
                      ) : (
                        <pre className="text-xs font-mono max-h-60 overflow-y-auto overflow-x-auto p-2 bg-black/40 rounded-lg text-emerald-300 whitespace-pre">
                          {previewContent}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Guide to Run & Make Live */}
          <div className="bg-[#143628]/5 border border-[#143628]/20 rounded-2xl p-5 space-y-3 mt-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-[#143628]">
              <Sparkles className="w-4 h-4 text-[#C5A86A]" />
              <span>এই ফাইলগুলো দিয়ে ৩ মিনিটে ওয়েবসাইট লাইভ করার উপায়:</span>
            </div>
            <ol className="list-decimal list-inside text-[#182920]/85 space-y-2 pl-1 leading-relaxed">
              <li>
                <strong>ধাপ ১ (VS Code বা ফোল্ডারে পেস্ট করুন):</strong> ওপরের ফাইলগুলো ডাউনলোড করে আপনার প্রজেক্টের নির্দিষ্ট ফোল্ডারে (<code className="bg-white px-1 py-0.5 rounded border border-[#D5CEBF] font-mono text-[11px]">src/</code> ও <code className="bg-white px-1 py-0.5 rounded border border-[#D5CEBF] font-mono text-[11px]">public/</code>) রেখে দিন।
              </li>
              <li>
                <strong>ধাপ ২ (বিল্ড রান করুন):</strong> টার্মিনালে <code className="bg-white px-1.5 py-0.5 rounded border border-[#D5CEBF] font-mono text-[11px]">npm install</code> এবং <code className="bg-white px-1.5 py-0.5 rounded border border-[#D5CEBF] font-mono text-[11px]">npm run build</code> লিখুন। সাথে সাথে আপনার প্রস্তুত <code className="bg-white px-1 py-0.5 rounded border border-[#D5CEBF] font-mono text-[11px]">dist/</code> ফোল্ডার তৈরি হয়ে যাবে।
              </li>
              <li>
                <strong>ধাপ ৩ (লাইভ হোস্ট করুন):</strong> Vercel, Netlify বা Firebase-এ ড্র্যাগ করে দিলেই ১ মিনিটে আপনার ওয়েবসাইট সারা বিশ্ব থেকে লাইভ হয়ে যাবে!
              </li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#EAE2D5]/60 px-5 sm:px-7 py-3.5 border-t border-[#D5CEBF] flex flex-col sm:flex-row items-center justify-between gap-2 flex-shrink-0 text-xs">
          <span className="text-[#55695D] text-center sm:text-left">
            অফিশিয়াল স্টোর জিমেইল: <strong className="text-[#143628]">nskproject01@gmail.com</strong> | হেল্পলাইন: <strong>+91 8777855462</strong>
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#143628] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#1F4D3B] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
