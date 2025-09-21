// JAVASCRIPT PARA INTERATIVIDADE

function getQuizFeedback(score, total) {
    const percentage = total > 0 ? (score / total) * 100 : 0;
    if (percentage === 100) {
        return {
            title: 'Excelente! Pontuação Perfeita! 🚀',
            message: `Você acertou todas as ${total} perguntas. Você realmente domina este assunto. Continue assim!`
        };
    } else if (percentage >= 70) {
        return {
            title: 'Muito bem! 🎉',
            message: `Você acertou ${score} de ${total}. Um ótimo resultado! Você está no caminho certo para se tornar um mestre do Git.`
        };
    } else if (percentage >= 50) {
        return {
            title: 'Bom esforço! 👍',
            message: `Você acertou ${score} de ${total}. Você já entendeu o básico. Reveja as explicações das questões que errou para fortalecer seu conhecimento.`
        };
    } else {
        return {
            title: 'Continue estudando! 📚',
            message: `Você acertou ${score} de ${total}. Não desanime! O mais importante é aprender. Reveja a aula e as explicações com atenção e tente novamente.`
        };
    }
}

function toggleAnswer(button) {
    const answerDiv = document.getElementById('challenge-answer');
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    button.setAttribute('aria-expanded', !isExpanded);
    
    if (isExpanded) {
        answerDiv.style.display = 'none';
    } else {
        answerDiv.style.display = 'block';
        answerDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function checkQuiz() {
    // A variável 'correctAnswers' é definida em um <script> no próprio HTML,
    // pois ela é específica para cada aula.
    if (typeof correctAnswers === 'undefined') {
        console.error("A variável 'correctAnswers' não foi definida neste HTML.");
        return;
    }

    const form = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('quiz-result');
    let score = 0;
    const totalQuestions = Object.keys(correctAnswers).length;

    // Limpa explicações e bordas anteriores
    document.querySelectorAll('.explanation').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.question').forEach(el => el.style.borderLeft = '5px solid #58a6ff');

    for (const questionKey in correctAnswers) {
        const selectedOption = form.querySelector(`input[name="${questionKey}"]:checked`);
        const questionInfo = correctAnswers[questionKey];
        const questionDiv = form.querySelector(`input[name="${questionKey}"]`).closest('.question');
        const explanationDiv = questionDiv.querySelector('.explanation');

        if (selectedOption) {
            if (selectedOption.value === questionInfo.answer) {
                score++;
                questionDiv.style.borderLeft = '5px solid #3fb950'; // Verde para correto
                explanationDiv.innerHTML = `<strong>Correto!</strong> ${questionInfo.explanation}`;
            } else {
                questionDiv.style.borderLeft = '5px solid #f85149'; // Vermelho para incorreto
                explanationDiv.innerHTML = `<strong>Incorreto.</strong> A resposta correta é a alternativa <strong>${questionInfo.answer.toUpperCase()}</strong>. ${questionInfo.explanation}`;
            }
        } else {
            // Caso a questão não tenha sido respondida
            questionDiv.style.borderLeft = '5px solid #f85149';
            explanationDiv.innerHTML = `<strong>Não respondida.</strong> A resposta correta é a alternativa <strong>${questionInfo.answer.toUpperCase()}</strong>. ${questionInfo.explanation}`;
        }
        explanationDiv.style.display = 'block';
    }

    const feedback = getQuizFeedback(score, totalQuestions);
    resultDiv.innerHTML = `<h3>${feedback.title}</h3><p>${feedback.message}</p>`;
    resultDiv.style.display = 'block';
    resultDiv.className = score >= (totalQuestions / 2) ? 'success' : 'fail';
    
    // Hide check button, show retake button
    const checkBtn = document.querySelector('#quiz-form .btn[onclick="checkQuiz()"]');
    const retakeBtn = document.getElementById('retake-quiz-btn');
    if (checkBtn) checkBtn.style.display = 'none';
    if (retakeBtn) retakeBtn.style.display = 'inline-block';

    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function retakeQuiz() {
    const confirmation = window.confirm("Tem certeza que deseja refazer o quiz? Seu progresso atual será perdido.");
    if (!confirmation) {
        return; // User clicked "Cancel", so do nothing.
    }

    const form = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('quiz-result');
    const quizContainer = document.getElementById('quiz');

    // Reset the form (clears radio buttons)
    if (form) form.reset();

    // Hide results and explanations
    if (resultDiv) resultDiv.style.display = 'none';
    document.querySelectorAll('.explanation').forEach(el => {
        el.style.display = 'none';
        el.innerHTML = '';
    });

    // Reset question styles
    document.querySelectorAll('.question').forEach(el => {
        el.style.borderLeft = ''; // Reset to default CSS from stylesheet
    });

    // Show check button, hide retake button
    const checkBtn = document.querySelector('#quiz-form .btn[onclick="checkQuiz()"]');
    const retakeBtn = document.getElementById('retake-quiz-btn');
    if (checkBtn) checkBtn.style.display = 'inline-block';
    if (retakeBtn) retakeBtn.style.display = 'none';

    // Scroll to the top of the quiz
    if (quizContainer) {
        quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function runPlayground(playgroundId, outputText) {
    const outputDiv = document.querySelector(`#${playgroundId} .output`);
    if (outputDiv) {
        outputDiv.textContent = outputText;
        outputDiv.style.display = 'block';
    }
}

// Add event listeners for all playground buttons
document.addEventListener('DOMContentLoaded', () => {
    // --- Search Bar for Index Page ---
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        const lessonListItems = document.querySelectorAll('.lesson-list li');

        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            lessonListItems.forEach(item => {
                const lessonTitle = item.textContent.toLowerCase();
                if (lessonTitle.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // --- Table of Contents Generator ---
    const tocContainer = document.getElementById('toc-container');
    if (tocContainer) {
        const tocList = document.getElementById('toc-list');
        // Find all sections inside main that have an ID and contain an H2
        const sectionsWithHeader = document.querySelectorAll('main section[id] h2');

        if (sectionsWithHeader.length > 0 && tocList) {
            sectionsWithHeader.forEach(h2 => {
                const section = h2.closest('section');
                const sectionId = section.id;
                const sectionTitle = h2.textContent;

                const listItem = document.createElement('li');
                const link = document.createElement('a');
                
                link.href = `#${sectionId}`;
                link.textContent = sectionTitle;
                
                listItem.appendChild(link);
                tocList.appendChild(listItem);
            });
        } else {
            tocContainer.style.display = 'none';
        }
    }

    // --- Active TOC Link on Scroll (Scrollspy) ---
    const tocLinks = document.querySelectorAll('#toc-list a');
    if (tocLinks.length > 0) {
        const sectionsForToc = document.querySelectorAll('main section[id]');

        const tocObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const link = document.querySelector(`#toc-list a[href="#${id}"]`);

                if (entry.isIntersecting) {
                    tocLinks.forEach(l => l.classList.remove('active'));
                    if (link) {
                        link.classList.add('active');
                    }
                }
            });
        }, {
            rootMargin: '0px 0px -80% 0px' // Highlight when section is in the top 20% of the viewport
        });

        sectionsForToc.forEach(section => tocObserver.observe(section));
    }

    // --- Scroll Animation Observer ---
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // --- Back to Top Button ---
    const backToTopButton = document.getElementById('back-to-top-btn');
    if (backToTopButton) {
        const scrollFunction = () => {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        };

        window.addEventListener('scroll', scrollFunction);

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            
            progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
        });
    }

    const playgroundButtons = document.querySelectorAll('.playground .btn[data-output-text]');
    
    playgroundButtons.forEach(button => {
        button.addEventListener('click', () => {
            const playground = button.closest('.playground');
            if (playground && playground.id) {
                runPlayground(playground.id, button.dataset.outputText);
            }
        });
    });

    // Add copy-to-clipboard buttons to all <pre> blocks
    document.querySelectorAll('pre').forEach(pre => {
        const container = document.createElement('div');
        container.classList.add('code-block-container');

        const copyButton = document.createElement('button');
        copyButton.classList.add('copy-btn');
        copyButton.textContent = 'Copy';

        // Wrap the <pre> tag with the container
        pre.parentNode.insertBefore(container, pre);
        container.appendChild(pre);
        container.appendChild(copyButton);

        copyButton.addEventListener('click', () => {
            const codeToCopy = pre.textContent;
            
            navigator.clipboard.writeText(codeToCopy).then(() => {
                copyButton.textContent = 'Copied!';
                copyButton.classList.add('copied');
                
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                    copyButton.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    });
});