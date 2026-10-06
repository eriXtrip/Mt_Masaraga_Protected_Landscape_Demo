import React, { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, FileText } from 'lucide-react';

const FILE_ICONS = {
    'application/pdf': '📄',
    'application/msword': '📝',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
    'application/vnd.ms-excel': '📊',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
    'application/zip': '🗜️',
    'text/plain': '📃',
};

export default function FilePicker({ label, file, accept, onDrop, onRemove }) {
    const inputRef = useRef(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer?.files?.[0];
        if (droppedFile) {
            onDrop?.(droppedFile);
        }
    }, [onDrop]);

    const handleFileChange = useCallback((e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            onDrop?.(selectedFile);
        }
    }, [onDrop]);

    const fileName = typeof file === 'string' ? file.split('/').pop() : file?.name;
    const fileSize = file?.size ? `${(file.size / 1024).toFixed(1)} KB` : null;
    const fileType = file?.type || '';
    const icon = FILE_ICONS[fileType] || '📁';

    if (fileName) {
        return (
            <div className="relative rounded-xl border border-outline-variant/20 bg-surface-container-low/50 p-3 group">
                <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-xl bg-surface-container-high flex items-center justify-center text-lg shrink-0">
                        {icon}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-on-surface truncate">{fileName}</p>
                        {fileSize && <p className="text-[10px] text-on-surface-variant">{fileSize}</p>}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
                        >
                            <Upload className="h-3.5 w-3.5" />
                        </button>
                        {onRemove && (
                            <button
                                type="button"
                                onClick={onRemove}
                                className="rounded-lg p-1.5 text-on-surface-variant hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        );
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors cursor-pointer ${
                isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container-high'
            }`}
        >
            <span className={`h-10 w-10 rounded-xl flex items-center justify-center ${isDragOver ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                <FileText className="h-5 w-5" />
            </span>
            <div className="text-center">
                <p className="text-xs font-semibold text-on-surface">
                    {isDragOver ? 'Drop file here' : 'Click or drag file'}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                    PDF, DOC, XLS, ZIP
                </p>
            </div>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
