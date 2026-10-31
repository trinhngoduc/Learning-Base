const curriculum = [
  { title: 'Làm quen với lập trình C++', desc: 'Hiểu chương trình C++ hoạt động như thế nào', lessons: ['C++ là gì? Ứng dụng trong kỹ thuật','Cài đặt môi trường và chạy chương trình đầu tiên','Cấu trúc cơ bản của một chương trình C++','Biên dịch, chạy chương trình và đọc lỗi'] },
  { title: 'Biến, kiểu dữ liệu và nhập xuất', desc: 'Làm việc với dữ liệu trong chương trình', lessons: ['Biến và cách đặt tên biến','Kiểu dữ liệu: int, float, double, char, bool','Nhập dữ liệu với cin và xuất với cout','Toán tử số học, so sánh và logic','Ép kiểu và hằng số'] },
  { title: 'Câu điều kiện và vòng lặp', desc: 'Điều khiển luồng chạy của chương trình', lessons: ['if, else if và else','switch case','Vòng lặp for','Vòng lặp while và do-while','break, continue và vòng lặp lồng nhau'] },
  { title: 'Hàm và tư duy chia nhỏ bài toán', desc: 'Tổ chức chương trình thành các phần dễ hiểu', lessons: ['Hàm là gì? Khai báo và gọi hàm','Tham số và giá trị trả về','Phạm vi biến (scope)','Truyền tham trị và tham chiếu','Tư duy phân rã bài toán'] },
  { title: 'Mảng, chuỗi và con trỏ cơ bản', desc: 'Quản lý nhiều dữ liệu và hiểu bộ nhớ', lessons: ['Mảng một chiều','Mảng hai chiều','String và xử lý chuỗi','Địa chỉ bộ nhớ và con trỏ','Vector và các thao tác cơ bản'] },
  { title: 'Lập trình hướng đối tượng (OOP)', desc: 'Mô hình hóa đối tượng trong chương trình', lessons: ['Class và Object','Thuộc tính, phương thức và constructor','Đóng gói (Encapsulation)','Kế thừa (Inheritance)','Đa hình (Polymorphism)'] },
  { title: 'C++ ứng dụng trong kỹ thuật', desc: 'Kết nối kiến thức lập trình với bài toán thực tế', lessons: ['Đọc dữ liệu cảm biến và xử lý ngưỡng','Biểu diễn trạng thái bằng biến và enum','Viết thuật toán điều khiển đơn giản','Tách chương trình thành các module','Mini project: mô phỏng hệ thống điều khiển'] },
  { title: 'Rèn luyện và dự án tổng hợp', desc: 'Củng cố kiến thức qua bài tập thực hành', lessons: ['Bài tập điều kiện và vòng lặp','Bài tập hàm và mảng','Bài tập OOP cơ bản','Đọc, sửa lỗi và cải thiện code','Hoàn thiện một dự án C++ nhỏ'] }
];
const STORAGE_KEY = 'cpp-engineering-roadmap-v1';
let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"done":{},"notes":""}');
if (!state || typeof state !== 'object') state = {done:{},notes:''};
const total = curriculum.reduce((n, c) => n + c.lessons.length, 0);
const keyFor = (ci, li) => `${ci}-${li}`;
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); updateStats(); }
function renderRoadmap(){
  const host = document.getElementById('roadmapList'); host.innerHTML = '';
  curriculum.forEach((chapter, ci) => {
    const done = chapter.lessons.filter((_, li) => state.done[keyFor(ci,li)]).length;
    const section = document.createElement('section'); section.className = 'chapter';
    const head = document.createElement('div'); head.className = 'chapter-head';
    head.innerHTML = `<div class="chapter-number">${String(ci+1).padStart(2,'0')}</div><div class="chapter-info"><b>${chapter.title}</b><small>${chapter.desc}</small></div><span class="chapter-progress">${done}/${chapter.lessons.length}</span>`;
    const list = document.createElement('div'); list.className = 'lesson-list';
    chapter.lessons.forEach((lesson, li) => {
      const label = document.createElement('label'); label.className = 'lesson' + (state.done[keyFor(ci,li)] ? ' done' : '');
      const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = !!state.done[keyFor(ci,li)]; checkbox.setAttribute('aria-label', `Hoàn thành: ${lesson}`);
      checkbox.addEventListener('change', () => { state.done[keyFor(ci,li)] = checkbox.checked; save(); renderRoadmap(); });
      const title = document.createElement('span'); title.textContent = lesson;
      const tag = document.createElement('small'); tag.textContent = `Bài ${li+1}`;
      label.append(checkbox,title,tag); list.append(label);
    });
    section.append(head,list); host.append(section);
  });
  document.getElementById('roadmapCount').textContent = `${total} bài học`;
  updateStats();
}
function updateStats(){
  const done = Object.values(state.done).filter(Boolean).length;
  const percent = Math.round(done/total*100);
  const activeChapters = curriculum.filter((c,ci) => c.lessons.some((_,li)=>state.done[keyFor(ci,li)])).length;
  document.getElementById('overallPercent').textContent = `${percent}%`;
  document.getElementById('completedCount').textContent = `${done} / ${total} bài học`;
  document.getElementById('overallBar').style.width = `${percent}%`;
  document.getElementById('chapterCount').textContent = activeChapters;
  document.getElementById('remainingCount').textContent = total-done;
  let next = null;
  outer: for(let ci=0;ci<curriculum.length;ci++) for(let li=0;li<curriculum[ci].lessons.length;li++) if(!state.done[keyFor(ci,li)]) { next={ci,li}; break outer; }
  document.getElementById('nextTitle').textContent = next ? curriculum[next.ci].lessons[next.li] : 'Bạn đã hoàn thành lộ trình!';
  document.getElementById('nextDesc').textContent = next ? `Chương ${next.ci+1}: ${curriculum[next.ci].title}` : 'Rất tốt! Hãy quay lại ôn tập hoặc tự xây dựng dự án mới.';
}
document.getElementById('notesInput').value = state.notes || '';
document.getElementById('notesInput').addEventListener('input', e => { state.notes=e.target.value; localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); document.getElementById('saveStatus').textContent='● Đã lưu'; });
document.getElementById('today').textContent = new Intl.DateTimeFormat('vi-VN',{weekday:'short',day:'numeric',month:'short',year:'numeric'}).format(new Date());
renderRoadmap();
