import { useState } from 'react';
import { Upload, X, FileBox, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export default function NewProjectModal({ isOpen, onClose }) {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const { createAndUploadProject } = useAppStore();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !file) {
            setError('Please provide a name and select a CAD file.');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            await createAndUploadProject(name, file);
            setName('');
            setFile(null);
            onClose();
            navigate('/cad-viewer'); // Auto-redirect to the CAD viewer
        } catch (err) {
            setError('Failed to upload project. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-5 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <FileBox className="w-5 h-5 text-blue-600" />
                        Upload New CAD Model
                    </h3>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Project Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Engine Bracket V2"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">CAD File (.STEP, .STL, .IGES)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                                <div className="flex text-sm text-slate-600 justify-center">
                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                        <span>Upload a file</span>
                                        <input
                                            type="file"
                                            className="sr-only"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            accept=".step,.stp,.stl,.iges,.igs"
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-slate-500">
                                    {file ? <span className="font-bold text-emerald-600">{file.name}</span> : "or drag and drop up to 50MB"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-sm text-rose-500 bg-rose-50 p-2 rounded">{error}</p>}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 transition-colors"
                        >
                            {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : 'Save & Initialize Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}   