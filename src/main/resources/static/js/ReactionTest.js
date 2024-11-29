// 전역 변수 설정
const API_BASE_URL = '/api';
let stage = 'waiting';
let startTime = null;
let reactionTimes = [];
let timeoutId = null;
let rankings = [];
let showNameInput = false;
let playerName = '';
let isSubmitting = false;
const MAX_TESTS = 5;
let isSubmitted = false;

// DOM 요소 생성 및 스타일링 함수
function getBackgroundColor() {
    switch (stage) {
        case 'waiting':
            return 'bg-slate-300';
        case 'ready':
            return 'bg-rose-200';
        case 'testing':
            return 'bg-emerald-200';
        case 'finished':
            return 'bg-sky-200';
        default:
            return 'bg-slate-300';
    }
}

function getTextColor() {
    switch (stage) {
        case 'waiting':
            return 'text-slate-700';
        case 'ready':
            return 'text-rose-700';
        case 'testing':
            return 'text-emerald-700';
        case 'finished':
            return 'text-sky-700';
        default:
            return 'text-slate-700';
    }
}

function getMessage() {
    switch (stage) {
        case 'waiting':
            return `테스트 ${reactionTimes.length + 1}/5\n클릭하여 시작하세요`;
        case 'ready':
            return '초록색이 되면 클릭하세요!';
        case 'testing':
            return '지금 클릭하세요!';
        case 'finished':
            return '테스트 완료!';
        default:
            return '';
    }
}

function calculateAverage() {
    if (reactionTimes.length === 0) return 0;
    const sum = reactionTimes.reduce((acc, time) => acc + time, 0);
    return Math.round(sum / reactionTimes.length);
}

// 랭킹 데이터 가져오기
async function fetchRankings() {
    try {
        const response = await fetch(`${API_BASE_URL}/rankings`);
        if (!response.ok) throw new Error('랭킹 데이터를 불러오는데 실패했습니다.');
        const data = await response.json();
        rankings = data;
        renderApp();
    } catch (error) {
        console.error('Error fetching rankings:', error);
    }
}

// 앱 초기화
function resetTest() {
    reactionTimes = [];
    stage = 'waiting';
    showNameInput = false;
    playerName = '';
    isSubmitted = false;  // isSubmitted 초기화
    renderApp();
}

// 랭킹 등록
async function handleSubmitRanking() {
    if (!playerName.trim() || isSubmitted) return;
    isSubmitting = true;
    renderApp();

    try {
        const response = await fetch(`${API_BASE_URL}/rankings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: playerName.trim(),
                reactionTime: calculateAverage()
            }),
        });

        if (!response.ok) throw new Error('랭킹 등록에 실패했습니다.');
        await fetchRankings();
        showNameInput = false;
        isSubmitted = true;  // 등록 성공 시 isSubmitted를 true로 설정
    } catch (error) {
        console.error('Error submitting ranking:', error);
    } finally {
        isSubmitting = false;
        renderApp();
    }
}

// 클릭 핸들러
function handleClick() {
    if (stage === 'waiting') {
        stage = 'ready';
        timeoutId = setTimeout(() => {
            stage = 'testing';
            startTime = Date.now();
            renderApp();
        }, 2000 + Math.floor(Math.random() * 3000));
    } else if (stage === 'ready') {
        clearTimeout(timeoutId);
        stage = 'waiting';
    } else if (stage === 'testing') {
        const endTime = Date.now();
        const reactionTime = endTime - startTime;
        reactionTimes.push(reactionTime);

        if (reactionTimes.length === MAX_TESTS) {
            stage = 'finished';
        } else {
            stage = 'waiting';
        }
    }
    renderApp();
}

// 키보드 이벤트 핸들러
function handleKeyPress(event) {
    if (event.code === 'Space') {
        handleClick();
    }
}

function handleNameInput(value) {
    playerName = value;
    const submitButton = document.querySelector('#submitRankingButton');
    if (submitButton) {
        submitButton.disabled = !value.trim();
    }
}

// UI 렌더링
function renderApp() {
    const root = document.getElementById('root');
    const backgroundColor = getBackgroundColor();
    const textColor = getTextColor();

    let finishedContent = '';
    if (stage === 'finished') {
        const buttons = !showNameInput && !isSubmitted ? `
            <div class="space-x-4">
                <button onclick="resetTest()" class="bg-white text-sky-600 font-bold py-2 px-4 rounded-lg hover:bg-sky-50 transition-colors border border-sky-200">
                    다시 시작하기
                </button>
                <button onclick="showNameInput = true; renderApp()" class="bg-white text-emerald-600 font-bold py-2 px-4 rounded-lg hover:bg-emerald-50 transition-colors border border-emerald-200">
                    랭킹 등록하기
                </button>
            </div>
        ` : !isSubmitted ? `
            <div class="flex flex-col items-center space-y-4">
                <input
                    type="text"
                    value="${playerName}"
                    oninput="handleNameInput(this.value)"
                    placeholder="이름을 입력하세요"
                    class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    maxlength="10"
                />
                <div class="space-x-4">
                    <button
                        id="submitRankingButton"
                        onclick="handleSubmitRanking()"
                        ${isSubmitting || !playerName.trim() ? 'disabled' : ''}
                        class="bg-white text-emerald-600 font-bold py-2 px-4 rounded-lg hover:bg-emerald-50 transition-colors border border-emerald-200 disabled:opacity-50"
                    >
                        ${isSubmitting ? '등록 중...' : '등록하기'}
                    </button>
                    <button
                        onclick="showNameInput = false; renderApp()"
                        class="bg-white text-gray-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                        취소
                    </button>
                </div>
            </div>
        ` : `
            <button onclick="resetTest()" class="bg-white text-sky-600 font-bold py-2 px-4 rounded-lg hover:bg-sky-50 transition-colors border border-sky-200">
                다시 시작하기
            </button>
        `;

        finishedContent = `
            <div class="flex flex-col items-center mt-6">
                <div class="text-2xl font-bold mb-4 ${textColor}">
                    평균 반응 시간: ${calculateAverage()}ms
                </div>
                ${buttons}
            </div>
        `;
    }

    let rankingContent = '';
    if (stage === 'finished' && rankings.length > 0) {
        rankingContent = `
            <div class="absolute right-8 top-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 class="text-xl font-bold mb-4 text-gray-800">🏆 TOP 10 랭킹</h2>
                <div class="space-y-2">
                    ${rankings.map((rank, index) => `
                        <div class="flex justify-between items-center py-2 border-b last:border-b-0">
                            <div class="flex items-center">
                                <span class="font-bold text-lg w-8 text-gray-500">${index + 1}.</span>
                                <span class="font-medium">${rank.name}</span>
                            </div>
                            <div class="text-right">
                                <span class="font-bold text-gray-700">${rank.reactionTime}ms</span>
                                <div class="text-xs text-gray-500">
                                    ${new Date(rank.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    root.innerHTML = `
        <div class="h-screen flex flex-col items-center justify-center relative">
            <div class="w-full h-full flex flex-col items-center justify-center cursor-pointer ${backgroundColor}" 
                 ${stage !== 'finished' ? 'onclick="handleClick()"' : ''}>
                <div class="text-2xl font-bold mb-4 text-center ${textColor}">
                    ${getMessage()}
                </div>
                
                ${reactionTimes.length > 0 ? `
                    <div class="text-xl mt-4 ${textColor}">
                        ${reactionTimes.map((time, index) => `
                            <div class="mb-1">
                                ${index + 1}번째 시도: ${time}ms
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${finishedContent}
            </div>
            ${rankingContent}
        </div>
    `;
}

// 이벤트 리스너 등록 및 초기 렌더링
document.addEventListener('keydown', handleKeyPress);
fetchRankings();
renderApp();