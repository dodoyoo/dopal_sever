// TypeScript를 고려한 전역 변수 타입 정의를 위한 JSDoc 주석
/**
 * @typedef {Object} Message
 * @property {string} sender - 메시지 발신자 ('user' 또는 'assistant')
 * @property {string} content - 메시지 내용
 * @property {number} timestamp - 메시지 생성 시간
 */

/**
 * @type {Message[]}
 */
let messageHistory = [];

/**
 * @type {boolean}
 */
let isTyping = false;

/**
 * 사이드바 토글 함수
 * @returns {void}
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}

/**
 * 새 채팅 시작 함수
 * @returns {void}
 */
function startNewChat() {
  const chatList = document.getElementById('chatList');
  if (!chatList) return;

  const newChatItem = document.createElement('div');
  newChatItem.className = 'chat-item';
  newChatItem.innerHTML = '<span class="chat-item-text">새 채팅</span>';
  newChatItem.onclick = () => selectChat(newChatItem);

  // 기존 active 클래스 제거
  chatList.querySelectorAll('.chat-item').forEach((item) => {
    item.classList.remove('active');
  });

  // 새 채팅을 활성화하고 목록 맨 위에 추가
  newChatItem.classList.add('active');
  chatList.insertBefore(newChatItem, chatList.firstChild);

  // 채팅 영역 초기화
  clearChat();
}

/**
 * 채팅 선택 함수
 * @param {HTMLElement} element - 선택된 채팅 아이템 요소
 * @returns {void}
 */
function selectChat(element) {
  // 모든 채팅 아이템의 active 클래스 제거
  document.querySelectorAll('.chat-item').forEach((item) => {
    item.classList.remove('active');
  });

  // 선택된 채팅 아이템에 active 클래스 추가
  element.classList.add('active');

  // 여기서 선택된 채팅의 메시지 히스토리를 로드할 수 있습니다
  // loadChatHistory(element);
}

/**
 * 채팅 영역 초기화 함수
 * @returns {void}
 */
function clearChat() {
  const chatArea = document.getElementById('chatArea');
  if (!chatArea) return;

  chatArea.innerHTML = `
        <div class="message assistant-message">
            <div class="message-avatar">AI</div>
            <div class="message-content">
                안녕하세요! 무엇을 도와드릴까요? 궁금한 것이 있으시면 언제든지 질문해 주세요.
            </div>
        </div>
    `;
  messageHistory = [];
}

/**
 * 텍스트 영역 자동 리사이즈 함수
 * @param {HTMLTextAreaElement} textarea - 리사이즈할 텍스트 영역
 * @returns {void}
 */
function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

/**
 * 키 입력 처리 함수
 * @param {KeyboardEvent} event - 키보드 이벤트
 * @returns {void}
 */
function handleKeyDown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

/**
 * 메시지 전송 함수
 * @returns {void}
 */
function sendMessage() {
  const input = document.getElementById('messageInput');
  if (!input || !(input instanceof HTMLTextAreaElement)) return;

  const message = input.value.trim();

  if (!message || isTyping) return;

  // 사용자 메시지 추가
  addMessage(message, 'user');
  input.value = '';
  input.style.height = 'auto';

  // 채팅 제목 업데이트 (첫 번째 메시지인 경우)
  updateChatTitle(message);

  // AI 응답 시뮬레이션
  simulateAIResponse(message);
}

/**
 * 메시지 추가 함수
 * @param {string} content - 메시지 내용
 * @param {string} sender - 발신자 ('user' 또는 'assistant')
 * @returns {void}
 */
function addMessage(content, sender) {
  const chatArea = document.getElementById('chatArea');
  if (!chatArea) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;

  const avatar = sender === 'user' ? 'U' : 'AI';
  messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">${escapeHtml(content)}</div>
    `;

  chatArea.appendChild(messageDiv);
  chatArea.scrollTop = chatArea.scrollHeight;

  // 메시지 히스토리에 추가
  messageHistory.push({
    sender,
    content,
    timestamp: Date.now(),
  });
}

/**
 * 타이핑 인디케이터 추가 함수
 * @returns {void}
 */
function addTypingIndicator() {
  const chatArea = document.getElementById('chatArea');
  if (!chatArea) return;

  const typingDiv = document.createElement('div');
  typingDiv.className = 'message assistant-message';
  typingDiv.id = 'typing-indicator';
  typingDiv.innerHTML = `
        <div class="message-avatar">AI</div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;

  chatArea.appendChild(typingDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

/**
 * 타이핑 인디케이터 제거 함수
 * @returns {void}
 */
function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

/**
 * AI 응답 시뮬레이션 함수
 * @param {string} userMessage - 사용자 메시지
 * @returns {void}
 */
function simulateAIResponse(userMessage) {
  isTyping = true;
  addTypingIndicator();

  // 실제 API 호출을 위한 주석 처리된 코드
  // callYourAPI(userMessage);

  // 데모용 응답 지연
  setTimeout(() => {
    removeTypingIndicator();

    const response = generateDemoResponse(userMessage);
    addMessage(response, 'assistant');
    isTyping = false;
  }, 1000 + Math.random() * 2000);
}

/**
 * 데모 응답 생성 함수
 * @param {string} userMessage - 사용자 메시지
 * @returns {string} 생성된 응답
 */
function generateDemoResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('안녕')) {
    return '안녕하세요! 어떤 도움이 필요하신가요?';
  } else if (
    lowerMessage.includes('코딩') ||
    lowerMessage.includes('프로그래밍')
  ) {
    return '프로그래밍에 관해 궁금한 것이 있으시군요! 어떤 언어나 기술에 대해 알고 싶으신가요?';
  } else if (lowerMessage.includes('날씨')) {
    return '죄송하지만 현재 날씨 정보를 실시간으로 제공할 수 없습니다. 날씨 API를 연결하시면 실제 날씨 정보를 제공할 수 있습니다.';
  } else if (lowerMessage.includes('도움')) {
    return '물론입니다! 무엇을 도와드릴까요? 저는 다양한 주제에 대해 도움을 드릴 수 있습니다.';
  } else {
    return '죄송하지만 현재 데모 모드입니다. 실제 API가 연결되면 적절한 응답을 제공할 수 있습니다.';
  }
}

/**
 * 채팅 제목 업데이트 함수
 * @param {string} message - 첫 번째 메시지
 * @returns {void}
 */
function updateChatTitle(message) {
  const activeChat = document.querySelector(
    '.chat-item.active .chat-item-text'
  );
  if (activeChat && activeChat.textContent === '새 채팅') {
    const title =
      message.length > 30 ? message.substring(0, 30) + '...' : message;
    activeChat.textContent = title;
  }
}

/**
 * HTML 이스케이프 함수
 * @param {string} text - 이스케이프할 텍스트
 * @returns {string} 이스케이프된 텍스트
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, function (match) {
    return map[match];
  });
}

/**
 * 실제 API 호출 함수 (예시)
 * TypeScript 사용시 async/await와 타입 정의를 활용할 수 있습니다
 * @param {string} message - 전송할 메시지
 * @returns {Promise<void>}
 */
async function callYourAPI(message) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        history: messageHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();

    removeTypingIndicator();
    addMessage(data.response || '응답을 받을 수 없습니다.', 'assistant');
    isTyping = false;
  } catch (error) {
    console.error('API 호출 오류:', error);
    removeTypingIndicator();
    addMessage(
      '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.',
      'assistant'
    );
    isTyping = false;
  }
}

/**
 * 채팅 히스토리 로드 함수 (예시)
 * @param {HTMLElement} chatElement - 채팅 요소
 * @returns {Promise<void>}
 */
async function loadChatHistory(chatElement) {
  // 서버에서 특정 채팅의 히스토리를 가져오는 로직
  // const chatId = chatElement.dataset.chatId;
  // if (!chatId) return;
  // try {
  //     const response = await fetch(`/api/chat/${chatId}/history`);
  //     const data = await response.json();
  //     // 히스토리 로드 및 UI 업데이트
  // } catch (error) {
  //     console.error('채팅 히스토리 로드 실패:', error);
  // }
}

/**
 * 채팅 저장 함수 (예시)
 * @returns {Promise<void>}
 */
async function saveChatHistory() {
  // 현재 채팅을 서버에 저장하는 로직
  // try {
  //     const response = await fetch('/api/chat/save', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ messages: messageHistory })
  //     });
  //
  //     if (!response.ok) {
  //         throw new Error('채팅 저장 실패');
  //     }
  // } catch (error) {
  //     console.error('채팅 저장 오류:', error);
  // }
}

/**
 * 메시지 유효성 검사 함수
 * @param {string} message - 검사할 메시지
 * @returns {boolean} 유효성 검사 결과
 */
function validateMessage(message) {
  if (!message || message.trim().length === 0) {
    return false;
  }
  if (message.length > 4000) {
    alert('메시지가 너무 깁니다. 4000자 이하로 입력해 주세요.');
    return false;
  }
  return true;
}

/**
 * DOM 로드 완료 시 실행되는 초기화 함수
 */
document.addEventListener('DOMContentLoaded', function () {
  const messageInput = document.getElementById('messageInput');
  if (messageInput) {
    messageInput.focus();
  }

  // 사이드바 외부 클릭 시 닫기 (모바일)
  document.addEventListener('click', function (event) {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger');

    if (
      window.innerWidth <= 768 &&
      sidebar &&
      !sidebar.contains(event.target) &&
      hamburger &&
      !hamburger.contains(event.target) &&
      sidebar.classList.contains('open')
    ) {
      sidebar.classList.remove('open');
    }
  });

  // 윈도우 리사이즈 시 사이드바 상태 관리
  window.addEventListener('resize', function () {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && window.innerWidth > 768) {
      sidebar.classList.remove('open');
    }
  });
});

// TypeScript용 타입 내보내기 (필요시)
// export type { Message };
