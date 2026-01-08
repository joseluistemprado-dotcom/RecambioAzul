export class ChatBot {
    constructor() {
        this.isOpen = false;
        this.container = null;
        this.responses = {
            'delivery': 'Nuestros plazos de entrega estimados son de 24 a 48 horas laborables para península. Recibirás un código de seguimiento por email.',
            'invoice': 'Para solicitar tu factura, puedes hacerlo desde el Área de Cliente o enviando un email a facturas@recambioazul.com con tus datos fiscales y número de pedido.',
            'return': 'Dispones de 14 días naturales para realizar devoluciones. La pieza debe conservar sus sellos de garantía intactos.',
            'compatibility': 'Nuestro selector de vehículos filtra las piezas exactas. Si tienes dudas, comprueba la referencia original del fabricante (OEM).',
            'agent': 'Nuestro horario de atención es de L-V de 9:00 a 18:00. Puedes llamarnos al 900 123 456.'
        };
    }

    init() {
        this.render();
        this.attachEvents();
    }

    render() {
        const chatbotHtml = `
            <div id="chatbot-wrapper" class="chatbot-wrapper">
                <button id="chatbot-toggle" class="chatbot-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </button>
                <div id="chatbot-window" class="chatbot-window">
                    <div class="chatbot-header">
                        <div class="chatbot-title">
                            <span class="online-indicator"></span>
                            <h4>Asistente Azul</h4>
                        </div>
                        <button id="chatbot-close" class="chatbot-close">&times;</button>
                    </div>
                    <div id="chatbot-messages" class="chatbot-messages">
                        <div class="msg bot">¡Hola! Soy tu asistente de Recambio Azul. ¿En qué puedo ayudarte hoy?</div>
                    </div>
                    <div class="chatbot-options">
                        <button class="chat-opt" data-type="delivery">🚚 Plazos de entrega</button>
                        <button class="chat-opt" data-type="invoice">📄 Solicitar factura</button>
                        <button class="chat-opt" data-type="return">↩️ Devoluciones</button>
                        <button class="chat-opt" data-type="compatibility">🧩 Compatibilidad</button>
                        <button class="chat-opt" data-type="agent">📞 Hablar con agente</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHtml);
        this.container = document.getElementById('chatbot-wrapper');
    }

    attachEvents() {
        const toggleBtn = document.getElementById('chatbot-toggle');
        const closeBtn = document.getElementById('chatbot-close');
        const chatbotWindow = document.getElementById('chatbot-window');

        toggleBtn.addEventListener('click', () => this.toggle());
        closeBtn.addEventListener('click', () => this.toggle());

        this.container.querySelectorAll('.chat-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                this.handleUserQuestion(btn.innerText, type);
            });
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.container.classList.toggle('active', this.isOpen);
    }

    handleUserQuestion(questionText, type) {
        this.addMessage(questionText, 'user');

        // Simulate typing
        setTimeout(() => {
            const answer = this.responses[type] || 'Lo siento, no entiendo esa pregunta.';
            this.addMessage(answer, 'bot');
        }, 500);
    }

    addMessage(text, side) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${side}`;
        msgDiv.innerText = text;
        messagesContainer.appendChild(msgDiv);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}
