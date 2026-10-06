import React, { useState, useRef, useCallback } from 'react';
import { Upload, Trash2 } from 'lucide-react';

export default function ImageDropZone({ label, image, onDrop, onRemove }) {
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
        const file = e.dataTransfer?.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onDrop?.(file);
        }
    }, [onDrop]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            onDrop?.(file);
        }
    }, [onDrop]);

    const imageSrc = typeof image === 'string' ? image : image?.src;
    const imageAlt = typeof image === 'string' ? image : image?.alt || label;

    if (imageSrc) {
        return (
            <div className="relative rounded-xl border border-outline-variant/20 overflow-hidden group">
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-inverse-surface/0 group-hover:bg-inverse-surface/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="rounded-lg bg-white/90 p-2 text-on-surface hover:bg-white transition-colors cursor-pointer"
                    >
                        <Upload className="h-4 w-4" />
                    </button>
                    {onRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="rounded-lg bg-red-500/90 p-2 text-white hover:bg-red-500 transition-colors cursor-pointer"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
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
                <Upload className="h-5 w-5" />
            </span>
            <div className="text-center">
                <p className="text-xs font-semibold text-on-surface">
                    {isDragOver ? 'Drop image here' : 'Click or drag image'}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                    PNG, JPG up to 5MB
                </p>
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
