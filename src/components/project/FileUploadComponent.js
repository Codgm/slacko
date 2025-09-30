import React, { useState, useRef } from 'react';
import { 
  Upload, X, FileText, Image, FileVideo, 
  FileArchive, File, Check, AlertCircle,
  Trash2, Download, Eye
} from 'lucide-react';
import { useProjectContext } from '../../context/ProjectContext';

const FileUploadComponent = ({ 
  project, 
  onFilesUpdate,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'rar']
}) => {
  const { uploadFile, loading } = useProjectContext();
  const fileInputRef = useRef(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [files, setFiles] = useState(project?.files || []);
  const [error, setError] = useState('');

  // 파일 아이콘 매핑
  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return Image;
    if (fileType.includes('video')) return FileVideo;
    if (fileType.includes('archive') || fileType.includes('zip')) return FileArchive;
    if (fileType.includes('pdf') || fileType.includes('document')) return FileText;
    return File;
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 파일 유효성 검사
  const validateFile = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      return `허용되지 않는 파일 형식입니다. (${allowedTypes.join(', ')})`;
    }
    
    if (file.size > maxFileSize) {
      return `파일 크기가 너무 큽니다. (최대: ${formatFileSize(maxFileSize)})`;
    }
    
    return null;
  };

  // 파일 업로드 처리
  const handleFiles = async (fileList) => {
    const validFiles = [];
    const errors = [];

    Array.from(fileList).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    setError('');

    // 각 파일 업로드 처리
    for (const file of validFiles) {
      const fileId = `${Date.now()}-${file.name}`;
      
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      try {
        // 파일 데이터 준비
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedBy: 'Current User', // 실제로는 현재 사용자 정보
          uploadedAt: new Date().toISOString(),
          // Base64 인코딩 (실제 구현에서는 FormData 사용)
          content: await fileToBase64(file)
        };

        // 진행률 시뮬레이션
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileId] || 0;
            if (currentProgress < 90) {
              return { ...prev, [fileId]: currentProgress + 10 };
            }
            clearInterval(progressInterval);
            return prev;
          });
        }, 100);

        // 서버로 업로드
        const uploadedFile = await uploadFile(project.id, fileData);
        
        // 완료 표시
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        
        // 파일 목록 업데이트
        const newFiles = [...files, uploadedFile];
        setFiles(newFiles);
        onFilesUpdate?.(project.id, newFiles);

        // 진행률 초기화
        setTimeout(() => {
          setUploadProgress(prev => {
            const { [fileId]: _, ...rest } = prev;
            return rest;
          });
        }, 1000);

      } catch (error) {
        console.error('파일 업로드 실패:', error);
        setError(`${file.name} 업로드에 실패했습니다.`);
        setUploadProgress(prev => {
          const { [fileId]: _, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  // 파일을 Base64로 변환
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // 드래그 앤 드롭 이벤트
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFileDelete = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesUpdate?.(project.id, updatedFiles);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-slate-300 hover:border-slate-400 bg-slate-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center">
          <div className="p-4 bg-white rounded-full shadow-sm mb-4">
            <Upload className="w-8 h-8 text-slate-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            파일을 드래그하거나 클릭하여 업로드
          </h3>
          
          <p className="text-sm text-slate-600 mb-4">
            최대 {formatFileSize(maxFileSize)} | 지원 형식: {allowedTypes.slice(0, 5).join(', ')}
            {allowedTypes.length > 5 && ` 외 ${allowedTypes.length - 5}개`}
          </p>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            파일 선택
          </button>
        </div>

        {dragActive && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-xl flex items-center justify-center">
            <div className="text-blue-600 font-semibold">파일을 놓아주세요</div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-700 whitespace-pre-line">{error}</div>
          <button 
            onClick={() => setError('')}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-3">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {fileId.split('-').slice(1).join('-')}
                </span>
                <span className="text-sm text-slate-600">{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-900">업로드된 파일 ({files.length})</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map(file => {
              const FileIcon = getFileIcon(file.type);
              
              return (
                <div key={file.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0">
                        <FileIcon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-semibold text-slate-900 truncate">{file.name}</h5>
                        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => {/* 파일 보기 */}}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {/* 파일 다운로드 */}}
                        className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="다운로드"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFileDelete(file.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-500 space-y-1">
                    <div>업로드: {file.uploadedBy}</div>
                    <div>{new Date(file.uploadedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;