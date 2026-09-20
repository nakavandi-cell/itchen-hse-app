// خروجی اکسل استاندارد مهندسی و تضمینی برای موبایل و وب
function exportAllToExcel() {
  if (audits.length === 0) {
    alert('رکوردی برای صدور اکسل وجود ندارد. ابتدا حداقل یک بازرسی ثبت کنید.');
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
  ws['!dir'] = 'rtl';

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'سوابق بازرسی');

  // متد سازگار با اندروید و مرورگرها
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `HSE_Kitchen_Audits_${Date.now()}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
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

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `Audit_${a.id}.xlsx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
