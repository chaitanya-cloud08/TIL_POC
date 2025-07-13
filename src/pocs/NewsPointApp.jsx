import React, { useState, useEffect } from 'react';

const Icon = ({ path, className = "w-6 h-6", fill = true }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill={fill ? "currentColor" : "none"}>
        <path d={path} stroke={!fill ? "currentColor" : "none"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SignalIcon = () => <Icon className="w-4 h-4" path="M12 3c4.28 0 8.22 1.48 11.31 4.19L12 18.5 .69 7.19A19.863 19.863 0 0 1 12 3zm0 2c-3.59 0-6.9 1.23-9.6 3.4L12 16.22 21.6 8.4A17.832 17.832 0 0 0 12 5z" />;
const BarChartIcon = () => <Icon className="w-4 h-4" path="M3 12h2v9H3v-9zm16-4h2v13h-2V8zm-8-6h2v19h-2V2z" />;
const BatteryIcon = () => <Icon className="w-4 h-4" path="M17 4h-3V2h-4v2H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" />;
const AddIcon = () => <Icon fill={false} path="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />;
const SearchIcon = () => <Icon fill={false} path="M21 21l-4.343-4.343M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0z" />;
const NotificationIcon = () => <Icon fill={false} path="M20 17h2v2H2v-2h2v-7a8 8 0 1 1 16 0v7zM9 21h6v2H9v-2z" />;
const UserIcon = () => <Icon fill={false} path="M20 22h-2v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2H2v-2a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v2zm-4-9a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />;
const ArrowDownIcon = () => <Icon path="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" className="w-4 h-4" />;
const WhatsappIcon = () => <Icon className="w-7 h-7 text-[#25D366]" path="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z" />;
const MenuIcon = () => <Icon fill={false} className="w-5 h-5" path="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />;
const BookmarkIcon = () => <Icon fill={false} className="w-5 h-5" path="M5 2h14a1 1 0 0 1 1 1v18l-8-6-8 6V3a1 1 0 0 1 1-1zm2 2v13.587l6-4.5 6 4.5V4H7z" />;
const ShareIcon = () => <Icon fill={false} className="w-5 h-5" path="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.15-4.15c.52.47 1.2.77 1.96.77 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.83C7.52 9.36 6.81 9.03 6 9.03c-1.66 0-3 1.34-3 3s1.34 3 3 3c.81 0 1.52-.33 2.04-.83l7.15 4.15c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z" />;
const HomeIcon = () => <Icon path="M20 20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9H2L12 3l10 8h-2v9z" />;
const CompassIcon = () => <Icon fill={false} path="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3.5-7.5L12 8l3.5 3.5-3.5 3.5-3.5-3.5z" />;
const PlayCircleIcon = () => <Icon fill={false} path="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM10.622 8.415a.4.4 0 0 1 .632-.329l5.242 3.276a.4.4 0 0 1 0 .658l-5.242 3.276a.4.4 0 0 1-.632-.33V8.415z" />;
const GalleryIcon = () => <Icon fill={false} path="M2 5.5V18.5a1.5 1.5 0 0 0 1.5 1.5h17a1.5 1.5 0 0 0 1.5-1.5V5.5a1.5 1.5 0 0 0-1.5-1.5h-17A1.5 1.5 0 0 0 2 5.5zM4 6h16v10.5l-5.223-4.352a.5.5 0 0 0-.663-.053L11 14.5l-2.43-2.43a.5.5 0 0 0-.658-.044L4 15.5V6zM5 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />;
const EarthIcon = () => <Icon fill={false} path="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zM4.068 13h15.864a8.013 8.013 0 0 1-15.864 0zm0-2a8.013 8.013 0 0 1 15.864 0H4.068zM12 4.022a7.95 7.95 0 0 1 6.172 2.955H5.828A7.95 7.95 0 0 1 12 4.022zm-6.172 12.98a7.95 7.95 0 0 1 12.344 0H5.828z" />;
const CloseIcon = () => <Icon fill={false} className="w-6 h-6" path="M18.3 5.71a1 1 0 0 0-1.41-1.41L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.41L10.59 12l-4.89 4.89a1 1 0 0 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89z" />;
const ListIcon = () => <Icon path="M8 4h13v2H8V4zM4 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z" />;
const ChatIcon = () => <Icon fill={false} path="M14 3a1 1 0 0 1 1 1v1h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4V4a1 1 0 0 1 1-1h4zm-1 2H9v1h4V5zm2 2H5v10h14V7h-2v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V7z" />;
const ArticleIcon = () => <Icon fill={false} path="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zM5 4v16h14V4H5zm2 3h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />;
const LanguageModalIcon = () => (
    <svg className="w-6 h-6 text-gray-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.68331 16.3333L7.99998 7.66666L11.3166 16.3333M10.5166 14.5H5.48331M12.6666 8.4111L14.4933 13.0889C14.71 13.6261 14.8192 14.2023 14.8166 14.7833H19.1666M16.6666 8.5C17.1666 7.58333 18.0833 6.33333 18.9166 5.83333C19.25 5.625 19.5 6 19.3333 6.33333C18.8333 7.5 17.8333 9.16666 17.5 9.83333M2.83331 19.1667C2.83331 20.1269 3.60642 20.9 4.56665 20.9H19.4333C20.3935 20.9 21.1666 20.1269 21.1666 19.1667V4.83333C21.1666 3.8731 20.3935 3.1 19.4333 3.1H4.56665C3.60642 3.1 2.83331 3.8731 2.83331 4.83333V19.1667Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);



const BulletContent = () => (
    <ul className="list-none pl-1 space-y-3">
        {[
            "Zelensky accused Europe of funding Russia by buying its oil.",
            "He named Germany and Hungary for blocking oil embargoes.",
            "Russia could earn £250bn ($326bn) this year from energy sales."
        ].map((item, index) => (
            <li key={index} className="pl-5 relative text-[15px] leading-snug text-[#555555]">
                <span className="absolute left-0 top-0 text-[#E60023] text-xl leading-snug">•</span>
                {item}
            </li>
        ))}
    </ul>
);

const GenzContent = () => <p className="text-[15px] leading-relaxed text-[#333] italic">So, like, Zelensky went on BBC and was NOT having it. He basically said Europe is sending "blood money" to Russia by still buying their oil. He straight up called out Germany and Hungary for blocking a full-on oil ban. The tea is Russia's about to make a wild £250bn this year from energy. It's giving... complicated. No cap.</p>;
const SummaryContent = () => <p className="text-[15px] leading-relaxed text-[#555555]">In an interview with the BBC, Ukrainian President Volodymyr Zelensky stated that European nations continuing to purchase Russian oil are paying with "blood money." He specifically identified Germany and Hungary as countries hindering a complete oil embargo. Projections indicate Russia may earn as much as £250 billion ($326 billion) from its energy exports this year.</p>;
const LanguageContent = () => <p className="text-[15px] leading-relaxed text-[#555555]">Language selection is not implemented in this demo, but this is where it would go!</p>;

const NewsPointApp = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentFormat, setCurrentFormat] = useState('bullets');

    useEffect(() => {
        const timer = setTimeout(() => setIsModalVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleFormatChange = (format) => {
        setCurrentFormat(format);
        setTimeout(() => setIsModalVisible(false), 200);
    };

    const renderNewsContent = () => {
        switch (currentFormat) {
            case 'genz': return <GenzContent />;
            case 'summary': return <SummaryContent />;
            case 'language': return <LanguageContent />;
            default: return <BulletContent />;
        }
    };

    const formatOptionsData = [
        { key: 'bullets', title: '3 Bullets', desc: 'Three key points — straight to the point, no extras', icon: <ListIcon /> },
        { key: 'genz', title: 'Gen-Z Mode', desc: 'A fun mix of slang and attitude — but all facts, no cap.', icon: <ChatIcon /> },
        { key: 'summary', title: 'Summary', desc: 'A short and simple summary — just enough to get the gist.', icon: <ArticleIcon /> },
        { key: 'language', title: 'Language', desc: "Pick the language you're most comfy with — we've got options!", icon: <LanguageModalIcon /> }
    ];

    return (
        <div className='flex justify-center items-center scale-75 -mt-24'>
        <div className="w-full max-w-[414px] h-[896px] bg-white shadow-xl rounded-[20px] overflow-hidden relative flex flex-col font-['Inter',_sans-serif] text-[#111]">
            <div className="flex justify-between items-center px-5 py-2.5 text-sm font-semibold">
                <span>9:41</span>
                <div className="flex gap-1.5 items-center">
                    <SignalIcon />
                    <BarChartIcon />
                    <BatteryIcon />
                </div>
            </div>

            <header className="px-4 border-b border-[#e0e0e0]">
                <div className="flex justify-between items-center py-2.5">
                    <div className="flex items-center gap-5">
                        <div className="w-[30px] h-[30px] bg-[#E60023] rounded-md flex items-center justify-center text-white font-bold text-lg">
                            <img src="/image 13.png" alt="NP logo" />
                        </div>
                        <AddIcon />
                    </div>
                    <div className="flex items-center gap-5">
                        <SearchIcon />
                        <NotificationIcon />
                        <UserIcon />
                    </div>
                </div>
                <nav className="flex gap-5 pb-3">
                    <a href="#" className="text-[#E60023] text-base font-bold relative">
                        For You
                        <span className="absolute -bottom-3 left-0 w-full h-[3px] bg-[#E60023]"></span>
                    </a>
                    {["IPL", "Modi", "Trump", "Travel"].map(item => (
                        <a key={item} href="#" className="text-[#555555] text-base font-medium flex items-center gap-0.5">
                            {item} <ArrowDownIcon />
                        </a>
                    ))}
                </nav>
            </header>

            <main className="flex-grow overflow-y-auto bg-[#f0f2f5] p-4">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div className="relative">
                        <img src="/news.png" alt="Aircraft Carrier" className="w-full h-[220px] object-cover block" />
                        <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isModalVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}></div>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center gap-2.5 mb-3">
                            <img src="/toi.png" alt="TOI Logo" className="w-10 h-10 object-contain border border-gray-200" />
                            <div className="flex-grow">
                                <span className="block font-semibold text-[15px]">The Times Of India</span>
                                <span className="text-xs text-[#8e8e8e]">Mon 05 May 2025 14hrs</span>
                            </div>
                            <WhatsappIcon />
                        </div>
                        <h1 className="text-xl leading-tight font-bold mb-4">
                            Ukraine's President Zelensky to BBC: Blood money being paid for Russian oil
                        </h1>
                        <div className="min-h-[90px]">{renderNewsContent()}</div>
                        <div className="mt-5 pt-4 border-t border-[#e0e0e0] flex justify-between items-center">
                            <div className="flex gap-6 text-[#555555]">
                                <button onClick={() => setIsModalVisible(true)}><MenuIcon /></button>
                                <button><BookmarkIcon /></button>
                                <button><ShareIcon /></button>
                            </div>
                            <a href="#" className="font-semibold text-sm text-[#111] no-underline">Read Full Story</a>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="flex justify-around py-2 border-t border-[#e0e0e0] bg-white">
                <a href="#" className="flex flex-col items-center gap-1 no-underline text-[#E60023]"><HomeIcon /><span className="text-xs font-semibold">Home</span></a>
                <a href="#" className="flex flex-col items-center gap-1 no-underline text-[#8e8e8e]"><CompassIcon /><span className="text-xs">Discover</span></a>
                <a href="#" className="flex flex-col items-center gap-1 no-underline text-[#8e8e8e]"><PlayCircleIcon /><span className="text-xs">Video</span></a>
                <a href="#" className="flex flex-col items-center gap-1 no-underline text-[#8e8e8e]"><GalleryIcon /><span className="text-xs">Carousel</span></a>
                <a href="#" className="flex flex-col items-center gap-1 no-underline text-[#8e8e8e]"><EarthIcon /><span className="text-xs">Explore</span></a>
            </footer>

            <div className={`absolute inset-0 z-50 transition-opacity duration-500 flex flex-col-reverse ${isModalVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`bg-white rounded-t-2xl shadow-[-5px_0_20px_rgba(0,0,0,0.1)] relative transform transition-transform duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isModalVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <button onClick={() => setIsModalVisible(false)} className="w-10 h-10 rounded-full bg-white shadow-md flex justify-center items-center text-[#333]">
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="pt-10 px-5 pb-5 text-center">
                        <h2 className="text-2xl font-bold mb-2">Make news your vibe 👇</h2>
                        <p className="text-[#555555] mb-6">Pick your favorite format — we'll take care of the rest.</p>
                        <div className="flex flex-col gap-3.5 text-left">
                           {formatOptionsData.map(({ key, title, desc, icon }) => (
                               <div key={key} onClick={() => handleFormatChange(key)} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${currentFormat === key ? 'border-[#E60023] bg-[#feeceb]' : 'bg-[#f0f2f5] border-transparent'}`}>
                                 <div className="text-gray-800">{icon}</div>
                                 <div>
                                     <h3 className="text-base font-semibold mb-0.5">{title}</h3>
                                     <p className="text-sm text-[#555555] m-0">{desc}</p>
                                 </div>
                               </div>
                           ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default NewsPointApp;