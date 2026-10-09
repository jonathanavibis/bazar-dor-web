const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-12 py-6 px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-gray-600">
                {/* বাম সাইডে */}
                <div className="font-medium text-gray-800 text-center md:text-left">
                    বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
                </div>

                {/* ডান সাইডে */}
                <div className="text-gray-500 text-center md:text-right">
                    সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
                </div>
            </div>
        </footer>
    );
};

export default Footer;