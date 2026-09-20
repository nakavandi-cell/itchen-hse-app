// ۱. ساختار جامع چک‌لیست ممیزی بهداشت و ایمنی آشپزخانه و غذاخوری (۱۸ مورد در ۵ محور)
const checklistCategories = [
  {
    id: 'personal_hygiene',
    title: '۱. بهداشت فردی پرسنل و سلامت',
    items: [
      { id: 'q1', text: 'آیا کلیه پرسنل دارای کارت بهداشت معتبر و گواهی دوره آموزش بهداشت هستند؟' },
      { id: 'q2', text: 'آیا پرسنل از لباس کار تمیز، کلاه، ماسک و کفش ایمنی مناسب آشپزخانه استفاده می‌کنند؟' },
      { id: 'q3', text: 'آیا نظافت فردی (کوتاه بودن ناخن‌ها، عدم استفاده از زیورآلات و ساعت) رعایت شده است؟' },
      { id: 'q4', text: 'آیا ایستگاه شستشوی دست مجهز به مایع صابون، ضدعفونی‌کننده و دستمال یکبار مصرف فعال است؟' }
    ]
  },
  {
    id: 'food_storage',
    title: '۲. نگهداری مواد غذایی و انبارداری',
    items: [
      { id: 'q5', text: 'آیا دمای یخچال‌ها (زیر ۴ درجه) و فریزرهای نگهداری گوشت (زیر منفی ۱۸) استاندارد و روزانه ثبت می‌شود؟' },
      { id: 'q6', text: 'آیا تفکیک مواد خام و پخته و جداسازی گوشت، مرغ و سبزیجات در طبقات رعایت شده است؟' },
      { id: 'q7', text: 'آیا اصول انبارداری FIFO (اولین ورودی، اولین خروجی) و برچسب‌گذاری تاریخ مصرف رعایت شده؟' },
      { id: 'q8', text: 'آیا مواد غذایی خشک روی پالت‌های استیل/پلاستیکی با فاصله حداقل ۲۰ سانتیمتر از کف و دیوار قرار دارند؟' }
    ]
  },
  {
    id: 'sanitation_waste',
    title: '۳. شستشو، ضدعفونی و مدیریت پسماند',
    items: [
      { id: 'q9', text: 'آیا برنامه زمان‌بندی مدون نظافت و گندزدایی سطوح کار، تخته‌های برش و ظروف اجرا می‌شود؟' },
      { id: 'q10', text: 'آیا سطل‌های زباله دارای درب پدالی سالم، کیسه زباله مناسب و عاری از تجمع مازاد هستند؟' },
      { id: 'q11', text: 'آیا چاه‌بست‌ها، گریل‌ها و کف‌شورها دارای توری مناسب، بدون بو و دارای درپوش سالم هستند؟' },
      { id: 'q12', text: 'آیا مواد شوینده و شیمیایی در کابینت مجزا و قفل‌دار، دور از مواد غذایی نگهداری می‌شوند؟' }
    ]
  },
  {
    id: 'environment_equipment',
    title: '۴. ایمنی تجهیزات و محیط فیزیکی',
    items: [
      { id: 'q13', text: 'آیا کف آشپزخانه و سالن غذاخوری تمیز، خشک و عاری از لغزندگی، چربی و شکستگی سرامیک است؟' },
      { id: 'q14', text: 'آیا سیم‌کشی‌ها، پریزها و اتصالات برقی تجهیزات ضدآب و مجهز به کلید محافظ جان (RCCB/نشت جریان) هستند؟' },
      { id: 'q15', text: 'آیا هودهای صنعتی، فیلترهای چربی‌گیر و کانال‌های تهویه تمیز بوده و مکش مناسب دارند؟' },
      { id: 'q16', text: 'آیا محافظ و گارد ایمنی روی تجهیزات خردکن، چرخ‌گوشت صنعتی و اره استخوان‌بر نصب و فعال است؟' }
    ]
  },
  {
    id: 'fire_emergency',
    title: '۵. ایمنی حریق، گاز و شرایط اضطراری',
    items: [
      { id: 'q17', text: 'آیا کپسول‌های آتش‌نشانی (پودری و CO2 یا کلاس K) شارژ معتبر، درجه مناسب و دسترسی باز دارند؟' },
      { id: 'q18', text: 'آیا سیستم هشدار نشت گاز، شیر برقی اضطراری گاز و جعبه کمک‌های اولیه با ملزومات سوختگی آماده‌به‌کارند؟' }
    ]
  }
];

let audits = [];
let doughnutChart = null;
let barChart = null;
let currentViewingAudit = null;

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', () => {
  setAuditDateTime();
  renderChecklist();
  loadAudits();
  initCharts();
});

// درج زمان جاری
function setAuditDateTime() {
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }).format(now);
  const el = document.getElementById('audit-date');
  if (el) el.value = dateStr;
}

// رسم دینامیک سوالات چک‌لیست
function renderChecklist() {
  const container = document.getElementById('checklist-container');
  if (!container) return;

  container.innerHTML = checklistCategories.map(cat => `
    <div class="category-section card">
      <div class="category-header">${cat.title}</div>
      ${cat.items.map(item => `
        <div class="checklist-item" data-id="${item.id}" data-category="${cat.id}">
          <div class="item-title">${item.text}</div>
          <div class="toggle-group">
            <button type="button" class="toggle-btn active-yes" onclick="setAnswer('${item.id}', 'yes', this)">منطبق (بله)</button>
            <button type="button" class="toggle-btn" onclick="setAnswer('${item.id}', 'no', this)">عدم انطباق (خیر)</button>
            <button type="button" class="toggle-btn" onclick="setAnswer('${item.id}', 'na', this)">عدم کاربرد</button>
          </div>
          <div class="item-notes">
            <input type="text" id="note-${item.id}" placeholder="توضیحات تکمیلی یا اقدام اصلاحی پیشنهادی...">
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

// انتخاب وضعیت پاسخ
function setAnswer(itemId, status, btnElement) {
  const parent = btnElement.parentElement;
  const buttons = parent.querySelectorAll('.toggle-btn');
  buttons.forEach(b => {
    b.classList.remove('active-yes', 'active-no', 'active-na');
  });

  if (status === 'yes') btnElement.classList.add('active-yes');
  else if (status === 'no') btnElement.classList.add('active-no');
  else if (status === 'na') btnElement.classList.add('active-na');

  btnElement.closest('.checklist-item').setAttribute('data-status', status);
}

// جابجایی تب‌ها
function switchTab(tabId) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

  const targetTab = document.getElementById('tab-' + tabId);
  if (targetTab) targetTab.classList.add('active');

  const btnIndex = tabId === 'new-audit' ? 0 : (tabId === 'dashboard' ? 1 : 2);
  document.querySelectorAll('.tab-btn')[btnIndex].classList.add('active');

  if (tabId === 'dashboard') updateDashboard();
  if (tabId === 'history') renderHistory();
}

// ذخیره فرم بازرسی
function saveAudit(event) {
  event.preventDefault();

  const inspector = document.getElementById('inspector-name').value.trim();
  const location = document.getElementById('location-unit').value;
  const shift = document.getElementById('shift').value;
  const frequency = document.getElementById('frequency').value;
  const equipTag = document.getElementById('equipment-tag').value.trim() || 'ندارد';
  const dateStr = document.getElementById('audit-date').value;

  let yesCount = 0;
  let noCount = 0;
  let naCount = 0;
  const itemResults = [];

  const items = document.querySelectorAll('.checklist-item');
  items.forEach(el => {
    const id = el.getAttribute('data-id');
    const cat = el.getAttribute('data-category');
    const title = el.querySelector('.item-title').innerText;
    const note = document.getElementById('note-' + id).value.trim();

    let status = 'yes';
    if (el.querySelector('.active-no')) status = 'no';
    else if (el.querySelector('.active-na')) status = 'na';

    if (status === 'yes') yesCount++;
    else if (status === 'no') noCount++;
    else naCount++;

    itemResults.push({ id, category: cat, title, status, note });
  });

  const evaluable = yesCount + noCount;
  const scorePercent = evaluable > 0 ? Math.round((yesCount / evaluable) * 100) : 100;

  let riskLevel = 'عالی';
  let riskClass = 'badge-excellent';
  if (scorePercent < 70 || noCount >= 4) {
    riskLevel = 'بحرانی (نیازمند توقف/اقدام فوری)';
    riskClass = 'badge-critical';
  } else if (scorePercent < 85 || noCount >= 2) {
    riskLevel = 'متوسط (اقدام اصلاحی دوره‌ای)';
    riskClass = 'badge-medium';
  }

  const auditRecord = {
    id: 'AUD-' + Date.now(),
    date: dateStr,
    inspector,
    location,
    shift,
    frequency,
    equipTag,
    scorePercent,
    riskLevel,
    riskClass,
    stats: { yes: yesCount, no: noCount, na: naCount },
    items: itemResults
  };

  audits.unshift(auditRecord);
  localStorage.setItem('hse_kitchen_audits', JSON.stringify(audits));

  alert(`✅ بازرسی با موفقیت ثبت شد!\nنمره انطباق: ${scorePercent}%\nسطح ریسک: ${riskLevel}`);
  
  // ریست فرم
  document.getElementById('audit-form').reset();
  setAuditDateTime();
  renderChecklist();
  switchTab('dashboard');
}

// بازیابی اطلاعات از حافظه
function loadAudits() {
  const saved = localStorage.getItem('hse_kitchen_audits');
  if (saved) {
    try {
      audits = JSON.parse(saved);
    } catch (e) {
      audits = [];
    }
  }
}

// نمودارها
function initCharts() {
  const ctxDoughnut = document.getElementById('complianceDoughnutChart');
  const ctxBar = document.getElementById('categoryBarChart');
  if (!ctxDoughnut || !ctxBar) return;

  doughnutChart = new Chart(ctxDoughnut, {
    type: 'doughnut',
    data: {
      labels: ['منطبق', 'عدم انطباق', 'عدم کاربرد'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ['#16a34a', '#dc2626', '#9ca3af']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  barChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: ['بهداشت فردی', 'انبار و نگهداری', 'شستشو و پسماند', 'ایمنی تجهیزات', 'حریق و اضطرار'],
      datasets: [{
        label: 'درصد انطباق (%)',
        data: [0, 0, 0, 0, 0],
        backgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true, max: 100 } }
    }
  });
}

// بروزرسانی داده‌های داشبورد
function updateDashboard() {
  document.getElementById('stat-total').innerText = audits.length;

  if (audits.length === 0) {
    document.getElementById('stat-avg-score').innerText = '0%';
    document.getElementById('stat-non-conform').innerText = '0';
    return;
  }

  let totalScore = 0;
  let totalNo = 0;
  let totalYes = 0;
  let totalNa = 0;

  audits.forEach(a => {
    totalScore += a.scorePercent;
    totalNo += a.stats.no;
    totalYes += a.stats.yes;
    totalNa += a.stats.na;
  });

  const avg = Math.round(totalScore / audits.length);
  document.getElementById('stat-avg-score').innerText = avg + '%';
  document.getElementById('stat-non-conform').innerText = totalNo;

  // آپدیت چارت دونات
  if (doughnutChart) {
    doughnutChart.data.datasets[0].data = [totalYes, totalNo, totalNa];
    doughnutChart.update();
  }

  // محاسبه عملکرد بر اساس دسته‌بندی ۵ گانه
  const catScores = {
    personal_hygiene: { yes: 0, total: 0 },
    food_storage: { yes: 0, total: 0 },
    sanitation_waste: { yes: 0, total: 0 },
    environment_equipment: { yes: 0, total: 0 },
    fire_emergency: { yes: 0, total: 0 }
  };

  audits.forEach(a => {
    a.items.forEach(item => {
      if (item.status !== 'na' && catScores[item.category]) {
        catScores[item.category].total++;
        if (item.status === 'yes') catScores[item.category].yes++;
      }
    });
  });

  const catPercentages = [
    catScores.personal_hygiene.total ? Math.round((catScores.personal_hygiene.yes / catScores.personal_hygiene.total) * 100) : 0,
    catScores.food_storage.total ? Math.round((catScores.food_storage.yes / catScores.food_storage.total) * 100) : 0,
    catScores.sanitation_waste.total ? Math.round((catScores.sanitation_waste.yes / catScores.sanitation_waste.total) * 100) : 0,
    catScores.environment_equipment.total ? Math.round((catScores.environment_equipment.yes / catScores.environment_equipment.total) * 100) : 0,
    catScores.fire_emergency.total ? Math.round((catScores.fire_emergency.yes / catScores.fire_emergency.total) * 100) : 0
  ];

  if (barChart) {
    barChart.data.datasets[0].data = catPercentages;
    barChart.update();
  }
}

// نمایش لیست سوابق
function renderHistory(filterText = '') {
  const container = document.getElementById('history-list');
  if (!container) return;

  const filtered = audits.filter(a => 
    a.inspector.includes(filterText) || 
    a.location.includes(filterText) ||
    a.date.includes(filterText)
  );

  if (filtered.length === 0) {
    container.innerHTML = '<p style="text-align:center; padding:30px; color:#94a3b8;">هیچ رکوردی یافت نشد.</p>';
    return;
  }

  container.innerHTML = filtered.map(a => `
    <div class="history-card">
      <div>
        <div style="font-weight:bold; font-size:1rem; color:#1e3a8a;">${a.location}</div>
        <div style="font-size:0.8rem; color:#64748b; margin-top:4px;">
          بازرس: ${a.inspector} | تاریخ: ${a.date} | شیفت: ${a.shift}
        </div>
        <div style="margin-top:8px;">
          <span class="badge ${a.riskClass}">${a.riskLevel} (${a.scorePercent}%)</span>
          <span style="font-size:0.8rem; margin-right:8px; color:#dc2626;">عدم انطباق: ${a.stats.no}</span>
        </div>
      </div>
      <div>
        <button onclick="viewAuditDetails('${a.id}')" class="btn btn-secondary" style="padding:6px 12px; font-size:0.8rem;">مشاهده و چاپ</button>
      </div>
    </div>
  `).join('');
}

function filterHistory() {
  const query = document.getElementById('history-search').value.trim();
  renderHistory(query);
}

// باز کردن جزییات بازرسی
function viewAuditDetails(id) {
  const audit = audits.find(a => a.id === id);
  if (!audit) return;

  currentViewingAudit = audit;
  const modalBody = document.getElementById('modal-body');
  
  modalBody.innerHTML = `
    <div style="margin-bottom:15px; border-bottom:1px solid #e2e8f0; padding-bottom:10px;">
      <p><strong>موقعیت:</strong> ${audit.location} | <strong>کد تجهیز:</strong> ${audit.equipTag}</p>
      <p><strong>بازرس:</strong> ${audit.inspector} | <strong>تاریخ ممیزی:</strong> ${audit.date}</p>
      <p><strong>نمره نهایی انطباق:</strong> ${audit.scorePercent}% | <strong>ارزیابی ریسک:</strong> ${audit.riskLevel}</p>
    </div>
    <h4>ریز نتایج بازرسی:</h4>
    <table style="width:100%; border-collapse:collapse; margin-top:10px; font-size:0.85rem;">
      <thead>
        <tr style="background:#f1f5f9; text-align:right;">
          <th style="padding:6px; border:1px solid #cbd5e1;">شرح سوال</th>
          <th style="padding:6px; border:1px solid #cbd5e1; width:70px;">وضعیت</th>
          <th style="padding:6px; border:1px solid #cbd5e1;">توضیحات و اقدامات</th>
        </tr>
      </thead>
      <tbody>
        ${audit.items.map(item => `
          <tr>
            <td style="padding:6px; border:1px solid #cbd5e1;">${item.title}</td>
            <td style="padding:6px; border:1px solid #cbd5e1; font-weight:bold; color:${item.status === 'yes' ? '#16a34a' : (item.status === 'no' ? '#dc2626' : '#6b7280')}">
              ${item.status === 'yes' ? 'منطبق' : (item.status === 'no' ? 'عدم انطباق' : 'عدم کاربرد')}
            </td>
            <td style="padding:6px; border:1px solid #cbd5e1;">${item.note || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  document.getElementById('report-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('report-modal').style.display = 'none';
}

// خروجی اکسل استاندارد مهندسی و راست‌به‌چپ (SheetJS RTL)
function exportAllToExcel() {
  if (audits.length === 0) {
    alert('رکوردی برای صدور اکسل وجود ندارد.');
    return;
  }

  const exportData = [];
  audits.forEach(a => {
    a.items.forEach(item => {
      exportData.push({
        'شناسه بازرسی': a.id,
        'تاریخ و ساعت': a.date,
        'نام بازرس': a.inspector,
        'واحد / موقعیت': a.location,
        'شیفت کاری': a.shift,
        'کد تجهیز': a.equipTag,
        'نمره کل بازدید (%)': a.scorePercent,
        'عنوان آیتم بازرسی': item.title,
        'وضعیت انطباق': item.status === 'yes' ? 'منطبق' : (item.status === 'no' ? 'عدم انطباق' : 'عدم کاربرد'),
        'شرح عدم انطباق / اقدام اصلاحی': item.note || '-'
      });
    });
  });

  const ws = XLSX.utils.json_to_sheet(exportData);
  ws['!dir'] = 'rtl'; // تنظیم خروجی راست به چپ

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'سوابق بازرسی بهداشت و ایمنی');
  XLSX.writeFile(wb, `HSE_Kitchen_Audits_${Date.now()}.xlsx`);
}

function exportCurrentToExcel() {
  if (!currentViewingAudit) return;
  const a = currentViewingAudit;
  const exportData = a.items.map(item => ({
    'تاریخ ممیزی': a.date,
    'موقعیت': a.location,
    'بازرس': a.inspector,
    'بند چک‌لیست': item.title,
    'وضعیت': item.status === 'yes' ? 'منطبق' : (item.status === 'no' ? 'عدم انطباق' : 'عدم کاربرد'),
    'توضیحات و اقدامات': item.note || '-'
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  ws['!dir'] = 'rtl';
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'گزارش تک‌بازدید');
  XLSX.writeFile(wb, `Audit_${a.id}.xlsx`);
}
