import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getHistory, clearHistory, HistoryItem } from '@/lib/storage';
import { Player } from '@/components/Player';
import { Trash2, Download } from 'lucide-react';
import * as audioUtils from '@/lib/audioUtils';

const HistoryPage: NextPage = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleClear = () => {
        clearHistory();
        setHistory([]);
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <>
            <Head>
                <title>История обработок — NoiseGone</title>
            </Head>
            <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">История обработок</h1>
                    {history.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            aria-label="Очистить всю историю"
                        >
                            <Trash2 size={18} />
                            Очистить
                        </button>
                    )}
                </header>

                {history.length === 0 ? (
                    <div className="text-center py-16 px-6 bg-white rounded-lg shadow">
                        <p className="text-gray-500 mb-4">Ваша история пока пуста.</p>
                        <Link href="/" className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors">
                            Начать обработку
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {history.map((item) => (
                            <div key={item.id} className="p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-grow">
                                    <p className="font-semibold text-lg truncate">{item.fileName}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                                        <span><strong>Пресет:</strong> {item.preset}</span>
                                        <span><strong>Размер:</strong> {formatBytes(item.sizeBytes)}</span>
                                        <span><strong>Длительность:</strong> {item.durationSec.toFixed(1)}s</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(item.dateISO).toLocaleString()}</p>
                                </div>
                                <div className="flex-shrink-0">
                                     <a
                                        href={item.outputBlobUrl}
                                        download={audioUtils.createSafeFileName(item.fileName, item.preset)}
                                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors"
                                        >
                                        <Download size={18} />
                                        Скачать
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default HistoryPage;
