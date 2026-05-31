// State Management
let state = {
  theme: localStorage.getItem('jeju_theme') || 'light',
  activeTab: 'timeline',
  budgetLimit: parseInt(localStorage.getItem('jeju_budget_limit')) || 1000000,
  peopleCount: parseInt(localStorage.getItem('jeju_people_count')) || 2,
  expenses: JSON.parse(localStorage.getItem('jeju_expenses')) || [
    { id: '1', category: 'transport', title: '왕복 항공권 (2인)', cost: 180000 },
    { id: '2', category: 'transport', title: '제주야렌트카 3일 완전자차', cost: 90000 },
    { id: '3', category: 'lodging', title: '히든클리프 호텔 (1박)', cost: 210000 },
    { id: '4', category: 'lodging', title: '구좌읍 삼일삼오 민박 (1박)', cost: 100000 },
    { id: '5', category: 'activity', title: '둘째날 윈드 1947 카트 (2인)', cost: 50000 },
    { id: '7', category: 'activity', title: '둘째날 월간레코드 입장권 (2인)', cost: 30000 },
    { id: '9', category: 'food', title: '첫날 점심 애월 언덕집국수', cost: 35000 },
    { id: '10', category: 'food', title: '첫날 저녁 숙성도 흑돼지', cost: 85000 },
    { id: '11', category: 'food', title: '둘째날 마트 수박 & 과일칼 장보기', cost: 25000 },
    { id: '12', category: 'food', title: '둘째날 점심 삼보식당', cost: 40000 },
    { id: '13', category: 'food', title: '둘째날 저녁 구좌 소금바치 순이네', cost: 38000 },
    { id: '14', category: 'food', title: '셋째날 점심 함덕 계절식탁 (순살갈치조림)', cost: 40000 }
  ],
  checklist: JSON.parse(localStorage.getItem('jeju_checklist')) || {},
  foodFilter: 'all',
  foodSearchQuery: '',
  mapDayFilter: 'all'
};

// Map & Route Coordinates Data
const routeData = {
  day1: [
    { lat: 33.5113, lng: 126.4930, name: '제주국제공항 ✈️', desc: '11:00 도착 및 제주야렌트카 인수' },
    { lat: 33.4615, lng: 126.3245, name: '애월 언덕집국수 🍜', desc: '12:30 애월 해안도로 고기국수 점심' },
    { lat: 33.2530, lng: 126.4082, name: '히든클리프 호텔 🏨', desc: '14:30 체크인 & 인피니티 풀 수영' },
    { lat: 33.2541, lng: 126.4172, name: '숙성도 중문점 🥩', desc: '18:30 육즙 가득 흑돼지 저녁' }
  ],
  day2: [
    { lat: 33.2530, lng: 126.4082, name: '히든클리프 호텔 🍳', desc: '08:30 조식 후 체크아웃' },
    { lat: 33.2515, lng: 126.4312, name: '중문 하나로마트 🛒', desc: '09:30 수박, 과일칼, 물놀이용품 장보기' },
    { lat: 33.2427, lng: 126.4795, name: '강정교 (강정천) 🍉', desc: '10:15 계곡 그늘 시원한 물놀이 & 수박 힐링' },
    { lat: 33.2488, lng: 126.5606, name: '삼보식당 뚝배기 🍲', desc: '12:30 든든한 한식 노포 점심' },
    { lat: 33.2825, lng: 126.6025, name: '윈드 1947 카트 🏎️', desc: '14:00 한라산 뷰 스릴 가득 카트 레이싱' },
    { lat: 33.4682, lng: 126.9360, name: '월간레코드 🎵', desc: '16:00 성산일출봉 오션뷰 LP 청음' },
    { lat: 33.4907, lng: 126.9095, name: '소심한책방 📚', desc: '17:15 종달리 조용한 골목 속 독립서점 구경' },
    { lat: 33.5228, lng: 126.9015, name: '삼일삼오 민박 🏡', desc: '18:15 구좌읍 돌담 감성 숙소 체크인' },
    { lat: 33.4839, lng: 126.9023, name: '구좌 소금바치 순이네 🐙', desc: '19:00 매콤달콤 불맛 가득 돌문어볶음 저녁' }
  ],
  day3: [
    { lat: 33.5228, lng: 126.9015, name: '삼일삼오 민박 (아침 런닝) 🏃', desc: '08:00 ~ 09:00 하도해변 해안도로 조깅 후 09:20 체크아웃' },
    { lat: 33.5244, lng: 126.8524, name: '세화 돌담칼국수 🍜', desc: '09:30 개운하고 녹진한 보말칼국수 아침 식사' },
    { lat: 33.4646, lng: 126.7820, name: '송당 동화마을 🌸', desc: '10:45 감성 정원 산책 & 웅장한 연못 뷰' },
    { lat: 33.4019, lng: 126.6455, name: '사려니숲길 🌲', desc: '12:30 울창한 삼나무 숲길 피톤치드 힐링 산책' },
    { lat: 33.5428, lng: 126.6680, name: '계절식탁 함덕점 🐟', desc: '14:15 바다 전망 가시 없는 순살갈치조림 점심' },
    { lat: 33.5435, lng: 126.6690, name: '카페 델문도 ☕', desc: '15:20 함덕 해변 모래사장 위 핫플 카페' },
    { lat: 33.5113, lng: 126.4930, name: '제주국제공항 ✈️', desc: '16:30 제주야렌트카 반납 후 서울 복귀 출발' }
  ]
};

// Map Global Variables
let map = null;
let mapLayers = {
  light: null,
  dark: null
};
let mapMarkers = [];
let mapPolylines = [];

// Recommended Food & Cafe Data (Revised for South + East)
const foodData = [
  {
    id: 'food_1',
    name: '명진전복 (구좌읍 평대리)',
    category: 'food',
    emoji: '🍲',
    rating: 4.8,
    desc: '수요미식회 출연한 전국구 전복 요리 전문점. 뜨거운 전복돌솥밥에 물을 부어 구수하게 누룽지까지 비우는 코스.',
    menu: '전복돌솥밥, 전복구이, 전복죽',
    price: '15,000원 ~ 40,000원',
    mapUrl: 'https://map.naver.com/v5/search/명진전복'
  },
  {
    id: 'food_2',
    name: '소금바치 순이네 (구좌읍 종달리)',
    category: 'food',
    emoji: '🐙',
    rating: 4.8,
    desc: '깻잎향 솔솔 나는 불맛 가득 돌문어볶음 전문점. 양념에 소면을 비벼 먹고 밥까지 비벼 먹는 최고의 마성의 맛집.',
    menu: '돌문어볶음, 한치물회, 갈치조림',
    price: '30,000원 ~ 50,000원',
    mapUrl: 'https://map.naver.com/v5/search/소금바치순이네'
  },
  {
    id: 'food_3',
    name: '숙성도 중문점 (서귀포 중문)',
    category: 'food',
    emoji: '🥩',
    rating: 4.8,
    desc: '뼈등심과 삼겹살이 입안에서 팡팡 터지는 최고의 숙성 흑돼지 구이집. 테이블링/캐치테이블 원격 줄서기 필수.',
    menu: '교차숙성 흑돼지, 뼈등심, 960숙성 뼈목살',
    price: '60,000원 ~ 100,000원',
    mapUrl: 'https://map.naver.com/v5/search/숙성도%20중문점'
  },
  {
    id: 'cafe_1',
    name: '카페 델문도 (함덕해수욕장)',
    category: 'cafe',
    emoji: '☕',
    rating: 4.6,
    desc: '함덕 에메랄드빛 해변 모래사장 위에 지어져 비행기 탑승 전 동부 해안의 마지막 낭만을 한눈에 품을 수 있는 베이커리 핫플.',
    menu: '델문도 아인슈페너, 제주 마늘바게트, 한라봉팡도르',
    price: '7,500원 ~ 12,000원',
    mapUrl: 'https://map.naver.com/v5/search/카페델문도'
  },
  {
    id: 'food_4',
    name: '보목해녀의집 (서귀포 보목동)',
    category: 'food',
    emoji: '🐟',
    rating: 4.6,
    desc: '서귀포 바다를 정면으로 마주하는 평상에서 제철 한치물회나 뼈째 씹는 구수한 자리돔물회를 신선한 바람 속에 먹는 로컬 해녀집.',
    menu: '한치물회(냉동/생물), 자리돔물회, 갈치조림',
    price: '15,000원 ~ 40,000원',
    mapUrl: 'https://map.naver.com/v5/search/보목해녀의집'
  },
  {
    id: 'cafe_2',
    name: '카페 무크 (Mouk) (구좌읍 세화리)',
    category: 'cafe',
    emoji: '🪵',
    rating: 4.7,
    desc: '세화리 해변 안쪽 골목에 자리 잡은 고요한 원목 인테리어 감성 카페. 독서나 조용히 대화하기 좋으며 수제 구움과자가 매력.',
    menu: '핸드드립 필터커피, 바닐라 타르트, 마들렌',
    price: '6,000원 ~ 9,000원',
    mapUrl: 'https://map.naver.com/v5/search/카페무크'
  },
  {
    id: 'food_5',
    name: '하갈비국수 (애월)',
    category: 'food',
    emoji: '🍜',
    rating: 4.2,
    desc: '공항에서 애월 해안을 경유해 내려가는 서부 도로변 오션뷰 고기국수 전문점. 깔끔하고 시원한 육수가 일품.',
    menu: '고기국수, 갈비비빔국수, 돔베고기',
    price: '11,000원 ~ 15,000원',
    mapUrl: 'https://map.naver.com/v5/search/하갈비국수'
  },
  {
    id: 'cafe_3',
    name: '더 클리프 (The Cliff) (중문)',
    category: 'cafe',
    emoji: '🍹',
    rating: 4.5,
    desc: '중문색달해변 해안 절벽 선셋 카페 & 펍. 발리풍의 이국적인 대형 야외 테이블과 화려한 음악이 어우러진 힙플레이스.',
    menu: '색달 펀치(무알콜), 한라산 스무디, 현무암 피자',
    price: '9,500원 ~ 22,000원',
    mapUrl: 'https://map.naver.com/v5/search/더클리프'
  }
];

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTabs();
  initBudget();
  initChecklist();
  initFoodBoard();
  initSidebarMobile();
  
  // Initialize map shortly after DOM loads to avoid Leaflet width/height calculation bugs
  setTimeout(() => {
    initLeafletMap();
  }, 100);
});

// 1. THEME MANAGEMENT
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeUI();

  const themeBtn = document.getElementById('themeToggleBtn');
  themeBtn.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('jeju_theme', state.theme);
    updateThemeUI();
    
    // Switch Map Tile style on the fly if Map is initialized
    if (map) {
      updateMapTileLayer();
    }
  });
}

function updateThemeUI() {
  const icon = document.getElementById('themeToggleIcon');
  const text = document.getElementById('themeToggleText');
  if (state.theme === 'dark') {
    icon.textContent = '☀️';
    text.textContent = '라이트 모드';
  } else {
    icon.textContent = '🌙';
    text.textContent = '다크 모드';
  }
}

// 2. TAB MANAGEMENT
function switchTab(targetTab) {
  state.activeTab = targetTab;

  // Update Sidebar UI
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(m => {
    if (m.getAttribute('data-tab') === targetTab) {
      m.classList.add('active');
    } else {
      m.classList.remove('active');
    }
  });

  // Update Bottom Nav UI
  const navItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
  navItems.forEach(n => {
    if (n.getAttribute('data-tab') === targetTab) {
      n.classList.add('active');
    } else {
      n.classList.remove('active');
    }
  });

  // Update Panels UI
  const panels = document.querySelectorAll('.tab-panel');
  panels.forEach(panel => {
    panel.classList.remove('active');
    if (panel.id === `tabPanel${capitalize(targetTab)}`) {
      panel.classList.add('active');
    }
  });

  // Special layout trigger for Leaflet Map resizing when timeline panel is activated
  if (targetTab === 'timeline' && map) {
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }

  // Close sidebar on mobile
  const sidebar = document.getElementById('appSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

function initTabs() {
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      switchTab(item.getAttribute('data-tab'));
    });
  });

  const navItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      switchTab(item.getAttribute('data-tab'));
    });
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 3. LEAFLET MAP & ROUTES ROUTING SYSTEM
function initLeafletMap() {
  // Check if Leaflet is loaded
  if (typeof L === 'undefined') {
    console.error('Leaflet library is not loaded.');
    return;
  }

  // Create Map centered in middle of Jeju Island
  map = L.map('routeMap', {
    center: [33.38, 126.56],
    zoom: 9,
    zoomControl: true,
    scrollWheelZoom: false // disable scrolling zoom on scroll unless focused
  });

  // Create CartoDB tile layers (light & dark variants)
  mapLayers.light = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  });

  mapLayers.dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  });

  // Apply default layer
  updateMapTileLayer();

  // Enable scroll wheel zoom on map double click/click
  map.on('focus', () => { map.scrollWheelZoom.enable(); });
  map.on('blur', () => { map.scrollWheelZoom.disable(); });

  // Map day filtering buttons event binding
  const mapFilterBtns = document.querySelectorAll('.map-filter-btn');
  mapFilterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Toggle button styles
      mapFilterBtns.forEach(b => {
        b.classList.remove('active');
        b.style.background = 'transparent';
        b.style.color = 'var(--text-muted)';
      });
      btn.classList.add('active');
      btn.style.background = 'var(--bg-color)';
      btn.style.color = 'var(--text-color)';

      state.mapDayFilter = btn.getAttribute('data-map-day');
      renderMapRoutes();
    });
  });

  // Initial draw
  renderMapRoutes();
}

function updateMapTileLayer() {
  if (state.theme === 'dark') {
    if (map.hasLayer(mapLayers.light)) {
      map.removeLayer(mapLayers.light);
    }
    mapLayers.dark.addTo(map);
  } else {
    if (map.hasLayer(mapLayers.dark)) {
      map.removeLayer(mapLayers.dark);
    }
    mapLayers.light.addTo(map);
  }
}

function renderMapRoutes() {
  // 1. Clear existing markers and polylines
  mapMarkers.forEach(m => map.removeLayer(m));
  mapPolylines.forEach(p => map.removeLayer(p));
  mapMarkers = [];
  mapPolylines = [];

  const bounds = [];
  
  // Custom styles for Day Lines
  const colors = {
    day1: '#ff4757', // Coral red
    day2: '#2ed573', // Lime green
    day3: '#1e90ff'  // Dodger blue
  };

  const drawDayRoute = (dayKey, color) => {
    const coords = routeData[dayKey];
    if (!coords || coords.length === 0) return;

    // Draw Line (Polyline)
    const latlngs = coords.map(c => [c.lat, c.lng]);
    const polyline = L.polyline(latlngs, {
      color: color,
      weight: 4,
      opacity: 0.8,
      dashArray: dayKey === 'day2' ? '5, 8' : 'none' // Dotted line for Day 2 to show cross-island trip
    }).addTo(map);
    mapPolylines.push(polyline);

    // Draw Markers
    coords.forEach((c, idx) => {
      bounds.push([c.lat, c.lng]);

      // Custom marker icon creation with styled labels inside
      const markerText = idx === 0 ? 'Start' : idx === coords.length - 1 ? 'End' : `${idx + 1}`;
      
      const customIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color:${color}; color:white; font-size:10px; font-weight:700; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${markerText}</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([c.lat, c.lng], { icon: customIcon }).addTo(map);
      
      // Popup binding with Notion visual style
      const popupHtml = `
        <div class="map-popup-title">
          <span>${c.name}</span>
        </div>
        <div class="map-popup-desc">
          <span>${c.desc}</span>
        </div>
      `;
      marker.bindPopup(popupHtml, { closeButton: false });
      mapMarkers.push(marker);
    });
  };

  // Render Day lines depending on filter
  if (state.mapDayFilter === 'all' || state.mapDayFilter === '1') {
    drawDayRoute('day1', colors.day1);
  }
  if (state.mapDayFilter === 'all' || state.mapDayFilter === '2') {
    drawDayRoute('day2', colors.day2);
  }
  if (state.mapDayFilter === 'all' || state.mapDayFilter === '3') {
    drawDayRoute('day3', colors.day3);
  }

  // Zoom map to fit the filtered bounds
  if (bounds.length > 0) {
    map.fitBounds(L.latLngBounds(bounds), {
      padding: [40, 40],
      maxZoom: 13
    });
  }
}

// 4. BUDGET CALCULATOR
function initBudget() {
  // Input Bindings
  const inputLimit = document.getElementById('inputLimitBudget');
  const inputPeople = document.getElementById('inputPeopleCount');

  inputLimit.value = state.budgetLimit;
  inputPeople.value = state.peopleCount;

  inputLimit.addEventListener('input', (e) => {
    state.budgetLimit = parseInt(e.target.value) || 0;
    localStorage.setItem('jeju_budget_limit', state.budgetLimit);
    calculateBudget();
  });

  inputPeople.addEventListener('input', (e) => {
    state.peopleCount = parseInt(e.target.value) || 1;
    localStorage.setItem('jeju_people_count', state.peopleCount);
    calculateBudget();
  });

  // Modal Setup
  const openModalBtn = document.getElementById('openExpenseModalBtn');
  const closeModalBtn = document.getElementById('closeExpenseModalBtn');
  const cancelModalBtn = document.getElementById('cancelExpenseBtn');
  const submitModalBtn = document.getElementById('submitExpenseBtn');
  const modal = document.getElementById('expenseModal');

  openModalBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.getElementById('modalInputTitle').value = '';
    document.getElementById('modalInputCost').value = '';
  });

  const closeModal = () => modal.classList.remove('active');
  closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);

  submitModalBtn.addEventListener('click', () => {
    const category = document.getElementById('modalSelectCategory').value;
    const title = document.getElementById('modalInputTitle').value.trim();
    const cost = parseInt(document.getElementById('modalInputCost').value) || 0;

    if (!title) {
      alert('지출 항목명을 입력해 주세요.');
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      category,
      title,
      cost
    };

    state.expenses.push(newExpense);
    saveExpenses();
    renderExpenses();
    calculateBudget();
    closeModal();
  });

  // Init calculations & rendering
  renderExpenses();
  calculateBudget();
}

function saveExpenses() {
  localStorage.setItem('jeju_expenses', JSON.stringify(state.expenses));
}

function renderExpenses() {
  const tbody = document.getElementById('expenseTableBody');
  tbody.innerHTML = '';

  state.expenses.forEach(item => {
    const tr = document.createElement('tr');
    tr.id = `expenseRow_${item.id}`;

    const catBadge = getCategoryBadge(item.category);
    
    tr.innerHTML = `
      <td>${catBadge}</td>
      <td style="font-weight: 500;">${escapeHTML(item.title)}</td>
      <td>
        <div style="display: flex; align-items: center; justify-content: flex-start; gap: 4px;">
          <input type="number" class="expense-cost-input" data-id="${item.id}" value="${item.cost}" min="0" step="1000">
          <span style="font-weight: 600; color: var(--text-color);">원</span>
        </div>
      </td>
      <td style="text-align: center;">
        <button class="expense-delete-btn" data-id="${item.id}" aria-label="삭제">
          🗑️
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Attach edit events
  const costInputs = tbody.querySelectorAll('.expense-cost-input');
  costInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const id = input.getAttribute('data-id');
      const val = parseInt(input.value) || 0;
      
      // Update state in memory
      state.expenses = state.expenses.map(item => {
        if (item.id === id) {
          return { ...item, cost: val };
        }
        return item;
      });
      
      calculateBudget();
    });

    input.addEventListener('change', () => {
      saveExpenses();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
  });

  // Attach delete events
  const deleteBtns = tbody.querySelectorAll('.expense-delete-btn');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      state.expenses = state.expenses.filter(item => item.id !== id);
      saveExpenses();
      renderExpenses();
      calculateBudget();
    });
  });
}

function getCategoryBadge(cat) {
  switch (cat) {
    case 'transport':
      return `<span class="notion-tag tag-green">✈️ 교통/항공</span>`;
    case 'lodging':
      return `<span class="notion-tag tag-blue">🏨 숙박</span>`;
    case 'activity':
      return `<span class="notion-tag tag-purple">🏎️ 액티비티</span>`;
    case 'food':
      return `<span class="notion-tag tag-red">🍔 식비</span>`;
    default:
      return `<span class="notion-tag tag-gray">🎁 기타</span>`;
  }
}

function calculateBudget() {
  let totalSpent = 0;
  let categorySums = { transport: 0, lodging: 0, activity: 0, food: 0, other: 0 };

  state.expenses.forEach(item => {
    totalSpent += item.cost;
    if (categorySums[item.category] !== undefined) {
      categorySums[item.category] += item.cost;
    } else {
      categorySums.other += item.cost;
    }
  });

  const remaining = state.budgetLimit - totalSpent;
  const perPerson = Math.round(totalSpent / state.peopleCount);

  // Update Overview Cards UI
  document.getElementById('budgetLimitVal').textContent = `${formatNumber(state.budgetLimit)} 원`;
  document.getElementById('budgetTotalSpentVal').textContent = `${formatNumber(totalSpent)} 원`;
  
  const remainingLabel = document.getElementById('budgetRemainingVal');
  const remainingWrapper = document.getElementById('budgetRemainingWrapper');
  remainingLabel.textContent = `${formatNumber(remaining)} 원`;
  
  if (remaining < 0) {
    remainingLabel.style.color = '#ff0000';
    remainingLabel.style.fontWeight = 'bold';
    remainingWrapper.innerHTML = `<span>🚨 예산 초과:</span> <span id="budgetRemainingVal" style="color:#ff0000; font-weight:bold;">${formatNumber(Math.abs(remaining))} 원 초과</span>`;
  } else {
    remainingLabel.style.color = '';
    remainingLabel.style.fontWeight = '';
    remainingWrapper.innerHTML = `<span>남은 예산:</span> <span id="budgetRemainingVal">${formatNumber(remaining)} 원</span>`;
  }

  document.getElementById('budgetPerPersonVal').textContent = `${formatNumber(perPerson)} 원`;
  document.getElementById('budgetPeopleLabel').textContent = `${state.peopleCount} 명`;

  // Update Category Progress Bars
  Object.keys(categorySums).forEach(cat => {
    const sum = categorySums[cat];
    const pct = totalSpent > 0 ? Math.round((sum / totalSpent) * 100) : 0;
    
    const capitalized = capitalize(cat);
    const bar = document.getElementById(`bar${capitalized}`);
    const valText = document.getElementById(`val${capitalized}`);

    if (bar && valText) {
      bar.style.width = `${pct}%`;
      valText.textContent = `${formatNumber(sum)}원 (${pct}%)`;
    }
  });
}

// 5. CHECKLIST MANAGEMENT
function initChecklist() {
  const checkboxes = document.querySelectorAll('.checklist-checkbox');
  const headers = document.querySelectorAll('.checklist-group-header');

  // Load saved states
  checkboxes.forEach((cb, idx) => {
    const id = `chk_${idx}`;
    cb.id = id;
    
    if (state.checklist[id] !== undefined) {
      cb.checked = state.checklist[id];
    } else {
      // Default state for the first element
      if (idx === 0) cb.checked = true;
    }

    cb.addEventListener('change', (e) => {
      state.checklist[id] = e.target.checked;
      localStorage.setItem('jeju_checklist', JSON.stringify(state.checklist));
      updateChecklistProgress();
    });
  });

  // Collapsible Groups
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const group = header.parentElement;
      group.classList.toggle('collapsed');
    });
  });

  updateChecklistProgress();
}

function updateChecklistProgress() {
  const groups = ['required', 'clothes', 'leisure', 'tech'];
  let grandTotal = 0;
  let grandChecked = 0;

  groups.forEach(g => {
    const cbs = document.querySelectorAll(`.checklist-checkbox[data-group="${g}"]`);
    const total = cbs.length;
    let checked = 0;

    cbs.forEach(cb => {
      if (cb.checked) checked++;
    });

    grandTotal += total;
    grandChecked += checked;

    // Capitalize group key to target the counter element
    const capitalized = capitalize(g);
    const counter = document.getElementById(`count${capitalized}`);
    if (counter) {
      counter.textContent = `${checked}/${total}`;
    }
  });

  // Update Global progress bar
  const pct = grandTotal > 0 ? Math.round((grandChecked / grandTotal) * 100) : 0;
  const pctText = document.getElementById('checklistProgressText');
  const barFill = document.getElementById('checklistProgressBar');

  if (pctText && barFill) {
    pctText.textContent = `${pct}% (${grandChecked}/${grandTotal})`;
    barFill.style.width = `${pct}%`;
  }
}

// 6. FOOD & CAFE BOARD
function initFoodBoard() {
  const searchInput = document.getElementById('foodSearchInput');
  const filterTabs = document.querySelectorAll('.board-filter-tab');

  // Load Initial Grid
  renderFoodBoard();

  // Search filter
  searchInput.addEventListener('input', (e) => {
    state.foodSearchQuery = e.target.value.toLowerCase().trim();
    renderFoodBoard();
  });

  // Tab filter
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      state.foodFilter = tab.getAttribute('data-filter');
      renderFoodBoard();
    });
  });
}

function renderFoodBoard() {
  const grid = document.getElementById('foodBoardGrid');
  grid.innerHTML = '';

  const filtered = foodData.filter(item => {
    // Category match
    const catMatch = state.foodFilter === 'all' || item.category === state.foodFilter;
    // Search match
    const searchMatch = item.name.toLowerCase().includes(state.foodSearchQuery) || 
                        item.desc.toLowerCase().includes(state.foodSearchQuery) ||
                        item.menu.toLowerCase().includes(state.foodSearchQuery);
    return catMatch && searchMatch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px 0;">
        검색 결과가 없습니다.
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('article');
    card.className = 'board-card';

    // Stars rating
    let stars = '⭐'.repeat(Math.floor(item.rating));
    if (item.rating % 1 !== 0) stars += '✨';

    card.innerHTML = `
      <div class="board-card-img-placeholder">
        <span>${item.emoji}</span>
      </div>
      <div class="board-card-content">
        <div class="board-card-header">
          <h3 class="board-card-title">${escapeHTML(item.name)}</h3>
          <span class="board-card-rating" aria-label="평점 ${item.rating}">⭐ ${item.rating}</span>
        </div>
        <p class="board-card-desc">${escapeHTML(item.desc)}</p>
        <div class="board-card-info">
          <div class="board-card-info-item">
            <span>추천 메뉴:</span>
            <span class="board-card-val">${escapeHTML(item.menu)}</span>
          </div>
          <div class="board-card-info-item">
            <span>가격대:</span>
            <span class="board-card-val">${escapeHTML(item.price)}</span>
          </div>
        </div>
      </div>
      <div class="board-card-footer">
        <a href="${item.mapUrl}" target="_blank" class="map-btn">📍 네이버지도 보기</a>
      </div>
    `;

    grid.appendChild(card);
  });
}

// 7. SIDEBAR MOBILE TOGGLE
function initSidebarMobile() {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.getElementById('appSidebar');
  const overlay = document.getElementById('sidebarOverlay');

  const toggleSidebar = () => {
    const isOpen = sidebar.classList.toggle('open');
    if (isOpen) {
      overlay.classList.add('active');
    } else {
      overlay.classList.remove('active');
    }
  };

  const closeSidebar = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  };

  toggleBtn.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', closeSidebar);

  // Close sidebar clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && e.target !== toggleBtn && e.target !== overlay) {
        closeSidebar();
      }
    }
  });
}

// UTILITY FUNCTIONS
function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
