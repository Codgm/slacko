import { useState } from 'react';
import { BookOpen, Brain, Target, FileText, Plus } from 'lucide-react';

const ConceptStudyComponent = () => {
    const [conceptMode, setConceptMode] = useState('overview');
    const [showConceptModal, setShowConceptModal] = useState(false);
    const [selectedConcept, setSelectedConcept] = useState(null);

    // 샘플 개념 데이터 (챕터별 구성)
    const concepts = [
        {
            id: 1,
            title: 'Process Control Block',
            description: '프로세스 관리 핵심 데이터 구조',
            pages: 'p.95-97',
            status: 'studying',
            chapter: 'Chapter 3. 프로세스 관리',
            lastStudied: '2024-01-15',
            myNotes: {
                summary: 'PCB는 각 프로세스의 정보를 담고 있는 자료구조. 프로세스 상태, PID, 메모리 정보 등을 포함.',
                keyPoints: ['Process ID (PID)', 'Process State', 'Program Counter', 'CPU 레지스터'],
                personalThoughts: '컨텍스트 스위칭 시 PCB가 핵심 역할을 한다는 점이 중요!'
            }
        },
        {
            id: 2,
            title: 'Context Switching',
            description: 'CPU 프로세스 전환 메커니즘',
            pages: 'p.98-102',
            status: 'completed',
            chapter: 'Chapter 3. 프로세스 관리',
            lastStudied: '2024-01-14',
            myNotes: {
                summary: 'CPU가 한 프로세스에서 다른 프로세스로 전환하는 과정. PCB 저장/복원이 핵심.',
                keyPoints: ['PCB 저장', 'PCB 복원', '시간 오버헤드', '프로세스 스케줄링'],
                personalThoughts: '오버헤드가 크니까 최적화가 중요하겠다. 스레드를 쓰는 이유가 여기에!'
            }
        },
        {
            id: 3,
            title: 'Thread Pool',
            description: '스레드 풀 관리 기법',
            pages: 'p.145-148',
            status: 'not_started',
            chapter: 'Chapter 4. 스레드',
            lastStudied: null,
            myNotes: null
        },
        {
            id: 4,
            title: 'Mutex vs Semaphore',
            description: '동기화 메커니즘 비교',
            pages: 'p.201-205',
            status: 'studying',
            chapter: 'Chapter 6. 동기화',
            lastStudied: '2024-01-16',
            myNotes: {
                summary: 'Mutex는 1개 자원, Semaphore는 N개 자원 관리. 둘 다 상호배제 구현.',
                keyPoints: ['Binary Semaphore = Mutex', 'Counting Semaphore', 'Lock/Unlock', 'Wait/Signal'],
                personalThoughts: '코드로 직접 구현해보면서 이해하는게 좋을 것 같다.'
            }
        },
        {
            id: 5,
            title: 'Deadlock Prevention',
            description: '교착상태 예방 기법',
            pages: 'p.220-225',
            status: 'not_started',
            chapter: 'Chapter 6. 동기화',
            lastStudied: null,
            myNotes: null
        }
    ];

    // 전체 통계 계산
    const totalConcepts = concepts.length;
    const completedConcepts = concepts.filter(c => c.status === 'completed').length;
    const studyingConcepts = concepts.filter(c => c.status === 'studying').length;
    const overallProgress = Math.round((completedConcepts / totalConcepts) * 100);

    const renderConceptList = () => {
        // 챕터별로 개념들 그룹화
        const conceptsByChapter = concepts.reduce((acc, concept) => {
            const chapter = concept.chapter;
            if (!acc[chapter]) {
                acc[chapter] = [];
            }
            acc[chapter].push(concept);
            return acc;
        }, {});

        // 챕터별 완료율 계산
        const getChapterProgress = (chapterConcepts) => {
            const completed = chapterConcepts.filter(c => c.status === 'completed').length;
            const total = chapterConcepts.length;
            return { completed, total, percentage: Math.round((completed / total) * 100) };
        };

        const getStatusInfo = (status) => {
            switch(status) {
                case 'completed':
                    return { label: '완료', className: 'bg-green-100 text-green-800' };
                case 'studying':
                    return { label: '학습중', className: 'bg-blue-100 text-blue-800' };
                default:
                    return { label: '미시작', className: 'bg-gray-100 text-gray-600' };
            }
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">📋 개념 목록</h3>
                    <div className="text-sm text-gray-500">
                        총 {concepts.length}개 개념 | {concepts.filter(c => c.status === 'completed').length}개 완료
                    </div>
                </div>
                {Object.entries(conceptsByChapter).map(([chapter, chapterConcepts]) => {
                    const progress = getChapterProgress(chapterConcepts);
                    return (
                        <div key={chapter} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-900">{chapter}</h4>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-600">
                                            {progress.completed}/{progress.total} 완료
                                        </span>
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${progress.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-blue-600">{progress.percentage}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                {chapterConcepts.map((concept) => {
                                    const statusInfo = getStatusInfo(concept.status);
                                    return (
                                        <div key={concept.id} className="bg-gray-50 rounded-lg p-5 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h5 className="font-semibold text-gray-900">{concept.title}</h5>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
                                                            {statusInfo.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{concept.description}</p>
                                                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                                                        <span>{concept.pages}</span>
                                                        {concept.lastStudied && (
                                                            <span>마지막 학습: {concept.lastStudied}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2 ml-4">
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedConcept(concept);
                                                            setConceptMode('cornell');
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2 py-1 rounded"
                                                    >
                                                        코넬노트
                                                    </button>
                                                    <button className="text-gray-600 hover:text-gray-800 text-xs">편집</button>
                                                </div>
                                            </div>
                                            {concept.myNotes ? (
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <div className="mb-3">
                                                        <h6 className="text-sm font-medium text-gray-700 mb-1">📝 내 정리</h6>
                                                        <p className="text-sm text-gray-600 leading-relaxed">{concept.myNotes.summary}</p>
                                                    </div>
                                                    {concept.myNotes.keyPoints && (
                                                        <div className="mb-3">
                                                            <h6 className="text-sm font-medium text-gray-700 mb-2">🔑 핵심 키워드</h6>
                                                            <div className="flex flex-wrap gap-1">
                                                                {concept.myNotes.keyPoints.map((point, index) => (
                                                                    <span key={index} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">
                                                                        {point}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {concept.myNotes.personalThoughts && (
                                                        <div className="bg-yellow-50 border-l-3 border-yellow-400 p-3 rounded">
                                                            <h6 className="text-sm font-medium text-yellow-800 mb-1">💡 개인적 생각</h6>
                                                            <p className="text-sm text-yellow-700 italic">{concept.myNotes.personalThoughts}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-white rounded-lg p-4 border border-gray-200 border-dashed">
                                                    <div className="text-center text-gray-400">
                                                        <p className="text-sm">아직 정리된 내용이 없습니다.</p>
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedConcept(concept);
                                                                setConceptMode('cornell');
                                                            }}
                                                            className="text-blue-500 hover:text-blue-700 text-sm mt-1"
                                                        >
                                                            지금 정리하기 →
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderConceptMindMap = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">🧠 마인드맵</h3>
            <div className="bg-gray-50 rounded-lg p-8 min-h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>마인드맵 뷰는 준비 중입니다.</p>
                </div>
            </div>
        </div>
    );

    const renderCornellNotes = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">📝 코넬노트</h3>
            {selectedConcept ? (
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-4 min-h-96">
                        <div className="lg:col-span-1 bg-blue-50 p-4 border-r border-gray-200">
                            <h4 className="font-semibold text-blue-900 mb-3">📌 핵심 질문</h4>
                            <div className="space-y-3">
                                {selectedConcept.myNotes?.keyPoints ? (
                                    selectedConcept.myNotes.keyPoints.map((point, index) => (
                                        <div key={index} className="text-sm text-blue-800">• {point}란?</div>
                                    ))
                                ) : (
                                    <>
                                        <div className="text-sm text-blue-800">• 이 개념의 정의는?</div>
                                        <div className="text-sm text-blue-800">• 핵심 특징은?</div>
                                        <div className="text-sm text-blue-800">• 왜 중요한가?</div>
                                        <div className="text-sm text-blue-800">• 다른 개념과의 관계는?</div>
                                    </>
                                )}
                            </div>
                            <div className="mt-4 pt-3 border-t border-blue-200">
                                <textarea 
                                    placeholder="추가 질문을 작성하세요..."
                                    className="w-full text-xs bg-white border border-blue-200 rounded p-2 resize-none"
                                    rows="3"
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-3 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900">{selectedConcept.title}</h4>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <span>{selectedConcept.pages}</span>
                                    {selectedConcept.lastStudied && (
                                        <span>• 마지막 수정: {selectedConcept.lastStudied}</span>
                                    )}
                                </div>
                            </div>
                            <div className="prose prose-sm max-w-none">
                                {selectedConcept.myNotes ? (
                                    <div className="space-y-4">
                                        <div>
                                            <h5 className="font-medium text-gray-800 mb-2">개요</h5>
                                            <p className="text-gray-700 leading-relaxed">{selectedConcept.myNotes.summary}</p>
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-gray-800 mb-2">상세 내용</h5>
                                            <textarea 
                                                className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none"
                                                rows="8"
                                                placeholder="상세한 설명, 예제, 코드 등을 작성하세요..."
                                                defaultValue="이 개념에 대한 더 자세한 설명을 여기에 작성할 수 있습니다..."
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400 py-8">
                                        <p className="mb-4">아직 작성된 노트가 없습니다.</p>
                                        <textarea 
                                            className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none"
                                            rows="10"
                                            placeholder="이 개념에 대해 학습한 내용을 정리해보세요..."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <h4 className="font-semibold text-gray-900 mb-3">💡 핵심 요약 & 개인적 생각</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <h5 className="font-medium text-gray-700 mb-2">핵심 요약</h5>
                                {selectedConcept.myNotes?.summary ? (
                                    <p className="text-sm text-gray-700 bg-white p-3 rounded border">{selectedConcept.myNotes.summary}</p>
                                ) : (
                                    <textarea 
                                        className="w-full text-sm bg-white border border-gray-200 rounded p-3 resize-none"
                                        rows="3"
                                        placeholder="이 개념의 핵심을 3줄로 요약해보세요..."
                                    />
                                )}
                            </div>
                            <div>
                                <h5 className="font-medium text-gray-700 mb-2">개인적 생각</h5>
                                {selectedConcept.myNotes?.personalThoughts ? (
                                    <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded border italic">{selectedConcept.myNotes.personalThoughts}</p>
                                ) : (
                                    <textarea 
                                        className="w-full text-sm bg-yellow-50 border border-yellow-200 rounded p-3 resize-none"
                                        rows="3"
                                        placeholder="이 개념에 대한 개인적인 생각이나 느낀점을 적어보세요..."
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>개념을 선택하여 코넬노트를 확인하세요.</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                    { id: 'overview', label: '개요', icon: BookOpen },
                    { id: 'concepts', label: '개념 목록', icon: Brain },
                    { id: 'mindmap', label: '마인드맵', icon: Target },
                    { id: 'cornell', label: '코넬노트', icon: FileText }
                ].map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => setConceptMode(mode.id)}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                            conceptMode === mode.id
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <mode.icon className="w-4 h-4 mr-1" />
                        {mode.label}
                    </button>
                ))}
            </div>
            {conceptMode === 'overview' && (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-900">📚 학습 현황</h3>
                                <div className="flex items-center space-x-4 mt-1">
                                    <span className="text-sm text-blue-700">총 {totalConcepts}개</span>
                                    <span className="text-sm text-green-700">완료 {completedConcepts}개</span>
                                    <span className="text-sm text-orange-700">학습중 {studyingConcepts}개</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-16 bg-blue-200 rounded-full h-1.5">
                                            <div 
                                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                                style={{ width: `${overallProgress}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-medium text-blue-600">{overallProgress}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-900">🔥 3일</div>
                                <div className="text-xs text-blue-700">연속 학습</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 mt-4">
                            {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                                <div key={day} className="text-center">
                                    <div className="text-xs text-gray-600 mb-1">{day}</div>
                                    <div className={`h-8 rounded ${index < 5 ? 'bg-green-200' : index === 5 ? 'bg-blue-200' : 'bg-gray-200'}`}>
                                        <div className={`h-full rounded transition-all ${
                                            index < 3 ? 'bg-green-500' : index === 3 ? 'bg-blue-500' : ''
                                        }`} style={{ height: `${[80, 60, 90, 40, 0, 0, 0][index]}%` }}></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{[4, 3, 5, 2, 0, 0, 0][index]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-5 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 오늘 할 일</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <div>
                                            <div className="font-medium text-gray-900">Context Switching 복습</div>
                                            <div className="text-sm text-gray-600">3일 전 학습 · 복습 권장</div>
                                        </div>
                                    </div>
                                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">시작</button>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <div>
                                            <div className="font-medium text-gray-900">Thread Pool 정리하기</div>
                                            <div className="text-sm text-gray-600">아직 노트 작성 안함</div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setSelectedConcept(concepts[2]);
                                            setConceptMode('cornell');
                                        }}
                                        className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                                    >
                                        작성
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <div className="font-medium text-gray-900">Deadlock Prevention 학습</div>
                                            <div className="text-sm text-gray-600">다음 챕터 예습</div>
                                        </div>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">시작</button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 학습 인사이트</h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-purple-900">최고 집중 시간</span>
                                    </div>
                                    <p className="text-sm text-purple-700">화요일 오후 2-4시에 가장 활발하게 학습해요!</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-green-900">학습 패턴</span>
                                    </div>
                                    <p className="text-sm text-green-700">동기화 관련 개념에 특히 관심이 많으시네요.</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-orange-900">추천</span>
                                    </div>
                                    <p className="text-sm text-orange-700">PCB → Context Switching 순서로 복습하면 효과적일 거예요!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-5 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">⏰ 최근 학습</h3>
                            <div className="space-y-3">
                                {concepts.filter(c => c.lastStudied).slice(0, 3).map((concept) => (
                                    <div key={concept.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <div>
                                            <div className="font-medium text-gray-900 text-sm">{concept.title}</div>
                                            <div className="text-xs text-gray-500">{concept.lastStudied}</div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setSelectedConcept(concept);
                                                setConceptMode('cornell');
                                            }}
                                            className="text-blue-600 hover:text-blue-800 text-xs"
                                        >
                                            이어하기
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔖 즐겨찾기</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    <div>
                                        <div className="font-medium text-gray-900 text-sm">Process Control Block</div>
                                        <div className="text-xs text-gray-500">자주 참조하는 개념</div>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-800 text-xs">보기</button>
                                </div>
                                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    <div>
                                        <div className="font-medium text-gray-900 text-sm">Context Switching</div>
                                        <div className="text-xs text-gray-500">완료한 개념</div>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-800 text-xs">보기</button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">💭 최근 생각</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-yellow-50 rounded-lg border-l-3 border-yellow-400">
                                    <p className="text-sm text-gray-700 italic">"오버헤드가 크니까 최적화가 중요하겠다..."</p>
                                    <div className="text-xs text-gray-500 mt-1">Context Switching</div>
                                </div>
                                <div className="p-3 bg-yellow-50 rounded-lg border-l-3 border-yellow-400">
                                    <p className="text-sm text-gray-700 italic">"코드로 직접 구현해보면서 이해하는게 좋을 것 같다."</p>
                                    <div className="text-xs text-gray-500 mt-1">Mutex vs Semaphore</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">🎯 핵심 키워드</h3>
                            <button 
                                onClick={() => setShowConceptModal(true)}
                                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                개념 추가
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['Process Control Block', 'Context Switching', 'Thread Pool', 'Mutex', 'Semaphore', 'Deadlock', 'Synchronization', 'Process Management'].map((keyword) => (
                                <span key={keyword} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition-colors">
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {conceptMode === 'concepts' && renderConceptList()}
            {conceptMode === 'mindmap' && renderConceptMindMap()}
            {conceptMode === 'cornell' && renderCornellNotes()}
            {showConceptModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">새 개념 추가</h3>
                        <p className="text-gray-600 mb-4">개념 추가 기능은 구현 예정입니다.</p>
                        <button 
                            onClick={() => setShowConceptModal(false)}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConceptStudyComponent;
