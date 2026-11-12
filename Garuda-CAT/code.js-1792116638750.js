// Navigasi Tab Utama
function switchTab(tabId) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById('tab-' + tabId).classList.add('active');
    if(document.getElementById('btn-' + tabId)) {
        document.getElementById('btn-' + tabId).classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Data Simulasi CAT (Contoh Representatif 110 Soal: 30 TWK, 35 TIU, 45 TKP)
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {}; // Simpan jawaban pengguna { index: opsi }
let userDoubt = {};   // Status ragu-ragu { index: true/false }
let timerInterval = null;
let timeLeft = 100 * 60; // 100 menit dalam detik

function generateMockQuestions() {
    questions = [];
    // 1-30: TWK
    for (let i = 1; i <= 30; i++) {
        questions.push({
            id: i,
            category: 'TWK',
            text: `Soal TWK No. ${i}: Pancasila sebagai ideologi terbuka memiliki nilai dasar, nilai instrumental, dan nilai praksis. Manakah di bawah ini yang merupakan perwujudan nilai instrumental Pancasila dalam kehidupan bernegara?`,
            options: [
                "A. Ketuhanan Yang Maha Esa dalam sanubari setiap warga negara.",
                "B. Peraturan perundang-undangan seperti UU, Peraturan Pemerintah, dan Keputusan Presiden.",
                "C. Perilaku toleransi antarumat beragama sehari-hari di masyarakat.",
                "D. Semangat gotong royong dalam membangun fasilitas umum desa.",
                "E. Keyakinan bahwa NKRI adalah harga mati."
            ],
            correct: 1 // Indeks opsi B (0-4)
        });
    }
    // 31-65: TIU
    for (let i = 31; i <= 65; i++) {
        questions.push({
            id: i,
            category: 'TIU',
            text: `Soal TIU No. ${i}: Pilihlah kelanjutan deret angka berikut yang paling tepat: 3, 6, 12, 24, 48, ...`,
            options: [
                "A. 60",
                "B. 72",
                "C. 84",
                "D. 96",
                "E. 108"
            ],
            correct: 3 // Indeks opsi D (96)
        });
    }
    // 66-110: TKP (Skoring 1 sampai 5)
    for (let i = 66; i <= 110; i++) {
        questions.push({
            id: i,
            category: 'TKP',
            text: `Soal TKP No. ${i}: Anda adalah seorang pegawai pelayanan publik di instansi pemerintah. Seorang warga datang dengan marah-marah karena berkas permohonannya terlambat diproses akibat sistem jaringan down. Sikap Anda adalah...`,
            options: [
                "A. Meminta warga tersebut untuk sabar dan kembali besok pagi tanpa memberikan penjelasan.",
                "B. Mendengarkan keluh kesahnya dengan tenang, meminta maaf atas ketidaknyamanan, dan menjelaskan kendala sistem secara transparan serta membantu mempercepat proses manual.",
                "C. Mengabaikan kemarahannya karena itu bukan kesalahan pribadi Anda.",
                "D. Melaporkan warga tersebut kepada petugas keamanan karena membuat keributan.",
                "E. Menyuruh warga tersebut untuk mengurus sendiri melalui online dari rumah."
            ],
            scores: [2, 5, 1, 3, 4] // Bobot nilai TKP khusus
        });
    }
}

function startExam() {
    generateMockQuestions();
    currentQuestionIndex = 0;
    userAnswers = {};
    userDoubt = {};
    timeLeft = 100 * 60;

    document.getElementById('simulasi-start-screen').classList.add('hidden');
    document.getElementById('simulasi-result-screen').classList.add('hidden');
    document.getElementById('simulasi-exam-screen').classList.remove('hidden');

    renderNumberPalette();
    loadQuestion(currentQuestionIndex);
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Waktu ujian telah habis!");
            finishExam();
            return;
        }
        timeLeft--;
        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;

        document.getElementById('timer-display').innerText = 
            `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    }, 1000);
}

function loadQuestion(index) {
    currentQuestionIndex = index;
    const q = questions[index];

    document.getElementById('current-category-badge').innerText = q.category;
    document.getElementById('question-number-label').innerText = `Soal Nomor ${index + 1} dari 110`;
    document.getElementById('question-text').innerText = q.text;

    let optionsHtml = '';
    q.options.forEach((opt, optIdx) => {
        let isChecked = userAnswers[index] === optIdx ? 'checked' : '';
        optionsHtml += `
            <label class="option-item">
                <input type="radio" name="exam_option" value="${optIdx}" ${isChecked} onclick="selectAnswer(${index}, ${optIdx})">
                <span>${opt}</span>
            </label>
        `;
    });
    document.getElementById('options-container').innerHTML = optionsHtml;

    updatePaletteHighlight();
}

function selectAnswer(qIndex, optIdx) {
    userAnswers[qIndex] = optIdx;
    updatePaletteHighlight();
}

function toggleRagu() {
    userDoubt[currentQuestionIndex] = !userDoubt[currentQuestionIndex];
    updatePaletteHighlight();
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
    }
}

function renderNumberPalette() {
    let gridHtml = '';
    for (let i = 0; i < questions.length; i++) {
        gridHtml += `<button class="num-btn" id="num-btn-${i}" onclick="loadQuestion(${i})">${i + 1}</button>`;
    }
    document.getElementById('number-grid').innerHTML = gridHtml;
}

function updatePaletteHighlight() {
    for (let i = 0; i < questions.length; i++) {
        let btn = document.getElementById(`num-btn-${i}`);
        if (!btn) continue;

        btn.className = 'num-btn';
        if (i === currentQuestionIndex) {
            btn.classList.add('active');
        }
        if (userAnswers[i] !== undefined) {
            btn.classList.add('answered');
        }
        if (userDoubt[i]) {
            btn.classList.add('doubt');
        }
    }
}

function finishExam() {
    if (!confirm("Apakah Anda yakin ingin menyelesaikan dan mengirimkan jawaban ujian ini?")) return;
    clearInterval(timerInterval);

    // Hitung Skor
    let scoreTWK = 0, scoreTIU = 0, scoreTKP = 0;

    questions.forEach((q, idx) => {
        let ans = userAnswers[idx];
        if (ans !== undefined) {
            if (q.category === 'TWK' || q.category === 'TIU') {
                if (ans === q.correct) {
                    if (q.category === 'TWK') scoreTWK += 5;
                    if (q.category === 'TIU') scoreTIU += 5;
                }
            } else if (q.category === 'TKP') {
                scoreTKP += q.scores[ans];
            }
        }
    });

    // Passing Grade: TWK >= 65, TIU >= 80, TKP >= 166
    let lulusTWK = scoreTWK >= 65;
    let lulusTIU = scoreTIU >= 80;
    let lulusTKP = scoreTKP >= 166;
    let lulusTotal = lulusTWK && lulusTIU && lulusTKP;

    document.getElementById('res-twk').innerText = `${scoreTWK} / 150`;
    document.getElementById('status-twk').innerText = lulusTWK ? "LULUS PG" : "TIDAK LULUS";
    document.getElementById('status-twk').style.background = lulusTWK ? "#d1fae5" : "#fee2e2";
    document.getElementById('status-twk').style.color = lulusTWK ? "#065f46" : "#b91c1c";

    document.getElementById('res-tiu').innerText = `${scoreTIU} / 175`;
    document.getElementById('status-tiu').innerText = lulusTIU ? "LULUS PG" : "TIDAK LULUS";
    document.getElementById('status-tiu').style.background = lulusTIU ? "#d1fae5" : "#fee2e2";
    document.getElementById('status-tiu').style.color = lulusTIU ? "#065f46" : "#b91c1c";

    document.getElementById('res-tkp').innerText = `${scoreTKP} / 225`;
    document.getElementById('status-tkp').innerText = lulusTKP ? "LULUS PG" : "TIDAK LULUS";
    document.getElementById('status-tkp').style.background = lulusTKP ? "#d1fae5" : "#fee2e2";
    document.getElementById('status-tkp').style.color = lulusTKP ? "#065f46" : "#b91c1c";

    let totalScore = scoreTWK + scoreTIU + scoreTKP;
    document.getElementById('res-total').innerText = totalScore;
    
    let finalStatusEl = document.getElementById('final-status-text');
    finalStatusEl.innerText = lulusTotal ? "STATUS AKHIR: LULUS SKD 🎉" : "STATUS AKHIR: BELUM LULUS (TIDAK MEMENUHI PASSING GRADE)";
    finalStatusEl.style.color = lulusTotal ? "#10b981" : "#ef4444";

    document.getElementById('simulasi-exam-screen').classList.add('hidden');
    document.getElementById('simulasi-result-screen').classList.remove('hidden');
}

function resetExam() {
    document.getElementById('simulasi-result-screen').classList.add('hidden');
    document.getElementById('simulasi-start-screen').classList.remove('hidden');
}