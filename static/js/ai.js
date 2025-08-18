// AI 채팅 애플리케이션 JavaScript 파일

// 전역 변수들
let conversationHistory = [];
let currentConversation = null;
let isTyping = false;
let currentUserId = 1;

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById('messageInput');
  if (messageInput) {
    messageInput.focus();
  }

  // 기존 대화 목록 로드
  fetchAllConversations();

  // 사이드바 외부 클릭 시 닫기 (모바일)
  document.addEventListener('click', (event) => {
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
  window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && window.innerWidth > 768) {
      sidebar.classList.remove('open');
    }
  });
});

// 사이드바 토글 함수
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}

// 새 채팅 시작 함수
function startNewChat() {
  currentConversation = null;
  clearChat();

  // 사이드바에서 모든 active 클래스 제거
  document.querySelectorAll('.chat-item').forEach((item) => {
    item.classList.remove('active');
  });

  // 메시지 입력창에 포커스
  const messageInput = document.getElementById('messageInput');
  if (messageInput) {
    messageInput.focus();
  }
}

// 채팅 선택 함수
function selectChat(element) {
  // 모든 채팅 아이템의 active 클래스 제거
  document.querySelectorAll('.chat-item').forEach((item) => {
    item.classList.remove('active');
  });

  // 선택된 채팅 아이템에 active 클래스 추가
  element.classList.add('active');

  // 대화 ID 가져오기
  const conversationId = element.dataset.conversationId;
  if (conversationId) {
    loadConversation(parseInt(conversationId));
  }
}

// 채팅 영역 초기화 함수
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
}

// 텍스트 영역 자동 리사이즈 함수
function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

// 키 입력 처리 함수
function handleKeyDown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

// 메시지 전송 함수
function sendMessage() {
  const input = document.getElementById('messageInput');
  if (!input || !(input instanceof HTMLTextAreaElement)) return;

  const message = input.value.trim();

  if (!message || isTyping) return;

  // 메시지 유효성 검사
  if (!validateMessage(message)) return;

  // 사용자 메시지를 UI에 즉시 표시
  addMessageToUI(message, 'user');
  input.value = '';
  input.style.height = 'auto';

  // API로 메시지 전송
  sendMessageToAPI(message);
}

// API로 메시지 전송 함수
function sendMessageToAPI(message) {
  isTyping = true;
  addTypingIndicator();

  fetch(`/ask/${currentUserId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment: message,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      removeTypingIndicator();

      // AI 응답을 UI에 표시
      addMessageToUI(data.aiAnswer, 'ai');

      // 현재 대화 정보 업데이트
      currentConversation = {
        id: data.conversationId,
        user_id: currentUserId,
        messages: [],
        created_at: new Date().toISOString(),
        user: { id: currentUserId },
      };

      // 사이드바에 새 대화 추가 (첫 번째 메시지인 경우)
      addConversationToSidebar(data.conversationId, message);
      isTyping = false;
    })
    .catch((error) => {
      console.error('API 호출 오류:', error);
      removeTypingIndicator();
      addMessageToUI(
        '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.',
        'ai'
      );
      isTyping = false;
    });
}

// UI에 메시지 추가 함수
function addMessageToUI(content, sender) {
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
}

// 타이핑 인디케이터 추가 함수
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

// 타이핑 인디케이터 제거 함수
function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// 특정 대화 로드 함수
function loadConversation(conversationId) {
  fetch(`/ask/conversation/${conversationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`대화 로드 실패: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      currentConversation = data.conversation;

      // 채팅 영역 초기화
      const chatArea = document.getElementById('chatArea');
      if (!chatArea) return;

      chatArea.innerHTML = '';

      // 메시지들을 UI에 표시
      if (
        currentConversation.messages &&
        currentConversation.messages.length > 0
      ) {
        currentConversation.messages.forEach((message) => {
          addMessageToUI(message.content, message.sender);
        });
      } else {
        // 메시지가 없으면 기본 환영 메시지 표시
        addMessageToUI('안녕하세요! 무엇을 도와드릴까요?', 'ai');
      }
    })
    .catch((error) => {
      console.error('대화 로드 오류:', error);
      addMessageToUI('대화를 불러오는데 실패했습니다.', 'ai');
    });
}

// 모든 대화 목록 로드 함수
function fetchAllConversations() {
  fetch(`/ask/conversations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`대화 목록 로드 실패: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      conversationHistory = data.conversations;
      updateSidebar();
    })
    .catch((error) => {
      console.error('대화 목록 로드 오류:', error);
    });
}

// 사이드바 업데이트 함수
function updateSidebar() {
  const chatList = document.getElementById('chatList');
  if (!chatList) return;

  // 기존 대화 목록 제거 (새 채팅 버튼 제외)
  const existingChats = chatList.querySelectorAll('.chat-item');
  existingChats.forEach((item) => {
    if (!item.textContent.includes('새 채팅')) {
      item.remove();
    }
  });

  // 대화 목록 추가
  conversationHistory.forEach((conversation) => {
    const title = getConversationTitle(conversation);
    const chatItem = createChatItem(conversation.id, title);
    chatList.appendChild(chatItem);
  });
}

// 대화 제목 생성 함수
function getConversationTitle(conversation) {
  if (conversation.messages && conversation.messages.length > 0) {
    const firstUserMessage = conversation.messages.find(
      (msg) => msg.sender === 'user'
    );
    if (firstUserMessage) {
      return firstUserMessage.content.length > 30
        ? firstUserMessage.content.substring(0, 30) + '...'
        : firstUserMessage.content;
    }
  }
  return '새 대화';
}

// 채팅 아이템 생성 함수
function createChatItem(conversationId, title) {
  const chatItem = document.createElement('div');
  chatItem.className = 'chat-item';
  chatItem.dataset.conversationId = conversationId;
  chatItem.innerHTML = `
    <span class="chat-item-text">${escapeHtml(title)}</span>
    <button class="delete-chat-btn" onclick="deleteConversation(${conversationId}, event)" title="삭제">×</button>
  `;
  chatItem.onclick = () => selectChat(chatItem);
  return chatItem;
}

// 사이드바에 새 대화 추가 함수
function addConversationToSidebar(conversationId, firstMessage) {
  const chatList = document.getElementById('chatList');
  if (!chatList) return;

  const title =
    firstMessage.length > 30
      ? firstMessage.substring(0, 30) + '...'
      : firstMessage;

  const chatItem = createChatItem(conversationId, title);

  // 모든 기존 채팅의 active 클래스 제거
  chatList.querySelectorAll('.chat-item').forEach((item) => {
    item.classList.remove('active');
  });

  // 새 채팅을 활성화하고 목록 맨 위에 추가
  chatItem.classList.add('active');
  chatList.insertBefore(chatItem, chatList.firstChild);
}

// 대화 삭제 함수
function deleteConversation(conversationId, event) {
  event.stopPropagation(); // 채팅 선택 이벤트 방지

  if (!confirm('이 대화를 삭제하시겠습니까?')) {
    return;
  }

  fetch(`/ask/conversation/${conversationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: currentUserId,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`대화 삭제 실패: ${response.status}`);
      }

      // UI에서 해당 채팅 아이템 제거
      const chatItem = document.querySelector(
        `[data-conversation-id="${conversationId}"]`
      );
      if (chatItem) {
        chatItem.remove();
      }

      // 현재 선택된 대화가 삭제된 경우 초기화
      if (currentConversation && currentConversation.id === conversationId) {
        startNewChat();
      }

      alert('대화가 삭제되었습니다.');
    })
    .catch((error) => {
      console.error('대화 삭제 오류:', error);
      alert('대화 삭제에 실패했습니다.');
    });
}

// HTML 이스케이프 함수
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

// 메시지 유효성 검사 함수
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

// 시간 포맷팅 함수
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

window.startNewChat = startNewChat;
window.selectChat = selectChat;
window.toggleSidebar = toggleSidebar;
window.sendMessage = sendMessage;
window.handleKeyDown = handleKeyDown;
window.autoResize = autoResize;
window.deleteConversation = deleteConversation;
