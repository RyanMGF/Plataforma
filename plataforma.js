document.addEventListener('DOMContentLoaded', () => {
    
    // Seleciona todos os cards de curso que estão inativos
    const inactiveCourses = document.querySelectorAll('.course-card.inactive');

    // Adiciona um evento de clique para cada curso inativo
    inactiveCourses.forEach(card => {
        card.addEventListener('click', (event) => {
            // Previne qualquer comportamento padrão (caso seja um link no futuro)
            event.preventDefault();

            // Adiciona a classe 'shake' para a animação
            card.classList.add('shake');

            // Remove a classe após a animação terminar para que possa ser reativada
            setTimeout(() => {
                card.classList.remove('shake');
            }, 300); // A duração deve ser a mesma da animação no CSS
        });
    });

    // --- Funcionalidade de Animação no Scroll ---
    const fadeInSections = document.querySelectorAll('.fade-in');

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Se a seção está visível na tela
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Para de observar a seção uma vez que ela já foi animada
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -100px 0px' // Começa a animar um pouco antes de a seção estar 100% visível
    });

    // Observa cada uma das seções com a classe .fade-in
    fadeInSections.forEach(section => sectionObserver.observe(section));
});