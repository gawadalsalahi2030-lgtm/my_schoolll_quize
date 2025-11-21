document.addEventListener('DOMContentLoaded', () => {
    // جلب العناصر الأساسية من HTML
    const form = document.getElementById('registration-form');
    const registrationCard = document.querySelector('.registration-card');
    const quizArea = document.getElementById('quiz-area');
    const quizTitle = document.getElementById('quiz-title');
    const questionContainer = document.getElementById('question-container');
    const nextButton = document.getElementById('next-button');

    // 1. تعريف الأسئلة لكل مادة (يمكنك تعديلها وإضافة المزيد)
    const allQuestions = {
        'علوم': [
            { question: "ما هو أكبر كوكب في مجموعتنا الشمسية؟", options: ["الأرض", "المشتري", "زحل"], answer: "المشتري" },
            { question: "ما هو الغاز الذي نتنفسه؟", options: ["ثاني أكسيد الكربون", "النيتروجين", "الأكسجين"], answer: "الأكسجين" },
            { question: "ما هو مصدر الطاقة الرئيسي على الأرض؟", options: ["الرياح", "الشمس", "البترول"], answer: "الشمس" }
        ],
        'رياضيات': [
            { question: "كم يساوي 7 × 8؟", options: ["48", "56", "64"], answer: "56" },
            { question: "ما هو الجذر التربيعي للعدد 81؟", options: ["9", "18", "7"], answer: "9" },
            { question: "إذا كان لديك 5 تفاحات وأكلت 2، كم يتبقى لديك؟", options: ["2", "3", "4"], answer: "3" }
        ],
        'لغة عربية': [
            { question: "ما هو جمع كلمة 'قلم'؟", options: ["قلام", "أقلام", "قلمون"], answer: "أقلام" },
            { question: "ما هي عاصمة المملكة العربية السعودية؟", options: ["الرياض", "جدة", "مكة"], answer: "الرياض" },
            { question: "ما هو الفعل الماضي لكلمة 'يكتب'؟", options: ["كتب", "كتيب", "كاتب"], answer: "كتب" }
        ]
    };

    let selectedQuestions = []; 
    let currentQuestionIndex = 0; 
    let score = 0; 
    let isAnswerSelected = false; // لتجنب الضغط على التالي دون اختيار إجابة

    // 2. معالج حدث عند إرسال نموذج التسجيل (الزر "ابدأ المسابقة")
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const name = document.getElementById('name').value.trim();
        const grade = document.getElementById('grade').value;
        const subject = document.getElementById('subject').value;

        // التحقق من اكتمال البيانات
        if (!name || grade === "اختر الصف" || subject === "اختر المادة") {
            alert('الرجاء إكمال جميع حقول التسجيل (الاسم، الصف، والمادة).');
            return; 
        }

        // إعداد الاختبار
        selectedQuestions = allQuestions[subject];
        currentQuestionIndex = 0; 
        score = 0; 
        isAnswerSelected = false;

        // إخفاء التسجيل وعرض الاختبار
        registrationCard.classList.add('hidden');
        quizArea.classList.remove('hidden');

        // تحديث العنوان وعرض السؤال الأول
        quizTitle.textContent = `مسابقة مادة ${subject}`;
        displayQuestion();
    });

    // 3. دالة لعرض السؤال الحالي
    function displayQuestion() {
        if (currentQuestionIndex < selectedQuestions.length) {
            const q = selectedQuestions[currentQuestionIndex]; 
            isAnswerSelected = false;

            // بناء HTML للسؤال وخياراته
            questionContainer.innerHTML = `
                <p><strong>السؤال ${currentQuestionIndex + 1} من ${selectedQuestions.length}:</strong> ${q.question}</p>
                <div class="options">
                    ${q.options.map(option => `<button class="option-button" data-answer="${option}">${option}</button>`).join('')}
                </div>
            `;
            
            // جعل زر التالي معطلاً حتى يتم اختيار إجابة
            nextButton.disabled = true;
            nextButton.style.opacity = 0.5;

            // إضافة معالج حدث لكل زر خيار
            document.querySelectorAll('.option-button').forEach(button => {
                button.addEventListener('click', () => selectAnswer(button, q.answer));
            });
            
            nextButton.textContent = (currentQuestionIndex === selectedQuestions.length - 1) ? "إنهاء المسابقة" : "السؤال التالي";

        } else {
            // نهاية الأسئلة
            quizArea.innerHTML = `
                <h2>نتائج المسابقة</h2>
                <p>شكراً لمشاركتك يا ${document.getElementById('name').value}.</p>
                <p>لقد حصلت على **${score} من ${selectedQuestions.length}** إجابات صحيحة.</p>
                <button id="restart-button" class="start-button">بدء اختبار جديد</button>
            `;
            document.getElementById('restart-button').addEventListener('click', restartQuiz);
        }
    }

    // 4. دالة لمعالجة اختيار الإجابة
    function selectAnswer(selectedButton, correctAnswer) {
        if (isAnswerSelected) return; // منع اختيار إجابتين

        isAnswerSelected = true;
        nextButton.disabled = false; // تفعيل زر التالي
        nextButton.style.opacity = 1;

        // تعطيل جميع أزرار الخيارات وتلوينها
        document.querySelectorAll('.option-button').forEach(button => {
            button.disabled = true;
            if (button.dataset.answer === correctAnswer) {
                button.style.backgroundColor = '#d4edda'; // أخضر: الإجابة الصحيحة
                button.style.borderColor = '#28a745';
                if (button === selectedButton) {
                    score++; // زيادة النقاط إذا كانت الإجابة صحيحة
                }
            } else if (button === selectedButton) {
                button.style.backgroundColor = '#f8d7da'; // أحمر: الإجابة الخاطئة
                button.style.borderColor = '#dc3545';
            }
        });
    }

    // 5. معالج حدث لزر "السؤال التالي"
    nextButton.addEventListener('click', () => {
        if (isAnswerSelected) {
            currentQuestionIndex++; 
            displayQuestion(); 
        } else {
            alert('الرجاء اختيار إجابة قبل الانتقال للسؤال التالي.');
        }
    });

    // 6. دالة لإعادة تشغيل الاختبار
    function restartQuiz() {
        quizArea.classList.add('hidden'); 
        registrationCard.classList.remove('hidden'); 
        form.reset(); 
        currentQuestionIndex = 0;
        score = 0;
        selectedQuestions = [];
    }
});